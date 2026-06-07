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
    .replace(/https:\/\/woodmart\.xtemos\.com\/images\/products\/[^"'()\s<>]+?\.webp/g, image)
    .replace(/https:\\?\/\\?\/woodmart\.xtemos\.com\\?\/perfumes\\?\/wp-content\\?\/uploads\\?\/sites\\?\/32\\?\/2025\\?\/11\\?\/[^"'()\s<>]+?\.(?:jpe?g|jpg|png|webp)(?:\.webp)?/g, image.replaceAll('/', '\\/'))
    .replace(/https:\\?\/\\?\/woodmart\.xtemos\.com\\?\/images\\?\/products\\?\/[^"'()\s<>]+?\.webp/g, image.replaceAll('/', '\\/'))
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
          localStorage.setItem('tara-cart', JSON.stringify([{ slug: item.slug, name: item.name, size: item.size, price: item.priceAed, qty: item.qty, image: item.image }]));
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

function removeInstagramFeedSection(html){
  return html.replace(/<div class="wp-block-wd-row wd-0a8b8d92">[\s\S]*?(?=\s*<\/article>)/, '')
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
  html = removeInstagramFeedSection(html)
  html = injectGlobalCartRuntime(html)

  // Runtime guard: WoodMart's remote JS can rehydrate links after load, so rewrite and intercept every click.
  const cleanup = `<style id="static-clone-cleanup">.mfp-bg,.mfp-wrap,.wd-close-side,.cart-widget-side,.wd-side-hidden.wd-right,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}html,body{overflow:auto!important}.wd-product img,.woocommerce-product-gallery__image img{object-fit:contain!important;background:#fff!important}</style><script>(function(){function localFor(h){if(!h)return null;try{var u=new URL(h,location.origin);if(u.origin===location.origin)return null;if(u.hostname!=='woodmart.xtemos.com')return null;if(/^\\/product\\//.test(u.pathname)||/^\\/perfumes\\/product\\//.test(u.pathname))return '/product/${products[0].slug}/';if(u.pathname==='/perfumes/'&&u.search.indexOf('add-to-cart=')>=0)return '/checkout/';if(/^\\/perfumes\\/(cart|checkout)\\/?$/.test(u.pathname))return '/checkout/';if(/^\\/perfumes\\//.test(u.pathname))return '/';return '/'}catch(e){return null}}function rewriteWoodmartLinks(){document.querySelectorAll('a[href],form[action]').forEach(function(el){var attr=el.tagName==='FORM'?'action':'href';var target=localFor(el.getAttribute(attr));if(target)el.setAttribute(attr,target)})}function killWoodmartDemo(){rewriteWoodmartLinks();document.querySelectorAll('.mfp-bg,.mfp-wrap,.wd-close-side,.cart-widget-side,.wd-side-hidden.wd-right,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]').forEach(function(e){e.remove()});document.querySelectorAll('a,button,div,span').forEach(function(e){if(/Buy\\s+(?:WoodMart|TARA)/i.test((e.textContent||'').trim())){var t=e.closest('a,button,.xts-buy,.xts-demos-preview,.xts-show-demos')||e;e.remove?t.remove():t.style.display='none'}});document.documentElement.style.overflow='auto';if(document.body)document.body.style.overflow='auto'}document.addEventListener('click',function(ev){var a=ev.target&&ev.target.closest&&ev.target.closest('a[href]');if(!a)return;var target=localFor(a.getAttribute('href'));if(target){ev.preventDefault();ev.stopPropagation();location.href=target}},true);killWoodmartDemo();document.addEventListener('DOMContentLoaded',killWoodmartDemo);window.addEventListener('load',killWoodmartDemo);new MutationObserver(killWoodmartDemo).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href','action']});})();</script>`
  html = html.replace('</head>', `${cleanup}<meta name="static-clone" content="woodmart-${page}"></head>`)
  html = html.replace(/<span class="woocommerce-Price-currencySymbol">(?:&#36;|\$)<\/span>/g, '<span class="woocommerce-Price-currencySymbol">AED </span>')
  html = injectProductOptionRuntime(html, detailProduct)
  return html
}



function injectGlobalCartRuntime(html){
  const payload = JSON.stringify(products.map(p => ({ slug:p.slug, name:p.name, type:p.type, price:p.price, image:p.image })))
  const runtime = `<script id="tara-global-cart-js">
(function(){
  var products=${payload};
  function saveProduct(product){
    if(!product) return;
    try{ localStorage.setItem('tara-cart', JSON.stringify([{slug:product.slug,name:product.name,type:product.type,price:Number(product.price),qty:1,image:product.image}])); }catch(e){}
  }
  function findProduct(el){
    var txt='';
    var card=el.closest&&el.closest('.wd-product');
    if(card) txt=(card.textContent||'');
    txt += ' ' + (el.getAttribute('aria-label')||'') + ' ' + (el.getAttribute('data-success_message')||'');
    return products.find(function(p){ return txt.indexOf(p.name)>=0; }) || products[0];
  }
  function normalizeLinks(){
    document.querySelectorAll('a[href*="/cart"],a[href*="/checkout"],.cart-widget-opener a,.wd-header-cart a').forEach(function(a){ a.setAttribute('href','/checkout/'); });
    document.querySelectorAll('.add_to_cart_button').forEach(function(a){ a.setAttribute('href','/checkout/'); });
  }
  document.addEventListener('click',function(ev){
    var add=ev.target&&ev.target.closest&&ev.target.closest('.add_to_cart_button');
    if(add){ saveProduct(findProduct(add)); add.setAttribute('href','/checkout/'); }
    var cart=ev.target&&ev.target.closest&&ev.target.closest('.cart-widget-opener,.wd-header-cart');
    if(cart){ ev.preventDefault(); ev.stopPropagation(); location.href='/checkout/'; }
  },true);
  normalizeLinks();
  document.addEventListener('DOMContentLoaded',normalizeLinks);
  window.addEventListener('load',normalizeLinks);
})();
</script>`
  return html.replace('</body>', `${runtime}</body>`)
}

function buildCheckoutPage(){
  const productData = JSON.stringify(products)
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>إتمام الطلب | TARA</title>
  <meta name="robots" content="noindex,follow">
  <style>
    :root{--ink:#211915;--muted:#6f665f;--line:#e9e2dc;--soft:#faf7f4;--accent:#5b3d31;--green:#1f7a4d}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,Tahoma,sans-serif;color:var(--ink);background:#fff;line-height:1.5}a{color:inherit}.top{background:#211915;color:#fff;text-align:center;padding:9px 14px;font-size:13px}.header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px clamp(16px,4vw,54px);border-bottom:1px solid var(--line);direction:ltr}.logo img{width:150px;height:auto;display:block}.header a{text-decoration:none;font-weight:700}.wrap{max-width:1180px;margin:0 auto;padding:38px clamp(16px,4vw,54px) 70px}.title{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:28px}.title h1{margin:0;font-size:clamp(34px,5vw,64px);font-weight:500;letter-spacing:-.04em}.title p{margin:0;color:var(--muted);max-width:520px}.grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(320px,.8fr);gap:28px;align-items:start}.card{border:1px solid var(--line);background:#fff}.card-h{padding:22px 24px;border-bottom:1px solid var(--line);font-weight:800;font-size:20px}.card-b{padding:24px}.fields{display:grid;grid-template-columns:1fr 1fr;gap:16px}.field{display:flex;flex-direction:column;gap:7px;text-align:right}.field.full{grid-column:1/-1}label{font-size:13px;font-weight:800}.req{color:#b42318}input,select,textarea{width:100%;border:1px solid #d8d0c8;background:#fff;padding:13px 14px;font:inherit;border-radius:0;outline:none}input:focus,select:focus,textarea:focus{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}textarea{min-height:96px;resize:vertical}.pay{display:grid;gap:10px;margin-top:18px}.pay label{display:flex;align-items:center;gap:10px;border:1px solid var(--line);padding:14px;background:var(--soft);cursor:pointer}.pay input{width:auto}.summary-item{display:grid;grid-template-columns:74px 1fr auto;gap:14px;align-items:center;border-bottom:1px solid var(--line);padding:0 0 18px;margin-bottom:18px;direction:rtl}.summary-item img{width:74px;height:74px;object-fit:contain;background:#fff;border:1px solid var(--line)}.summary-item h3{margin:0 0 4px;font-size:16px}.summary-item p{margin:0;color:var(--muted);font-size:13px}.qty{display:flex;align-items:center;gap:8px;margin-top:10px}.qty button{width:30px;height:30px;border:1px solid var(--line);background:#fff;cursor:pointer}.qty span{min-width:24px;text-align:center}.totals{display:grid;gap:11px}.row{display:flex;justify-content:space-between;gap:14px}.row.total{font-size:22px;font-weight:900;border-top:1px solid var(--line);padding-top:16px;margin-top:6px}.note{background:var(--soft);border:1px solid var(--line);padding:12px 14px;color:var(--muted);font-size:13px;margin-top:14px}.btn{width:100%;border:0;background:var(--ink);color:#fff;padding:16px 20px;font-weight:900;font-size:16px;cursor:pointer;margin-top:18px}.btn:hover{background:#000}.btn.wa{background:var(--green)}.empty{text-align:center;padding:24px;background:var(--soft);border:1px dashed var(--line)}.error{display:none;background:#fff1f0;color:#9f1d16;border:1px solid #ffc9c4;padding:12px;margin-bottom:14px}.success{display:none;background:#f0fff5;color:#126b3a;border:1px solid #b7ebc6;padding:12px;margin-top:14px}.ltr{direction:ltr;unicode-bidi:isolate}.floating{position:fixed;right:18px;bottom:18px;display:flex;flex-direction:column;gap:10px;z-index:10}.floating a{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;text-decoration:none;font-weight:900}.floating .ig{background:#5b3d31}.floating .wa{background:#1f7a4d}@media(max-width:820px){.header{padding:16px}.grid{grid-template-columns:1fr}.fields{grid-template-columns:1fr}.title{display:block}.title p{margin-top:10px}.summary{order:-1}.floating{right:12px;bottom:12px}.floating a{width:44px;height:44px}}
  </style>
</head>
<body>
  <div class="top">🤎 توصيل داخل الإمارات — الدفع عند الاستلام أو تأكيد الطلب عبر واتساب — <span class="ltr">+971 58 883 0870</span></div>
  <header class="header"><a class="logo" href="/"><img src="/images/tara-logo.png" alt="TARA"></a><a href="/">العودة للتسوق</a></header>
  <main class="wrap">
    <div class="title"><h1>إتمام الطلب</h1><p>املئي بيانات التوصيل داخل الإمارات. بعد الإرسال سيتم فتح واتساب برسالة الطلب جاهزة لتأكيدها مع فريق TARA.</p></div>
    <div class="grid">
      <section class="card"><div class="card-h">بيانات التوصيل في الإمارات</div><div class="card-b">
        <div id="err" class="error"></div>
        <form id="checkout-form" novalidate>
          <div class="fields">
            <div class="field"><label>الاسم الكامل <span class="req">*</span></label><input name="name" autocomplete="name" required></div>
            <div class="field"><label>رقم الموبايل الإماراتي <span class="req">*</span></label><input name="phone" dir="ltr" inputmode="tel" placeholder="05XXXXXXXX" autocomplete="tel" required></div>
            <div class="field"><label>الإمارة <span class="req">*</span></label><select name="emirate" required><option value="">اختاري الإمارة</option><option>Dubai</option><option>Abu Dhabi</option><option>Sharjah</option><option>Ajman</option><option>Ras Al Khaimah</option><option>Fujairah</option><option>Umm Al Quwain</option></select></div>
            <div class="field"><label>المنطقة <span class="req">*</span></label><input name="area" placeholder="مثال: Jumeirah / Khalifa City" required></div>
            <div class="field full"><label>العنوان الكامل <span class="req">*</span></label><textarea name="address" placeholder="الشارع، رقم الفيلا/الشقة، أقرب معلم" required></textarea></div>
            <div class="field full"><label>ملاحظات اختيارية</label><textarea name="notes" placeholder="وقت التوصيل المناسب أو أي ملاحظة"></textarea></div>
          </div>
          <div class="pay">
            <label><input type="radio" name="payment" value="الدفع عند الاستلام" checked> الدفع عند الاستلام داخل الإمارات</label>
            <label><input type="radio" name="payment" value="تأكيد عبر واتساب"> تأكيد الطلب عبر واتساب</label>
          </div>
          <button class="btn wa" type="submit">إرسال الطلب على واتساب</button>
          <div id="ok" class="success">تم تجهيز رسالة الطلب، سيتم فتح واتساب الآن.</div>
        </form>
      </div></section>
      <aside class="card summary"><div class="card-h">ملخص الطلب</div><div class="card-b"><div id="items"></div><div id="empty" class="empty" hidden>السلة فارغة. اختاري منتجاً من المتجر أولاً.</div><div class="totals"><div class="row"><span>المجموع</span><strong id="subtotal">AED 0.00</strong></div><div class="row"><span>توصيل الإمارات</span><strong id="delivery">AED 20.00</strong></div><div class="row total"><span>الإجمالي</span><strong id="total">AED 0.00</strong></div></div><div class="note">التوصيل داخل الإمارات. التوصيل مجاني للطلبات من AED 250 وما فوق.</div><button class="btn" id="clear" type="button">تفريغ السلة</button></div></aside>
    </div>
  </main>
  <div class="floating"><a class="ig" href="https://www.instagram.com/by.tara4/">IG</a><a class="wa" href="https://wa.me/971588830870">WA</a></div>
<script>
const PRODUCTS=${productData};
const storeKey='tara-cart';
function money(n){return 'AED '+Number(n||0).toLocaleString('en-AE',{minimumFractionDigits:2,maximumFractionDigits:2})}
function normalizeLegacy(){try{let cart=JSON.parse(localStorage.getItem(storeKey)||'null');if(Array.isArray(cart)&&cart.length)return cart;let last=JSON.parse(localStorage.getItem('niche-perfumes-last-item')||'null');if(last&&last.name)return [{slug:last.slug,name:last.name,image:last.image,price:Number(last.priceAed||last.price||0),qty:Number(last.qty||1)}];}catch(e){}return []}
let cart=normalizeLegacy();
function save(){localStorage.setItem(storeKey,JSON.stringify(cart))}
function render(){const box=document.getElementById('items'),empty=document.getElementById('empty');box.innerHTML='';empty.hidden=cart.length>0;cart.forEach((it,i)=>{let row=document.createElement('div');row.className='summary-item';row.innerHTML='<img src="'+it.image+'" alt=""><div><h3>'+it.name+'</h3><p>'+(it.size||it.type||'TARA')+'</p><div class="qty"><button type="button" data-q="-1" data-i="'+i+'">−</button><span>'+it.qty+'</span><button type="button" data-q="1" data-i="'+i+'">+</button></div></div><strong>'+money(it.price*it.qty)+'</strong>';box.appendChild(row)});let sub=cart.reduce((s,it)=>s+(Number(it.price)||0)*(Number(it.qty)||1),0);let del=sub>=250||sub===0?0:20;document.getElementById('subtotal').textContent=money(sub);document.getElementById('delivery').textContent=del?money(del):'مجاني';document.getElementById('total').textContent=money(sub+del)}
document.addEventListener('click',e=>{let b=e.target.closest('[data-q]');if(!b)return;let i=+b.dataset.i;cart[i].qty=Math.max(1,(+cart[i].qty||1)+(+b.dataset.q));save();render()});
document.getElementById('clear').onclick=()=>{cart=[];save();render()};
document.getElementById('checkout-form').addEventListener('submit',e=>{e.preventDefault();let err=document.getElementById('err'),ok=document.getElementById('ok');err.style.display='none';ok.style.display='none';if(!cart.length){err.textContent='السلة فارغة. اختاري منتجاً قبل إرسال الطلب.';err.style.display='block';return}let fd=new FormData(e.currentTarget);let phone=(fd.get('phone')||'').trim();let clean=phone.split(' ').join('').split('-').join('');let local=clean;if(local.indexOf('+971')===0)local='0'+local.slice(4);else if(local.indexOf('971')===0)local='0'+local.slice(3);let validPhone=local.length===10&&local.indexOf('05')===0&&Array.from(local).every(ch=>ch>='0'&&ch<='9');if(!validPhone){err.textContent='اكتبي رقم موبايل إماراتي صحيح مثل 05XXXXXXXX.';err.style.display='block';return}phone=local;for(let k of ['name','emirate','area','address']){if(!(fd.get(k)||'').trim()){err.textContent='يرجى تعبئة كل الحقول المطلوبة.';err.style.display='block';return}}let sub=cart.reduce((s,it)=>s+(Number(it.price)||0)*(Number(it.qty)||1),0),del=sub>=250?0:20,total=sub+del;let lines=['طلب جديد من موقع TARA','',...cart.map((it,idx)=>(idx+1)+'. '+it.name+' - '+it.qty+' × '+money(it.price)+' = '+money(it.price*it.qty)),'','المجموع: '+money(sub),'التوصيل: '+(del?money(del):'مجاني'),'الإجمالي: '+money(total),'','الاسم: '+fd.get('name'),'الهاتف: '+phone,'الإمارة: '+fd.get('emirate'),'المنطقة: '+fd.get('area'),'العنوان: '+fd.get('address'),'الدفع: '+fd.get('payment'),'ملاحظات: '+(fd.get('notes')||'-')];ok.style.display='block';window.open('https://wa.me/971588830870?text='+encodeURIComponent(lines.join(String.fromCharCode(10))),'_blank')});
render();
</script>
</body></html>`
  ensure(path.join(dist, 'checkout'))
  fs.writeFileSync(path.join(dist, 'checkout', 'index.html'), html)
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

buildCheckoutPage()

console.log(`Static WoodMart clone built to ${dist}`)
console.log(`Routes: /, /home-full.html, /product-full.html, /checkout/, ${products.map(p => `/product/${p.slug}/`).join(', ')}`)
