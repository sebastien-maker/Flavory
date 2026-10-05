<?php
/**
 * Plugin Name: Flavory cart bridge
 * Description: Neemt het winkelmandje van de nieuwe flavory.wine over in WooCommerce en stuurt door naar de checkout. Link: /?flavory_cart=13647:1,19757:2
 * Version: 1.3.0
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
// PostHog (EU): betaalde bestellingen gaan als "order_completed" naar hetzelfde project als de site.
// Dit is de openbare projectsleutel (kan alleen gebeurtenissen versturen).
const FLAVORY_POSTHOG_KEY = 'phc_wyE7EYQB42WLwnUmp7u7b8WLJScYNe74mzLTLe452BM7';
const FLAVORY_POSTHOG_HOST = 'https://eu.i.posthog.com';

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

    // Anonieme PostHog-ID's van de site (alleen meegegeven na toestemming), voor de koppeling met de aankoop.
    if (WC()->session) {
        foreach (['ph_id' => 'flavory_ph_id', 'ph_sid' => 'flavory_ph_sid'] as $param => $key) {
            if (!empty($_GET[$param])) {
                WC()->session->set($key, substr(sanitize_text_field(wp_unslash($_GET[$param])), 0, 200));
            }
        }
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

/**
 * PostHog: de ID's uit de sessie bij de bestelling bewaren, en een betaalde bestelling één keer
 * als "order_completed" versturen. Zonder ID (geen toestemming) gaat er een anonieme gebeurtenis
 * zonder persoonsprofiel weg, enkel met bedrag en producten: geen naam, e-mail of adres.
 */
add_action('woocommerce_checkout_create_order', function ($order) {
    if (!WC()->session) {
        return;
    }
    foreach (['flavory_ph_id' => '_flavory_ph_id', 'flavory_ph_sid' => '_flavory_ph_sid'] as $key => $meta) {
        $value = WC()->session->get($key);
        if ($value) {
            $order->update_meta_data($meta, $value);
        }
    }
});

function flavory_posthog_order_completed($order_id): void
{
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_flavory_ph_sent')) {
        return;
    }
    $distinct_id = $order->get_meta('_flavory_ph_id');
    $items = [];
    foreach ($order->get_items() as $item) {
        $items[] = [
            'product_id' => $item->get_product_id(),
            'name' => $item->get_name(),
            'quantity' => $item->get_quantity(),
            'price' => (float) $order->get_item_total($item, true),
        ];
    }
    $properties = [
        'order_id' => (string) $order->get_order_number(),
        'revenue' => (float) $order->get_total(),
        'value' => (float) $order->get_total(),
        'currency' => $order->get_currency(),
        'shipping' => (float) $order->get_shipping_total() + (float) $order->get_shipping_tax(),
        'tax' => (float) $order->get_total_tax(),
        'discount' => (float) $order->get_discount_total(),
        'coupons' => $order->get_coupon_codes(),
        'boxes' => $order->get_item_count(),
        'items' => $items,
        'payment_method' => $order->get_payment_method(),
        'shipping_country' => $order->get_shipping_country() ?: $order->get_billing_country(),
        'source' => 'woocommerce',
    ];
    $session_id = $order->get_meta('_flavory_ph_sid');
    if ($session_id) {
        $properties['$session_id'] = $session_id;
    }
    if (!$distinct_id) {
        $distinct_id = 'order_' . $order->get_id();
        $properties['$process_person_profile'] = false;
    }
    wp_remote_post(FLAVORY_POSTHOG_HOST . '/capture/', [
        'blocking' => false,
        'timeout' => 5,
        'headers' => ['Content-Type' => 'application/json'],
        'body' => wp_json_encode([
            'api_key' => FLAVORY_POSTHOG_KEY,
            'event' => 'order_completed',
            'distinct_id' => $distinct_id,
            'properties' => $properties,
            'timestamp' => gmdate('c'),
        ]),
    ]);
    $order->update_meta_data('_flavory_ph_sent', '1');
    $order->save();
}

// Online betaald (Mollie) of manueel op "In behandeling" gezet.
add_action('woocommerce_payment_complete', 'flavory_posthog_order_completed');
add_action('woocommerce_order_status_processing', 'flavory_posthog_order_completed');

// Einddatum van een promotie in de Store API: extensions.flavory.sale_end (JJJJ-MM-DD of null).
// De nieuwe site zet die datum als priceValidUntil in de productgegevens voor Google.
add_action('woocommerce_blocks_loaded', function () {
    if (!function_exists('woocommerce_store_api_register_endpoint_data')) {
        return;
    }
    woocommerce_store_api_register_endpoint_data([
        'endpoint' => \Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema::IDENTIFIER,
        'namespace' => 'flavory',
        'data_callback' => function ($product) {
            $end = $product->is_on_sale() ? $product->get_date_on_sale_to() : null;
            return ['sale_end' => $end ? $end->date('Y-m-d') : null];
        },
        'schema_callback' => function () {
            return [
                'sale_end' => [
                    'description' => 'Laatste dag van de promotie',
                    'type' => ['string', 'null'],
                    'context' => ['view', 'edit'],
                    'readonly' => true,
                ],
            ];
        },
        'schema_type' => ARRAY_A,
    ]);
});
