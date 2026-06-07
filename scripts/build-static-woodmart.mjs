import fs from 'node:fs'
import path from 'node:path'

const project = process.cwd()
const refDir = path.join(project, 'static', 'woodmart')
const productSrcDir = path.join(project, 'static', 'products')
const logoSrc = path.join(project, 'static', 'logo', 'tara-logo.png')
const dist = path.join(project, 'dist')
const remote = 'https://woodmart.xtemos.com'
const perfRemote = `${remote}/perfumes`

const products = [
  { slug: 'marash-al-tayyib', name: 'مرش الطيب', type: 'مرش', price: 168, image: '/images/products/1.webp', desc: 'مرش معطر من TARA بلمسة فاخرة مناسبة للمنزل والمفارش والعبايات.', options: [{ label: 'مرش', price: 168 }] },
  { slug: 'marash-sahab', name: 'مرش سحاب', type: 'مرش', price: 197, image: '/images/products/2.webp', desc: 'مرش سحاب من TARA برائحة ناعمة ومنعشة للاستخدام اليومي.', options: [{ label: 'مرش', price: 197 }] },
  { slug: 'marash-ghram', name: 'مرش غرام', type: 'مرش', price: 214, image: '/images/products/3.webp', desc: 'مرش غرام من TARA، عطر أنيق بانتشار جميل وثبات لطيف.', options: [{ label: 'مرش', price: 214 }] },
  { slug: 'marash-tara', name: 'مرش تارا', type: 'مرش', price: 188, image: '/images/products/4.webp', desc: 'مرش تارا بتوقيع فاخر ورائحة دافئة تناسب الأجواء الراقية.', options: [{ label: 'مرش', price: 188 }] },
  { slug: 'dukhoon-sheikha', name: 'دخون شيخة', type: 'دخون', price: 225, image: '/images/products/5.webp', desc: 'دخون شيخة من TARA بتركيبة فاخرة تضيف عبقاً شرقياً للمكان.', options: [{ label: 'دخون', price: 225 }] },
  { slug: 'marash-tara-clear', name: 'مرش تارا كلير', type: 'مرش', price: 196, image: '/images/products/6.webp', desc: 'مرش تارا كلير برائحة نظيفة وخفيفة للاستخدام المتكرر.', options: [{ label: 'مرش', price: 196 }] },
  { slug: 'dukhoon-sheikha-v2', name: 'دخون شيخه', type: 'دخون', price: 242, image: '/images/products/7.webp', desc: 'دخون شيخه بعبير شرقي فاخر ولمسة ذهبية راقية.', options: [{ label: 'دخون', price: 242 }] },
  { slug: 'dukhoon-sheikha-v3', name: 'دخون شيخه', type: 'دخون', price: 255, image: '/images/products/8.webp', desc: 'دخون شيخه بإحساس ملكي ودخان عطر فخم للمناسبات.', options: [{ label: 'دخون', price: 255 }] },
  { slug: 'dukhoon-alzaby', name: 'دخون الظبي', type: 'دخون', price: 170, image: '/images/products/9.webp', desc: 'دخون الظبي من TARA برائحة شرقية ناعمة ومميزة.', options: [{ label: 'دخون', price: 170 }] },
  { slug: 'marash-albadr', name: 'مرش البدر', type: 'مرش', price: 199, image: '/images/products/10.webp', desc: 'مرش البدر من TARA برائحة مشرقة وفاخرة تناسب كل الأوقات.', options: [{ label: 'مرش', price: 199 }] },
]

