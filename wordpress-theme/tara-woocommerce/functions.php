<?php
if (!defined('ABSPATH')) { exit; }

define('TARA_THEME_VERSION', '1.0.41');
define('TARA_THEME_DIR', get_template_directory());
define('TARA_THEME_URI', get_template_directory_uri());

function tara_setup() {
    load_theme_textdomain('tara-woocommerce', TARA_THEME_DIR . '/languages');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', ['search-form','comment-form','comment-list','gallery','caption','style','script']);
    add_theme_support('custom-logo', ['height' => 90, 'width' => 220, 'flex-height' => true, 'flex-width' => true]);
    add_theme_support('woocommerce', [
        'thumbnail_image_width' => 700,
        'single_image_width' => 900,
        'product_grid' => ['default_rows' => 3, 'min_rows' => 2, 'max_rows' => 8, 'default_columns' => 4, 'min_columns' => 2, 'max_columns' => 4],
    ]);
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    register_nav_menus([
        'primary' => __('Primary menu', 'tara-woocommerce'),
        'footer'  => __('Footer menu', 'tara-woocommerce'),
    ]);
    add_image_size('tara-product-card', 700, 900, false);
}
add_action('after_setup_theme', 'tara_setup');

function tara_enqueue_assets() {
    wp_enqueue_style('tara-fonts', 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap', [], null);
    wp_enqueue_style('tara-theme', TARA_THEME_URI . '/assets/tara-theme.css', [], TARA_THEME_VERSION);
    if (is_rtl()) { wp_enqueue_style('tara-rtl', TARA_THEME_URI . '/rtl.css', ['tara-theme'], TARA_THEME_VERSION); }
    wp_enqueue_script('tara-theme', TARA_THEME_URI . '/assets/tara-theme.js', [], TARA_THEME_VERSION, true);
}
add_action('wp_enqueue_scripts', 'tara_enqueue_assets', 20);

function tara_resource_hints($urls, $relation_type) {
    if ('preconnect' === $relation_type) {
        $urls[] = ['href' => 'https://fonts.googleapis.com', 'crossorigin' => 'anonymous'];
        $urls[] = ['href' => 'https://fonts.gstatic.com', 'crossorigin' => 'anonymous'];
    }
    return $urls;
}
add_filter('wp_resource_hints', 'tara_resource_hints', 10, 2);

// Performance cleanup: keep Woo scripts only where useful.
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
add_action('wp_enqueue_scripts', function () {
    if (!is_woocommerce() && !is_cart() && !is_checkout()) {
        wp_dequeue_style('woocommerce-general');
        wp_dequeue_style('woocommerce-layout');
        wp_dequeue_style('woocommerce-smallscreen');
        wp_dequeue_script('wc-cart-fragments');
    }
}, 99);

add_filter('script_loader_tag', function ($tag, $handle) {
    if (is_admin()) { return $tag; }
    $defer = ['tara-theme', 'wc-add-to-cart', 'woocommerce', 'wc-cart-fragments'];
    if (in_array($handle, $defer, true) && false === strpos($tag, ' defer')) {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}, 10, 2);

// WooCommerce layout hooks.
remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);
remove_action('woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10);
add_action('woocommerce_before_shop_loop_item_title', 'tara_loop_product_image', 10);
function tara_loop_product_image() {
    global $product;
    echo '<div class="tara-product-image">';
    echo woocommerce_get_product_thumbnail('tara-product-card', ['loading' => 'lazy']);
    echo '</div>';
}

add_filter('woocommerce_product_add_to_cart_text', function () { return __('Add to cart', 'tara-woocommerce'); });
add_filter('woocommerce_get_price_html', function ($price, $product) {
    return '<span class="tara-price">' . $price . '</span>';
}, 10, 2);

add_filter('woocommerce_checkout_fields', function ($fields) {
    $fields['billing']['billing_first_name']['label'] = __('Full name', 'tara-woocommerce');
    $fields['billing']['billing_phone']['label'] = __('WhatsApp / phone number', 'tara-woocommerce');
    $fields['billing']['billing_city']['label'] = __('Emirate', 'tara-woocommerce');
    $fields['billing']['billing_city']['type'] = 'select';
    $fields['billing']['billing_city']['options'] = [
        '' => __('Choose emirate', 'tara-woocommerce'), 'Dubai' => 'Dubai', 'Abu Dhabi' => 'Abu Dhabi', 'Sharjah' => 'Sharjah', 'Ajman' => 'Ajman', 'Ras Al Khaimah' => 'Ras Al Khaimah', 'Fujairah' => 'Fujairah', 'Umm Al Quwain' => 'Umm Al Quwain',
    ];
    $fields['billing']['billing_address_1']['label'] = __('Delivery address', 'tara-woocommerce');
    unset($fields['billing']['billing_company'], $fields['billing']['billing_last_name'], $fields['billing']['billing_postcode']);
    return $fields;
});

add_action('woocommerce_review_order_before_payment', function () {
    echo '<div class="tara-checkout-note">' . esc_html__('Free UAE delivery on orders over AED 300. WhatsApp confirmation after order.', 'tara-woocommerce') . '</div>';
});

function tara_asset($path) { return esc_url(TARA_THEME_URI . '/assets/' . ltrim($path, '/')); }
require TARA_THEME_DIR . '/inc/product-seed.php';


// Skip cart page entirely: cart links and add-to-cart go straight to checkout.
add_filter('woocommerce_get_cart_url', function () {
    return add_query_arg('tara-checkout', '1', home_url('/'));
});
add_filter('woocommerce_add_to_cart_redirect', function () {
    return add_query_arg('tara-checkout', '1', home_url('/'));
});
add_action('template_redirect', function () {
    if (function_exists('is_cart') && is_cart()) {
        wp_safe_redirect(wc_get_checkout_url());
        exit;
    }
    if (isset($_GET['tara-checkout'])) {
        if (!headers_sent()) {
            status_header(200);
            nocache_headers();
        }
        get_header();
        echo '<style>.tara-checkout-shell{background:#f5f1eb;padding:28px 14px 54px}.tara-checkout-shell .tara-container{max-width:1120px;margin:0 auto}.tara-checkout-title{text-align:center;font-size:clamp(30px,4vw,52px);font-weight:900;letter-spacing:-.045em;margin:8px 0 26px;color:#111}.tara-checkout-shell form.checkout{display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:22px;align-items:start}.tara-checkout-shell #customer_details,.tara-checkout-shell #order_review,.tara-checkout-shell #order_review_heading{background:#fff;border:1px solid #e4ddd4;box-shadow:0 18px 44px rgba(28,20,14,.08)}.tara-checkout-shell #customer_details{padding:26px;border-radius:18px}.tara-checkout-shell #order_review_heading{grid-column:2;margin:0 0 -1px;padding:22px 24px 0;border-bottom:0;border-radius:18px 18px 0 0;font-size:18px;font-weight:900}.tara-checkout-shell #order_review{grid-column:2;padding:22px 24px 24px;border-radius:0 0 18px 18px;position:sticky;top:18px}.tara-checkout-shell .col2-set{width:100%!important;float:none!important;display:block!important}.tara-checkout-shell .col-1,.tara-checkout-shell .col-2{width:100%!important;float:none!important;max-width:none!important;padding:0!important}.tara-checkout-shell h3{font-size:18px;font-weight:900;margin:0 0 18px;color:#111}.tara-checkout-shell .form-row{margin:0 0 14px!important;padding:0!important}.tara-checkout-shell label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#5f554e;margin-bottom:7px;display:block}.tara-checkout-shell input.input-text,.tara-checkout-shell textarea,.tara-checkout-shell select{height:50px;border:1px solid #ddd4ca!important;background:#fff!important;border-radius:12px!important;padding:0 14px!important;font-size:15px!important;color:#111!important;box-shadow:none!important;outline:none!important}.tara-checkout-shell textarea{height:96px!important;padding-top:12px!important}.tara-checkout-shell #payment{background:#faf7f3!important;border:1px solid #e8dfd5!important;border-radius:16px!important}.tara-checkout-shell #place_order{width:100%;height:56px;border-radius:999px!important;background:#111!important;color:#fff!important;font-weight:900!important;text-transform:uppercase;letter-spacing:.04em;font-size:14px!important;margin-top:10px;box-shadow:0 14px 28px rgba(0,0,0,.18)}.tara-checkout-note{background:#111;color:#fff;border-radius:14px;padding:13px 15px;margin:0 0 16px;font-size:13px;font-weight:800;text-align:center}.tara-empty-checkout{max-width:520px;margin:0 auto;background:#fff;border:1px solid #e4ddd4;border-radius:22px;padding:30px 22px;text-align:center;box-shadow:0 18px 44px rgba(28,20,14,.08)}.tara-empty-checkout h2{margin:0 0 8px;font-size:26px;font-weight:900;color:#111}.tara-empty-checkout p{margin:0 0 20px;color:#6b625b;font-size:14px}.tara-disabled-checkout{height:52px;border-radius:999px;background:#d3cec7;color:#8b837b;display:flex;align-items:center;justify-content:center;font-weight:900;text-transform:uppercase;letter-spacing:.04em;margin:0 0 12px;cursor:not-allowed}.tara-continue-shopping{height:52px;border-radius:999px;background:#111;color:#fff!important;text-decoration:none;display:flex;align-items:center;justify-content:center;font-weight:900}@media(max-width:900px){.tara-checkout-shell{padding:18px 10px 36px}.tara-checkout-shell form.checkout{display:block}.tara-checkout-shell #customer_details{padding:18px;margin-bottom:14px}.tara-checkout-shell #order_review_heading{padding:18px 18px 0;margin:0;border-radius:16px 16px 0 0}.tara-checkout-shell #order_review{padding:16px 18px 18px;position:static;border-radius:0 0 16px 16px}.tara-checkout-title{font-size:31px;margin:6px 0 18px}}</style>'; 
        echo '<section class="tara-checkout-shell"><div class="tara-container"><h1 class="tara-checkout-title">Checkout</h1>';
        if (function_exists('WC') && WC()->cart && WC()->cart->is_empty()) {
            echo '<div class="tara-empty-checkout"><h2>Your bag is empty</h2><p>Add a TARA perfume first, then checkout will unlock automatically.</p><div class="tara-disabled-checkout">Checkout locked</div><a class="tara-continue-shopping" href="' . esc_url(home_url('/')) . '">Continue shopping</a></div>';
        } else {
            echo '<div class="tara-checkout-note">Free UAE delivery on orders over AED 300. WhatsApp confirmation after order.</div>';
            echo do_shortcode('[woocommerce_checkout]');
        }
        echo '</div></section>';
        get_footer();
        exit;
    }
    if (function_exists('is_checkout') && is_checkout()) {
        if (is_order_received_page()) { return; }
        if (!headers_sent()) {
            status_header(200);
            nocache_headers();
        }
        get_header();
        echo '<section class="tara-checkout-shell"><div class="tara-container"><h1 class="tara-checkout-title">Checkout</h1><div class="tara-checkout-note">Free UAE delivery on orders over AED 300. WhatsApp confirmation after order.</div>';
        echo do_shortcode('[woocommerce_checkout]');
        echo '</div></section>';
        get_footer();
        exit;
    }
});

// Premium checkout styling.
add_action('wp_enqueue_scripts', function () {
    if (!function_exists('is_checkout') || !is_checkout()) { return; }
    $css = <<<'CSS'
body.woocommerce-checkout{background:#f5f1eb;color:#111;font-family:'Noto Sans Arabic',Arial,sans-serif}
body.woocommerce-checkout .site-content,body.woocommerce-checkout .main-page-wrapper{background:#f5f1eb!important;padding:28px 14px 54px!important}
body.woocommerce-checkout .woocommerce{max-width:1120px;margin:0 auto!important}
body.woocommerce-checkout .entry-title,body.woocommerce-checkout h1{font-size:clamp(30px,4vw,52px);font-weight:800;letter-spacing:-.04em;text-align:center;margin:10px 0 26px;color:#111}
body.woocommerce-checkout form.checkout{display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:22px;align-items:start}
body.woocommerce-checkout #customer_details,body.woocommerce-checkout #order_review,body.woocommerce-checkout #order_review_heading{background:#fff;border:1px solid #e4ddd4;box-shadow:0 18px 44px rgba(28,20,14,.08)}
body.woocommerce-checkout #customer_details{padding:26px;border-radius:18px}
body.woocommerce-checkout #order_review_heading{grid-column:2;margin:0 0 -1px;padding:22px 24px 0;border-bottom:0;border-radius:18px 18px 0 0;font-size:18px;font-weight:900}
body.woocommerce-checkout #order_review{grid-column:2;padding:22px 24px 24px;border-radius:0 0 18px 18px;position:sticky;top:18px}
body.woocommerce-checkout .col2-set{width:100%!important;float:none!important;display:block!important}
body.woocommerce-checkout .col-1,body.woocommerce-checkout .col-2{width:100%!important;float:none!important;max-width:none!important;padding:0!important}
body.woocommerce-checkout h3{font-size:18px;font-weight:900;margin:0 0 18px;color:#111}
body.woocommerce-checkout .form-row{margin:0 0 14px!important;padding:0!important}
body.woocommerce-checkout label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#5f554e;margin-bottom:7px;display:block}
body.woocommerce-checkout input.input-text,body.woocommerce-checkout textarea,body.woocommerce-checkout select{height:50px;border:1px solid #ddd4ca!important;background:#fff!important;border-radius:12px!important;padding:0 14px!important;font-size:15px!important;color:#111!important;box-shadow:none!important;outline:none!important}
body.woocommerce-checkout textarea{height:96px!important;padding-top:12px!important}
body.woocommerce-checkout input:focus,body.woocommerce-checkout textarea:focus,body.woocommerce-checkout select:focus{border-color:#111!important;box-shadow:0 0 0 3px rgba(0,0,0,.05)!important}
body.woocommerce-checkout table.shop_table{border:0!important;margin:0 0 18px!important;border-collapse:collapse!important}
body.woocommerce-checkout table.shop_table th,body.woocommerce-checkout table.shop_table td{border-color:#eee7df!important;padding:13px 0!important;font-size:14px!important}
body.woocommerce-checkout .order-total th,body.woocommerce-checkout .order-total td{font-size:18px!important;font-weight:900!important;color:#111!important}
body.woocommerce-checkout #payment{background:#faf7f3!important;border:1px solid #e8dfd5!important;border-radius:16px!important}
body.woocommerce-checkout #payment ul.payment_methods{padding:16px!important;border-bottom:1px solid #e8dfd5!important}
body.woocommerce-checkout #payment div.form-row{padding:16px!important;margin:0!important}
body.woocommerce-checkout #place_order{width:100%;height:56px;border-radius:999px!important;background:#111!important;color:#fff!important;font-weight:900!important;text-transform:uppercase;letter-spacing:.04em;font-size:14px!important;margin-top:10px;box-shadow:0 14px 28px rgba(0,0,0,.18)}
body.woocommerce-checkout .tara-checkout-note{background:#111;color:#fff;border-radius:14px;padding:13px 15px;margin:0 0 16px;font-size:13px;font-weight:800;text-align:center}
body.woocommerce-checkout .woocommerce-info,body.woocommerce-checkout .woocommerce-message{max-width:1120px;margin:0 auto 16px!important;border:1px solid #dfd5ca!important;border-radius:14px!important;background:#fff!important;color:#111!important;box-shadow:none!important}
@media(max-width:900px){body.woocommerce-checkout .site-content,body.woocommerce-checkout .main-page-wrapper{padding:18px 10px 36px!important}body.woocommerce-checkout form.checkout{display:block}body.woocommerce-checkout #customer_details,body.woocommerce-checkout #order_review,body.woocommerce-checkout #order_review_heading{border-radius:16px;box-shadow:0 12px 28px rgba(28,20,14,.07)}body.woocommerce-checkout #customer_details{padding:18px;margin-bottom:14px}body.woocommerce-checkout #order_review_heading{padding:18px 18px 0;margin:0;border-radius:16px 16px 0 0}body.woocommerce-checkout #order_review{padding:16px 18px 18px;position:static;border-radius:0 0 16px 16px}body.woocommerce-checkout .entry-title,body.woocommerce-checkout h1{font-size:31px;margin:6px 0 18px}body.woocommerce-checkout input.input-text,body.woocommerce-checkout textarea,body.woocommerce-checkout select{height:48px;border-radius:12px!important}body.woocommerce-checkout #place_order{height:54px}}
CSS;
    wp_add_inline_style('tara-theme', $css);
}, 40);

