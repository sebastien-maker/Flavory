<?php
/**
 * Plugin Name: Flavory cart bridge
 * Description: Neemt het winkelmandje van de nieuwe flavory.wine over in WooCommerce en stuurt door naar de checkout. Link: /?flavory_cart=13647:1,19757:2
 * Version: 1.1.0
 * Requires Plugins: woocommerce
 *
 * Installeren: dit bestand in wp-content/mu-plugins/ zetten (dan staat het altijd aan), of als gewone plugin uploaden.
 * Zie docs/woocommerce-koppeling.md in de repository van de nieuwe site.
 */

defined('ABSPATH') || exit;

// De nieuwe site. Na de lancering draait WordPress op www.flavory.wine en doet het alleen nog de winkel.
const FLAVORY_SITE_URL = 'https://flavory.wine';
// Waar een bezoeker terechtkomt als geen enkele box in het winkelmandje kan (bv. uitverkocht).
const FLAVORY_SHOP_URL = FLAVORY_SITE_URL . '/shop/';
// Hoogste aantal per box, gelijk aan de nieuwe site.
const FLAVORY_MAX_QTY = 20;

add_action('wp_loaded', function () {
    if (empty($_GET['flavory_cart']) || !function_exists('WC')) {
        return;
    }

    // "13647:1,19757:2" -> [13647 => 1, 19757 => 2]
    $items = [];
    $raw = sanitize_text_field(wp_unslash($_GET['flavory_cart']));
    foreach (explode(',', $raw) as $pair) {
        $parts = explode(':', $pair, 2);
        $id = absint($parts[0]);
        $qty = isset($parts[1]) ? absint($parts[1]) : 1;
        if ($id > 0) {
            $items[$id] = min(FLAVORY_MAX_QTY, max(1, $qty));
        }
    }
    if (!$items) {
        return;
    }

    if (null === WC()->cart) {
        wc_load_cart();
    }
    // Een gast krijgt meteen een sessie, anders is het winkelmandje weg na de doorverwijzing.
    if (WC()->session && !WC()->session->has_session()) {
        WC()->session->set_customer_session_cookie(true);
    }

    // Het winkelmandje op de nieuwe site is de waarheid: eerst leegmaken, dan vullen.
    WC()->cart->empty_cart();
    foreach ($items as $id => $qty) {
        $product = wc_get_product($id);
        if ($product && $product->is_purchasable() && $product->is_in_stock()) {
            WC()->cart->add_to_cart($id, $qty);
        }
    }

    // Kortingscode meegeven kan met &coupon=CODE.
    if (!empty($_GET['coupon']) && !WC()->cart->is_empty()) {
        WC()->cart->apply_coupon(wc_format_coupon_code(wp_unslash($_GET['coupon'])));
    }

    wp_safe_redirect(WC()->cart->is_empty() ? FLAVORY_SHOP_URL : wc_get_checkout_url());
    exit;
}, 20);

// De nieuwe site staat op een ander (sub)domein: toelaten als doorverwijsdoel.
add_filter('allowed_redirect_hosts', function ($hosts) {
    $hosts[] = 'flavory.wine';
    return $hosts;
});

/**
 * Na de lancering (WordPress-adres = www.flavory.wine): WordPress is alleen nog de kassa.
 * Winkelmandje, checkout, account en beheer blijven; elke andere pagina gaat met een 301 naar
 * dezelfde URL op de nieuwe site, en niets van WordPress wordt nog geïndexeerd.
 * Zolang WordPress zelf op flavory.wine staat, doet dit niets.
 */
function flavory_is_checkout_only(): bool
{
    $wp_host = wp_parse_url(home_url(), PHP_URL_HOST);
    return $wp_host && $wp_host !== wp_parse_url(FLAVORY_SITE_URL, PHP_URL_HOST);
}

add_action('template_redirect', function () {
    if (!flavory_is_checkout_only() || !function_exists('is_checkout')) {
        return;
    }
    if (is_cart() || is_checkout() || is_account_page() || is_wc_endpoint_url()) {
        return;
    }
    $path = wp_parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    wp_redirect(FLAVORY_SITE_URL . $path, 301);
    exit;
}, 1);

add_filter('wp_robots', function ($robots) {
    if (flavory_is_checkout_only()) {
        $robots['noindex'] = true;
        $robots['nofollow'] = true;
    }
    return $robots;
});

add_action('send_headers', function () {
    if (flavory_is_checkout_only()) {
        header('X-Robots-Tag: noindex, nofollow', true);
    }
});
