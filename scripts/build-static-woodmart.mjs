import fs from 'node:fs'
import path from 'node:path'

const project = process.cwd()
const refDir = path.join(project, 'static', 'woodmart')
const productSrcDir = path.join(project, 'static', 'products')
const dist = path.join(project, 'dist')
const remote = 'https://woodmart.xtemos.com'
const perfRemote = `${remote}/perfumes`

const products = [
  { slug: 'bdk-paris-gris-decant', name: 'BDK Paris Gris Decant', price: '35.00', image: '/images/products/1.webp', desc: 'A refined BDK Paris niche perfume decant available in 2ml, 5ml, and 10ml spray sizes.' },
  { slug: 'bdk-paris-emerald-decant', name: 'BDK Paris Emerald Decant', price: '35.00', image: '/images/products/2.webp', desc: 'A fresh green BDK Paris niche fragrance decant prepared in travel-ready atomizers.' },
  { slug: 'bdk-paris-rouge-decant', name: 'BDK Paris Rouge Decant', price: '35.00', image: '/images/products/3.webp', desc: 'A bold red BDK Paris niche fragrance decant with 2ml, 5ml, and 10ml options.' },
  { slug: 'maison-crivelli-cuir-infrarouge', name: 'Maison Crivelli Cuir InfraRouge', price: '45.00', image: '/images/products/4.webp', desc: 'Maison Crivelli Cuir InfraRouge extrait de parfum decant in premium spray sizes.' },
  { slug: 'amouage-reasons-decant', name: 'Amouage Reasons Decant', price: '45.00', image: '/images/products/5.webp', desc: 'Amouage Reasons perfume decant, bottled in clean 2ml, 5ml, and 10ml atomizers.' },
  { slug: 'amouage-reflection-decant', name: 'Amouage Reflection Decant', price: '45.00', image: '/images/products/6.webp', desc: 'Amouage Reflection niche perfume decant with elegant travel spray presentation.' },
]

const sourceProducts = [
  { title: 'Abyss Bleu 100ml', slug: 'abyss-bleu', img: 'abyss-bleu', product: products[0] },
  { title: 'Abyss Bleu 2ml Sample', slug: 'abyss-bleu', img: 'abyss-bleu', product: products[1] },
  { title: 'Abyss Bleu 50ml', slug: 'abyss-bleu', img: 'abyss-bleu', product: products[2] },
  { title: 'Amber Bloom 100ml', slug: 'amber-bloom', img: 'amber-bloom', product: products[3] },
  { title: 'Amber Bloom 2ml Sample', slug: 'amber-bloom', img: 'amber-bloom', product: products[4] },
  { title: 'Amber Bloom 50ml', slug: 'amber-bloom', img: 'amber-bloom', product: products[5] },
  { title: 'Ember Glow 100ml', slug: 'ember-glow', img: 'ember-glow', product: products[0] },
  { title: 'Golden Veil 100ml', slug: 'golden-veil', img: 'golden-veil', product: products[1] },
  { title: 'Midnight Azure 100ml', slug: 'midnight-azure', img: 'midnight-azure', product: products[2] },
  { title: 'Amethyst Haze 100ml', slug: 'amethyst-haze', img: 'amethyst-haze', product: products[3] },
  { title: 'Amethyst Haze 2ml Sample', slug: 'amethyst-haze', img: 'amethyst-haze', product: products[4] },
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
  out = out.replace(/(<span class="woocommerce-Price-currencySymbol">&#36;<\/span>)[\d,.]+/g, `$1${p.price}`)
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
  html = html.replace(/(<span class="woocommerce-Price-currencySymbol">&#36;<\/span>)[\d,.]+/, `$1${product.price}`)
  html = html.replace(/(<p>)[^<]*(niche perfume decant|travel-ready|extrait de parfum|Amouage|BDK Paris)[^<]*(<\/p>)/, `$1${product.desc}$3`)
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

  // Runtime guard: WoodMart's remote JS can rehydrate links after load, so rewrite and intercept every click.
  const cleanup = `<style id="static-clone-cleanup">.mfp-bg,.mfp-wrap,.wd-close-side,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}html,body{overflow:auto!important}.wd-product img,.woocommerce-product-gallery__image img{object-fit:contain!important;background:#fff!important}</style><script>(function(){function localFor(h){if(!h)return null;try{var u=new URL(h,location.origin);if(u.origin===location.origin)return null;if(u.hostname!=='woodmart.xtemos.com')return null;if(/^\\/product\\//.test(u.pathname)||/^\\/perfumes\\/product\\//.test(u.pathname))return '/product/${products[0].slug}/';if(u.pathname==='/perfumes/'&&u.search.indexOf('add-to-cart=')>=0)return '/checkout/';if(/^\\/perfumes\\/(cart|checkout)\\/?$/.test(u.pathname))return '/checkout/';if(/^\\/perfumes\\//.test(u.pathname))return '/';return '/'}catch(e){return null}}function rewriteWoodmartLinks(){document.querySelectorAll('a[href],form[action]').forEach(function(el){var attr=el.tagName==='FORM'?'action':'href';var target=localFor(el.getAttribute(attr));if(target)el.setAttribute(attr,target)})}function killWoodmartDemo(){rewriteWoodmartLinks();document.querySelectorAll('.mfp-bg,.mfp-wrap,.wd-close-side,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]').forEach(function(e){e.remove()});document.querySelectorAll('a,button,div,span').forEach(function(e){if(/Buy\\s+WoodMart/i.test((e.textContent||'').trim())){var t=e.closest('a,button,.xts-buy,.xts-demos-preview,.xts-show-demos')||e;e.remove?t.remove():t.style.display='none'}});document.documentElement.style.overflow='auto';if(document.body)document.body.style.overflow='auto'}document.addEventListener('click',function(ev){var a=ev.target&&ev.target.closest&&ev.target.closest('a[href]');if(!a)return;var target=localFor(a.getAttribute('href'));if(target){ev.preventDefault();ev.stopPropagation();location.href=target}},true);killWoodmartDemo();document.addEventListener('DOMContentLoaded',killWoodmartDemo);window.addEventListener('load',killWoodmartDemo);new MutationObserver(killWoodmartDemo).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href','action']});})();</script>`
  html = html.replace('</head>', `${cleanup}<meta name="static-clone" content="woodmart-${page}"></head>`)
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
copyPage('home-full.html', path.join(dist, 'index.html'), 'home')
copyPage('home-full.html', path.join(dist, 'home-full.html'), 'home')
copyPage('product-full.html', path.join(dist, 'product-full.html'), 'product', products[0])
products.forEach(product => copyPage('product-full.html', path.join(dist, 'product', product.slug, 'index.html'), 'product', product))

// Minimal static checkout route so old links don't 404.
copyPage('product-full.html', path.join(dist, 'checkout', 'index.html'), 'checkout-placeholder', products[0])

console.log(`Static WoodMart clone built to ${dist}`)
console.log(`Routes: /, /home-full.html, /product-full.html, /checkout/, ${products.map(p => `/product/${p.slug}/`).join(', ')}`)