function formatAed(amount){ return Number(amount).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function priceMarkup(amount){ return `<span class="woocommerce-Price-currencySymbol">AED </span>${formatAed(amount)}` }

const sourceProducts = [
  { title: 'Abyss Bleu 100ml', slug: 'abyss-bleu', img: 'abyss-bleu', product: products[0] },
  { title: 'Abyss Bleu 2ml Sample', slug: 'abyss-bleu', img: 'abyss-bleu', product: products[1] },
  { title: 'Abyss Bleu 50ml', slug: 'abyss-bleu', img: 'abyss-bleu', product: products[2] },
  { title: 'Amber Bloom 100ml', slug: 'amber-bloom', img: 'amber-bloom', product: products[3] },
  { title: 'Amber Bloom 2ml Sample', slug: 'amber-bloom', img: 'amber-bloom', product: products[4] },
  { title: 'Amber Bloom 50ml', slug: 'amber-bloom', img: 'amber-bloom', product: products[5] },
  { title: 'Ember Glow 100ml', slug: 'ember-glow', img: 'ember-glow', product: products[6] },
  { title: 'Golden Veil 100ml', slug: 'golden-veil', img: 'golden-veil', product: products[7] },
  { title: 'Midnight Azure 100ml', slug: 'midnight-azure', img: 'midnight-azure', product: products[8] },
  { title: 'Amethyst Haze 100ml', slug: 'amethyst-haze', img: 'amethyst-haze', product: products[9] },
  { title: 'Amethyst Haze 2ml Sample', slug: 'amethyst-haze', img: 'amethyst-haze', product: products[0] },
  { title: 'Arctic Dusk 50ml', slug: 'arctic-dusk', img: 'arctic-dusk', product: products[1] },
  { title: 'Celestial Frost 100ml', slug: 'celestial-frost', img: 'celestial-frost', product: products[2] },
  { title: 'Celestial Surge 2ml Sample', slug: 'celestial-surge', img: 'celestial-surge', product: products[3] },
  { title: 'Glacier Bloom 2ml Sample', slug: 'glacier-bloom', img: 'glacier-bloom', product: products[4] },
  { title: 'Glacier Bloom 50ml', slug: 'glacier-bloom', img: 'glacier-bloom', product: products[5] },
  { title: 'Neptune Veil 100ml', slug: 'neptune-veil', img: 'neptune-veil', product: products[6] },
]

function ensure(dir){ fs.mkdirSync(dir, { recursive: true }) }
function escapeRegExp(str){ return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
function clean(){ fs.rmSync(dist, { recursive: true, force: true }); ensure(dist) }

function copyProductImages(){
  const out = path.join(dist, 'images', 'products')
  ensure(out)
  products.forEach((p, i) => {
    const src = path.join(productSrcDir, `${i + 1}.webp`)
    if(!fs.existsSync(src)) throw new Error(`Missing product image: ${src}`)
    fs.copyFileSync(src, path.join(out, `${i + 1}.webp`))
  })
}


function copyLogo(){
  if(!fs.existsSync(logoSrc)) throw new Error(`Missing logo: ${logoSrc}`)
  const out = path.join(dist, 'images')
  ensure(out)
  fs.copyFileSync(logoSrc, path.join(out, 'tara-logo.png'))
}

function replaceUploadUrls(block, image){
  return block
    .replace(/https:\/\/woodmart\.xtemos\.com\/perfumes\/wp-content\/uploads\/sites\/32\/2025\/11\/[^"'()\s<>]+?\.(?:jpe?g|jpg|png|webp)(?:\.webp)?/g, image)
    .replace(/https:\\?\/\\?\/woodmart\.xtemos\.com\\?\/perfumes\\?\/wp-content\\?\/uploads\\?\/sites\\?\/32\\?\/2025\\?\/11\\?\/[^"'()\s<>]+?\.(?:jpe?g|jpg|png|webp)(?:\.webp)?/g, image.replaceAll('/', '\\/'))
    .replace(/(data-image-srcset|srcset)="[^"]*\/images\/products\/[^"']*"/g, `$1="${image} 700w"`)
}

function rewriteOneProductBlock(block){
  const src = sourceProducts.find(item => block.includes(item.title))
  if(!src) return block
  const p = src.product
  let out = block
  sourceProducts.forEach(item => { out = out.replace(new RegExp(escapeRegExp(item.title), 'g'), p.name) })
  out = replaceUploadUrls(out, p.image)
  out = out.replace(/href=(['"])[^'"]*(?:\/product\/|\/perfumes\/product\/)[^'"]*\1/g, `href="/product/${p.slug}/"`)
  out = out.replace(/href=(['"])[^'"]*add-to-cart[^'"]*\1/g, 'href="/checkout/"')
  out = out.replace(/(aria-label="Add to cart: &ldquo;)[^&]+(&rdquo;")/g, `$1${p.name}$2`)
  out = out.replace(/(data-success_message="&ldquo;)[^&]+(&rdquo; has been added to your cart")/g, `$1${p.name}$2`)
  out = out.replace(/<span class="woocommerce-Price-currencySymbol">(?:&#36;|\$|AED\s*)<\/span>[\d,.]+/g, priceMarkup(p.options[0].price))
  out = out.replace(/data-product_sku="[^"]*"/g, `data-product_sku="NC-${p.slug.toUpperCase()}"`)
  return out
}

function rewriteProductCards(html){
  return html.replace(/<div class="wd-product(?=[\s"])[\s\S]*?(?=<div class="wd-product(?=[\s"])|<h2\b|<div class="wp-block-wd-products-tabs\b|<footer\b|<\/article>|$)/g, rewriteOneProductBlock)
}

function rewriteCatalogText(html){
  sourceProducts.forEach(item => {
    const p = item.product
    html = html.replace(new RegExp(escapeRegExp(item.title), 'g'), p.name)
    html = html.replace(new RegExp(`https:\\/\\/woodmart\\.xtemos\\.com\\/perfumes\\/product\\/${escapeRegExp(item.slug)}\\/`, 'g'), `/product/${p.slug}/`)
    html = html.replace(new RegExp(`https://woodmart\\.xtemos\\.com/perfumes/product/${escapeRegExp(item.slug)}/`, 'g'), `/product/${p.slug}/`)
    html = html.replace(new RegExp(`/perfumes/product/${escapeRegExp(item.slug)}/`, 'g'), `/product/${p.slug}/`)
  })
  html = html.replace(/\bEmber Glow\b/g, products[0].name)
  html = html.replace(/\bGolden Veil\b/g, products[1].name)
  html = html.replace(/\bMidnight Azure\b/g, products[2].name)
  html = html.replace(/\bAmethyst Haze\b/g, products[3].name)
  html = html.replace(/A dark, mysterious scent evoking the ocean’s deepest depths\./g, products[0].desc)
  html = html.replace(/Radiant blend of citrus, florals, and warm musks, evoking the magic of a starlit night in Los Angeles\. Luminous, sensual, and endlessly captivating\./g, products[0].desc)
  return html
}

function buildSwatches(product){
  return `<div class="wd-swatches wd-swatches-product  wd-bg-style-2 wd-text-style-2 wd-dis-style-3 wd-size-large wd-shape-square" data-nc-options="1">
${product.options.map((option, i) => `\t\t\t\t\t\t<a class="wd-swatch wd-enabled wd-text${i === 0 ? ' wd-active' : ''}" href="#" role="button" data-size="${option.label}" data-price="${option.price}">
\t\t\t\t\t\t\t<span class="wd-swatch-text">${option.label}</span>
\t\t\t\t\t\t</a>`).join('\n')}
\t\t\t\t\t</div>`
}

function injectProductOptionRuntime(html, product){
  if(!product) return html
  const payload = JSON.stringify({
    slug: product.slug,
    name: product.name,
    image: product.image,
    options: product.options,
  })
  const runtime = `<style id="nc-product-options-css">
.wd-swatches-product[data-nc-options="1"] .wd-swatch{cursor:pointer;text-decoration:none!important;transition:border-color .18s ease,background .18s ease,color .18s ease}.wd-swatches-product[data-nc-options="1"] .wd-swatch.wd-active{border-color:#111!important;box-shadow:inset 0 0 0 1px #111!important}.nc-added-msg{margin-top:10px;color:#0f7a35;font-size:13px;font-weight:600}.single_add_to_cart_button{display:flex!important;align-items:center!important;justify-content:center!important;min-height:48px!important;padding:0 28px!important;background:#211f1c!important;border:1px solid #211f1c!important;color:#fff!important;text-align:center!important;font-size:13px!important;font-weight:700!important;letter-spacing:.04em!important;text-transform:uppercase!important;line-height:1!important;box-shadow:none!important;opacity:1!important}.single_add_to_cart_button:hover{background:#000!important;border-color:#000!important;color:#fff!important}.single_add_to_cart_button.loading,.single_add_to_cart_button.added{opacity:1!important;pointer-events:auto!important}.single_add_to_cart_button:before,.single_add_to_cart_button:after,.single_add_to_cart_button.loading:before,.single_add_to_cart_button.loading:after,.single_add_to_cart_button.added:before,.single_add_to_cart_button.added:after{content:none!important;display:none!important;animation:none!important;transform:none!important}.single_add_to_cart_button .wd-action-icon{display:none!important}
</style><script id="nc-product-options-js">
(function(){
  var product = ${payload};
  function fmt(amount){ return 'AED ' + Number(amount || 0).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function priceInner(amount){ return '<span class="woocommerce-Price-currencySymbol">AED </span>' + Number(amount || 0).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function priceTargets(){ return document.querySelectorAll('.wd-single-price .amount bdi, .summary .price .amount bdi, p.price .amount bdi'); }
  function setPrice(option){
    priceTargets().forEach(function(el){ el.innerHTML = priceInner(option.price); });
    document.querySelectorAll('.single_add_to_cart_button').forEach(function(btn){
      btn.dataset.selectedSize = option.label;
      btn.dataset.selectedPrice = String(option.price);
      btn.classList.remove('loading','added');
      btn.textContent = 'Add to cart';
    });
    document.querySelectorAll('#wd-add-to-cart').forEach(function(btn){
      btn.classList.remove('loading','added');
      btn.textContent = 'Buy now';
    });
  }

  function setupSwatches(){
    var wrap = document.querySelector('.wd-swatches-product');
    if(!wrap) return;
    wrap.setAttribute('data-nc-options','1');
    var anchors = Array.prototype.slice.call(wrap.querySelectorAll('.wd-swatch'));
    product.options.forEach(function(option, i){
      var a = anchors[i];
      if(!a) return;
      a.href = '#';
      a.setAttribute('role','button');
      a.dataset.size = option.label;
      a.dataset.price = String(option.price);
      var text = a.querySelector('.wd-swatch-text') || a;
      text.textContent = option.label;
      a.classList.toggle('wd-active', i === 0);
      a.addEventListener('click', function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        anchors.forEach(function(x){ x.classList.remove('wd-active'); });
        a.classList.add('wd-active');
        setPrice(option);
      }, true);
    });
    anchors.slice(product.options.length).forEach(function(a){ a.remove(); });
    setPrice(product.options[0]);
  }
  function setupQty(){
    document.querySelectorAll('.quantity').forEach(function(q){
      var input = q.querySelector('input.qty');
      if(!input) return;
      q.querySelectorAll('.minus').forEach(function(btn){ btn.addEventListener('click', function(ev){ ev.preventDefault(); input.value = Math.max(Number(input.min || 1), Number(input.value || 1) - 1); }); });
      q.querySelectorAll('.plus').forEach(function(btn){ btn.addEventListener('click', function(ev){ ev.preventDefault(); input.value = Number(input.value || 1) + 1; }); });
    });
  }
  function setupCart(){
    document.querySelectorAll('form.cart').forEach(function(form){
      form.setAttribute('action', '/product/' + product.slug + '/');
      form.addEventListener('submit', function(ev){
        ev.preventDefault();
        var active = document.querySelector('.wd-swatches-product .wd-swatch.wd-active');
        var option = product.options.find(function(x){ return active && active.dataset.size === x.label; }) || product.options[0];
        var qtyInput = form.querySelector('input.qty');
        var qty = Math.max(1, Number(qtyInput && qtyInput.value || 1));
        try {
          var item = { slug: product.slug, name: product.name, size: option.label, priceAed: option.price, qty: qty, image: product.image };
          localStorage.setItem('niche-perfumes-last-item', JSON.stringify(item));
        } catch(e) {}
        var btn = form.querySelector('.single_add_to_cart_button') || form.querySelector('button[type="submit"]');
        if(btn){
          btn.classList.remove('loading','added');
          btn.textContent = 'Added ✓';
          setTimeout(function(){
            btn.classList.remove('loading','added');
            btn.textContent = 'Add to cart';
            btn.dataset.selectedSize = option.label;
          }, 1200);
        }

        var msg = form.querySelector('.nc-added-msg');
        if(!msg){ msg = document.createElement('div'); msg.className = 'nc-added-msg'; form.appendChild(msg); }
        msg.textContent = product.name + ' / ' + option.label + ' — ' + fmt(option.price) + ' added.';
      }, true);
    });
  }
  function init(){ setupSwatches(); setupQty(); setupCart(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
</script>`
  return html.replace('</body>', `${runtime}</body>`)
}

function rewriteNavigation(html){
  // Keep cart/checkout/add-to-cart clicks local.
  html = html.replace(/(href|action)=(['"])https:\/\/woodmart\.xtemos\.com\/perfumes\/(cart|checkout)\/?\2/g, '$1=$2/checkout/$2')
  html = html.replace(/(href|action)=(['"])https:\/\/woodmart\.xtemos\.com\/perfumes\/?\?add-to-cart=[^'"]*\2/g, '$1=$2/checkout/$2')
  html = html.replace(/(href|action)=(['"])\/perfumes\/(cart|checkout)\/?\2/g, '$1=$2/checkout/$2')
  html = html.replace(/(href|action)=(['"])\/perfumes\/?\?add-to-cart=[^'"]*\2/g, '$1=$2/checkout/$2')

  // Any remaining clickable WoodMart demo/navigation URL should never leave the Vercel site.
  html = html.replace(/href=(['"])https:\/\/woodmart\.xtemos\.com\/perfumes\/(shop|fragrances|collection|journal|about-us|wishlist|olfactive-family)[^'"]*\1/g, 'href=$1/$1')
  html = html.replace(/href=(['"])https:\/\/woodmart\.xtemos\.com\/perfumes\/?\1/g, 'href=$1/$1')

  // Final hard stop: no <a> tag is allowed to keep a WoodMart URL.
  html = html.replace(/(<a\b[^>]*\bhref=)(['"])https:\/\/woodmart\.xtemos\.com\/[^'"]*\2/gi, '$1$2/$2')
  html = html.replace(/(<a\b[^>]*\bhref=)(['"])\/perfumes\/[^'"]*\2/gi, '$1$2/$2')
  return html
}

function applyProductDetail(html, product){
  if(!product) return html
  const first = products[0]
  html = html.replace(new RegExp(escapeRegExp(first.name), 'g'), product.name)
  html = html.replace(new RegExp(escapeRegExp(first.desc), 'g'), product.desc)
  html = html.replace(new RegExp(escapeRegExp(first.image), 'g'), product.image)
  html = html.replace(/https:\/\/woodmart\.xtemos\.com\/perfumes\/wp-content\/uploads\/sites\/32\/2025\/11\/abyss-bleu(?:-[0-9]+)?(?:-[0-9]+x[0-9]+)?\.(?:jpe?g|jpg|png|webp)(?:\.webp)?/g, product.image)
  html = html.replace(/https:\\\/\\\/woodmart\.xtemos\.com\\\/perfumes\\\/wp-content\\\/uploads\\\/sites\\\/32\\\/2025\\\/11\\\/abyss-bleu(?:-[0-9]+)?(?:-[0-9]+x[0-9]+)?\.(?:jpe?g|jpg|png|webp)(?:\.webp)?/g, product.image.replaceAll('/', '\\/'))
  html = html.replace(/abyss-bleu/g, product.slug)
  html = html.replace(/(data-image-srcset|srcset)="[^"]*\/images\/products\/[^"']*"/g, `$1="${product.image} 700w"`)
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${product.name} - Niche Perfumes</title>`)
  html = html.replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${product.name} - Niche Perfumes$2`)
  html = html.replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${product.desc}$2`)
  html = html.replace(/(<meta property="og:image" content=")[^"]*(" \/>)/, `$1${product.image}$2`)
  html = html.replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, `$1/product/${product.slug}/$2`)
  html = html.replace(/<span class="woocommerce-Price-currencySymbol">(?:&#36;|\$|AED\s*)<\/span>[\d,.]+/, priceMarkup(product.options[0].price))
  html = html.replace(/(<form class="cart" action=")[^"]*(" method="post")/, `$1/product/${product.slug}/$2`)
  html = html.replace(/<div class="wd-swatches wd-swatches-product[\s\S]*?<\/div>/, buildSwatches(product))
  html = html.replace(/(<p>)[^<]*(niche perfume decant|travel-ready|extrait de parfum|Amouage|BDK Paris)[^<]*(<\/p>)/, `$1${product.desc}$3`)
  return html
}


function applyTaraBranding(html){
  const logo = '/images/tara-logo.png'
  html = html.replace(/https:\/\/woodmart\.xtemos\.com\/perfumes\/wp-content\/uploads\/sites\/32\/2025\/11\/prf-logotype-(?:white|black)\.svg/g, logo)
  html = html.replace(/https:\\\/\\\/woodmart\.xtemos\.com\\\/perfumes\\\/wp-content\\\/uploads\\\/sites\\\/32\\\/2025\\\/11\\\/prf-logotype-(?:white|black)\.svg/g, logo.replaceAll('/', '\\/'))
  html = html.replace(/Niche Center|NICHE CENTER\.?|Niche Perfumes|Noir Veil|WoodMart Perfumery|WoodMart/g, 'TARA')
  html = html.replace(/@niche_center|@xtemos\.studio/g, '@by.tara4')
  html = html.replace(/https:\/\/www\.instagram\.com\/(?:niche_center|xtemos\.studio)\//g, 'https://www.instagram.com/by.tara4/')
  html = html.replace(/New Fragrance in the Opus Essence/g, 'TARA مرشات ودخون بثبات يدوم طويلًا')
  html = html.replace(/Deep Fragrance With a Refined Intensity/g, 'لسنـا الوحيدون لكننـا نتميز')
  html = html.replace(/Light Fragrance with a Silky Touch/g, 'مـرشاتنـا تغنـيكم عن العـطور')
  html = html.replace(/Shop by Olfactory Family/g, 'تسوقي حسب النوع')
  html = html.replace(/Journal Articles/g, 'من عالم TARA')
  html = html.replace(/Scent & Sensibility/g, 'ثبات يدوم طويلًا')
  html = html.replace(/Notes of Elegance/g, 'مرشات تغنيكم عن العطور')
  html = html.replace(/The Perfume Journal/g, 'دخون فاخر للمناسبات')
  html = html.replace(/Beyond the Bottle/g, 'مرخصة من اقتصادية دبي')
  html = html.replace(/Aroma Diaries/g, 'تواصلوا عبر واتساب')
  html = html.replace(/Connect to our\s*Instagram/g, 'تابعونا على Instagram')
  html = html.replace(/At TARA, we see perfume as more than just a scent — it is identity, memory and emotion captured in a bottle\./g, 'لسنـا الوحيدون لكننـا نتميز بثبات يدوم طويلًا. مرشات TARA تغنيكم عن العطور، ودخوننا يضيف لمسة فخامة لكل مناسبة.')
  html = html.replace(/Receive exclusive content and be the first to know about product launches and special announcements\./g, 'تابعي جديد TARA من المرشات والدخون، العروض، والمنتجات الجديدة أولاً بأول.')
  html = html.replace(/TARA © 2026 created by Xtemos Studio\./g, 'TARA © 2026 — مرخصة من اقتصادية دبي. للتواصل: +971 58 883 0870')
  html = html.replace(/Fragrances/g, 'مرشات ودخون')
  html = html.replace(/Collections for Her/g, 'مرشات')
  html = html.replace(/Collections for Him/g, 'دخون')
  html = html.replace(/All Collections/g, 'كل منتجات TARA')
  html = html.replace(/Journal/g, 'Instagram')
  html = html.replace(/About Us/g, 'عن TARA')
  html = html.replace(/Contact Us/g, 'WhatsApp')
  html = html.replace(/Blog/g, 'Instagram')
  html = html.replace(/Cookies/g, 'License')
  html = html.replace(/Privacy/g, 'Dubai DED')
  html = html.replace(/Floral/g, 'مرش')
  html = html.replace(/Woody/g, 'دخون')
  html = html.replace(/Amber/g, 'تارا')
  html = html.replace(/Chypre/g, 'الطيب')
  html = html.replace(/Leather/g, 'سحاب')
  html = html.replace(/Aldehyde/g, 'غرام')
  html = html.replace(/Spicy/g, 'شيخة')
  html = html.replace(/Fougere/g, 'الظبي')
  html = html.replace(/A collection of fresh, luminous scents inspired by the mystery of nightfall\. Crisp citruses, airy florals, and cool musks evoke the serenity of moonlit skies and/g, 'تشكيلة TARA من المرشات والدخون صُممت لمن يحبون الثبات والفخامة اليومية. روائح ناعمة، حضور واضح، ولمسة شرقية أنيقة.')
  html = html.replace(/A collection of delicate, weightless fragrances that capture the essence of air and light\. Soft florals, sheer musks, and dewy accords evoke a dreamlike, ethere/g, 'مرشات TARA خيار عملي وأنيق لتعطير المنزل، المفارش، والعبايات برائحة ثابتة تغنيكم عن العطور.')
  html = html.replace(/تشكيلة TARA من المرشات والدخون صُممت لمن يحبون الثبات والفخامة اليومية\. روائح ناعمة، حضور واضح، ولمسة شرقية أنيقة\.[^<]*/g, 'تشكيلة TARA من المرشات والدخون صُممت لمن يحبون الثبات والفخامة اليومية. روائح ناعمة، حضور واضح، ولمسة شرقية أنيقة.')
  html = html.replace(/مرشات TARA خيار عملي وأنيق لتعطير المنزل، المفارش، والعبايات برائحة ثابتة تغنيكم عن العطور\.[^<]*/g, 'مرشات TARA خيار عملي وأنيق لتعطير المنزل، المفارش، والعبايات برائحة ثابتة تغنيكم عن العطور.')
  html = html.replace(/Luxury fusion of rich rose and warm oud[^<]*/g, 'لسنـا الوحيدون لكننـا نتميز بثبات يدوم طويلًا، بروائح مصممة لتبقى وتترك حضورًا راقيًا.')
  html = html.replace(/Refreshing burst of citrus and oceanic notes[^<]*/g, 'مرشاتنا تغنيكم عن العطور وتمنح المنزل والعباية رائحة فاخرة بنَفَس TARA المميز.')
  html = html.replace(/<img([^>]+)src="\/images\/tara-logo\.png"([^>]*)>/g, '<img$1src="/images/tara-logo.png"$2>')
  html = html.replace(/(<img[^>]+src="\/images\/tara-logo\.png"[^>]*style=")[^"]*(")/g, '$1max-width:150px;max-height:62px;width:auto;height:auto;object-fit:contain;$2')
  const css = `<style id="tara-branding-css">.site-logo img[src="/images/tara-logo.png"],footer img[src="/images/tara-logo.png"],.wp-block-wd-image img[src="/images/tara-logo.png"]{max-width:150px!important;max-height:62px!important;width:auto!important;height:auto!important;object-fit:contain!important}.wd-product .price,.summary .price{direction:ltr;unicode-bidi:isolate}.wd-product .product-image-link img,.woocommerce-product-gallery__image img{background:#fff!important}.wd-product .wd-entities-title a{direction:rtl}.tara-client-strip{background:#211915;color:#fff;text-align:center;padding:10px 16px;font-size:13px;letter-spacing:.02em}.tara-floating{position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;flex-direction:column;gap:10px}.tara-floating a{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:#211915;color:#fff!important;text-decoration:none!important;box-shadow:0 10px 30px rgba(0,0,0,.18);font-weight:800}.tara-floating a.wa{background:#1f7a4d}.tara-floating a.ig{background:#5b3d31}@media(max-width:768px){.tara-client-strip{font-size:12px;padding:8px 12px}.tara-floating{right:12px;bottom:12px}.tara-floating a{width:44px;height:44px}}</style>`
  const cta = `<div class="tara-floating" aria-label="TARA contact links"><a class="ig" href="https://www.instagram.com/by.tara4/" target="_blank" rel="noreferrer">IG</a><a class="wa" href="https://wa.me/971588830870" target="_blank" rel="noreferrer">WA</a></div>`
  html = html.replace('<body', '<body')
  html = html.replace('</body>', `${cta}</body>`)
  html = html.replace('</head>', `${css}</head>`)
  html = html.replace(/<body([^>]*)>/, '<body$1><div class="tara-client-strip">🤎 لسنـا الوحيدون لكننـا نتميز بثبات يدوم طويلًا — مرخصة من اقتصادية دبي — +971 58 883 0870</div>')
  return html
}

function rewriteHtml(html, page, detailProduct = null){
  // Make root-relative WoodMart assets resolve on Vercel exactly like they did in the local saved render.
  html = html.replace(/(["'(=\s])\/perfumes\//g, `$1${perfRemote}/`)
  html = html.replace(/url\(\/perfumes\//g, `url(${perfRemote}/`)
  html = html.replace(/srcset="\/perfumes\//g, `srcset="${perfRemote}/`)
  html = html.replace(/\/perfumes\/wp-content/g, `${perfRemote}/wp-content`)
  html = html.replace(/\/perfumes\/wp-includes/g, `${perfRemote}/wp-includes`)
  html = html.replace(/\/perfumes\/wp-json/g, `${perfRemote}/wp-json`)
  html = html.replace(/\/perfumes\/wp-admin/g, `${perfRemote}/wp-admin`)
  html = html.replace(/\/perfumes\/xmlrpc\.php/g, `${perfRemote}/xmlrpc.php`)
  html = html.replace(/\/perfumes\/feed\//g, `${perfRemote}/feed/`)
  html = html.replace(/\/perfumes\/comments\/feed\//g, `${perfRemote}/comments/feed/`)

  html = rewriteProductCards(html)
  html = rewriteCatalogText(html)
  html = rewriteNavigation(html)

  // Clean up duplicate host prefixes that can appear when a root-relative /perfumes path is inside an already absolute URL.
  html = html.replaceAll('https://woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')
  html = html.replaceAll('//woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')
  html = html.replaceAll('http://woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')
  html = rewriteNavigation(html)
  html = applyProductDetail(html, detailProduct)
  html = applyTaraBranding(html)

  // Runtime guard: WoodMart's remote JS can rehydrate links after load, so rewrite and intercept every click.
  const cleanup = `<style id="static-clone-cleanup">.mfp-bg,.mfp-wrap,.wd-close-side,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}html,body{overflow:auto!important}.wd-product img,.woocommerce-product-gallery__image img{object-fit:contain!important;background:#fff!important}</style><script>(function(){function localFor(h){if(!h)return null;try{var u=new URL(h,location.origin);if(u.origin===location.origin)return null;if(u.hostname!=='woodmart.xtemos.com')return null;if(/^\\/product\\//.test(u.pathname)||/^\\/perfumes\\/product\\//.test(u.pathname))return '/product/${products[0].slug}/';if(u.pathname==='/perfumes/'&&u.search.indexOf('add-to-cart=')>=0)return '/checkout/';if(/^\\/perfumes\\/(cart|checkout)\\/?$/.test(u.pathname))return '/checkout/';if(/^\\/perfumes\\//.test(u.pathname))return '/';return '/'}catch(e){return null}}function rewriteWoodmartLinks(){document.querySelectorAll('a[href],form[action]').forEach(function(el){var attr=el.tagName==='FORM'?'action':'href';var target=localFor(el.getAttribute(attr));if(target)el.setAttribute(attr,target)})}function killWoodmartDemo(){rewriteWoodmartLinks();document.querySelectorAll('.mfp-bg,.mfp-wrap,.wd-close-side,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]').forEach(function(e){e.remove()});document.querySelectorAll('a,button,div,span').forEach(function(e){if(/Buy\\s+(?:WoodMart|TARA)/i.test((e.textContent||'').trim())){var t=e.closest('a,button,.xts-buy,.xts-demos-preview,.xts-show-demos')||e;e.remove?t.remove():t.style.display='none'}});document.documentElement.style.overflow='auto';if(document.body)document.body.style.overflow='auto'}document.addEventListener('click',function(ev){var a=ev.target&&ev.target.closest&&ev.target.closest('a[href]');if(!a)return;var target=localFor(a.getAttribute('href'));if(target){ev.preventDefault();ev.stopPropagation();location.href=target}},true);killWoodmartDemo();document.addEventListener('DOMContentLoaded',killWoodmartDemo);window.addEventListener('load',killWoodmartDemo);new MutationObserver(killWoodmartDemo).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href','action']});})();</script>`
  html = html.replace('</head>', `${cleanup}<meta name="static-clone" content="woodmart-${page}"></head>`)
  html = html.replace(/<span class="woocommerce-Price-currencySymbol">(?:&#36;|\$)<\/span>/g, '<span class="woocommerce-Price-currencySymbol">AED </span>')
  html = injectProductOptionRuntime(html, detailProduct)
  return html
}

function copyPage(srcName, outPath, page, detailProduct = null){
  const src = path.join(refDir, srcName)
  if(!fs.existsSync(src)) throw new Error(`Missing saved WoodMart file: ${src}`)
  ensure(path.dirname(outPath))
  const html = rewriteHtml(fs.readFileSync(src, 'utf8'), page, detailProduct)
  fs.writeFileSync(outPath, html)
}

clean()
copyProductImages()
copyLogo()
copyPage('home-full.html', path.join(dist, 'index.html'), 'home')
copyPage('home-full.html', path.join(dist, 'home-full.html'), 'home')
copyPage('product-full.html', path.join(dist, 'product-full.html'), 'product', products[0])
products.forEach(product => copyPage('product-full.html', path.join(dist, 'product', product.slug, 'index.html'), 'product', product))

// Minimal static checkout route so old links don't 404.
copyPage('product-full.html', path.join(dist, 'checkout', 'index.html'), 'checkout-placeholder', products[0])

console.log(`Static WoodMart clone built to ${dist}`)
console.log(`Routes: /, /home-full.html, /product-full.html, /checkout/, ${products.map(p => `/product/${p.slug}/`).join(', ')}`)
