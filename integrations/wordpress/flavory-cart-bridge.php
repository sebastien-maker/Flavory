<?php
/**
 * Plugin Name: Flavory cart bridge
 * Description: Neemt het winkelmandje van de nieuwe flavory.wine over in WooCommerce en stuurt door naar de checkout. Link: /?flavory_cart=13647:1,19757:2
 * Version: 1.0.0
 * Requires Plugins: woocommerce
 *
 * Installeren: dit bestand in wp-content/mu-plugins/ zetten (dan staat het altijd aan), of als gewone plugin uploaden.
 * Zie docs/woocommerce-koppeling.md in de repository van de nieuwe site.
 */

defined('ABSPATH') || exit;

// Waar een bezoeker terechtkomt als geen enkele box in het winkelmandje kan (bv. uitverkocht).
const FLAVORY_SHOP_URL = 'https://flavory.wine/shop/';
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
