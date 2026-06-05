import fs from 'node:fs'
import path from 'node:path'

const project = process.cwd()
const refDir = path.join(project, 'static', 'woodmart')
const dist = path.join(project, 'dist')
const remote = 'https://woodmart.xtemos.com'
const perfRemote = `${remote}/perfumes`

function ensure(dir){ fs.mkdirSync(dir, { recursive: true }) }
function clean(){ fs.rmSync(dist, { recursive: true, force: true }); ensure(dist) }

function rewriteHtml(html, page){
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
  // Keep all product clicks inside the clone instead of sending visitors back to WoodMart.
  html = html.replace(/\/perfumes\/product\/[^"'\s<>]+\//g, `/product/abyss-bleu/`)
  html = html.replace(/https:\/\/woodmart\.xtemos\.com\/perfumes\/product\/[^"'\s<>]+\//g, `/product/abyss-bleu/`)
  html = html.replace(/href="https:\/\/woodmart\.xtemos\.com\/perfumes\/"/g, 'href="/"')
  html = html.replace(/href='https:\/\/woodmart\.xtemos\.com\/perfumes\/'/g, "href='/'")

  // Disable WordPress navigation form posts that would jump away from the clone.
  html = html.replace(/<form([^>]+)action="https:\/\/woodmart\.xtemos\.com\/perfumes\/cart\/"/g, '<form$1action="/"')
  html = html.replace(/<form([^>]+)action="https:\/\/woodmart\.xtemos\.com\/perfumes\/checkout\/"/g, '<form$1action="/checkout/"')

  // Clean up duplicate host prefixes that can appear when a root-relative /perfumes path is inside an already absolute URL.
  html = html.replaceAll('https://woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')
  html = html.replaceAll('//woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')
  html = html.replaceAll('http://woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')

  // Hide WoodMart demo-only overlays/popups so the deployed clone opens like the clean local reference view.
  const cleanup = `<style id="static-clone-cleanup">.mfp-bg,.mfp-wrap,.wd-close-side,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}html,body{overflow:auto!important}</style><script>(function(){function rewriteWoodmartLinks(){document.querySelectorAll('a[href]').forEach(function(a){var h=a.getAttribute('href')||'';if(/woodmart\.xtemos\.com\/perfumes\/product\//.test(h)||/^\/perfumes\/product\//.test(h)){a.setAttribute('href','/product/abyss-bleu/')}else if(/woodmart\.xtemos\.com\/perfumes\/checkout\//.test(h)||/^\/perfumes\/checkout\//.test(h)){a.setAttribute('href','/checkout/')}else if(h==='https://woodmart.xtemos.com/perfumes/'||h==='/perfumes/'){a.setAttribute('href','/')}})}function killWoodmartDemo(){rewriteWoodmartLinks();document.querySelectorAll('.mfp-bg,.mfp-wrap,.wd-close-side,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]').forEach(function(e){e.remove()});document.querySelectorAll('a,button,div,span').forEach(function(e){if(/Buy\\s+WoodMart/i.test((e.textContent||'').trim())){var t=e.closest('a,button,.xts-buy,.xts-demos-preview,.xts-show-demos')||e;e.remove?t.remove():t.style.display='none'}});document.documentElement.style.overflow='auto';if(document.body)document.body.style.overflow='auto'}killWoodmartDemo();document.addEventListener('DOMContentLoaded',killWoodmartDemo);window.addEventListener('load',killWoodmartDemo);new MutationObserver(killWoodmartDemo).observe(document.documentElement,{childList:true,subtree:true});})();</script>`
  html = html.replace('</head>', `${cleanup}<meta name="static-clone" content="woodmart-${page}"></head>`)
  return html
}

function copyPage(srcName, outPath, page){
  const src = path.join(refDir, srcName)
  if(!fs.existsSync(src)) throw new Error(`Missing saved WoodMart file: ${src}`)
  ensure(path.dirname(outPath))
  const html = rewriteHtml(fs.readFileSync(src, 'utf8'), page)
  fs.writeFileSync(outPath, html)
}

clean()
copyPage('home-full.html', path.join(dist, 'index.html'), 'home')
copyPage('home-full.html', path.join(dist, 'home-full.html'), 'home')
copyPage('product-full.html', path.join(dist, 'product-full.html'), 'product')
copyPage('product-full.html', path.join(dist, 'product', 'abyss-bleu', 'index.html'), 'product')

// Minimal static checkout route so old links don't 404. It keeps the WoodMart visual shell by reusing the product clone until a checkout HTML capture is added.
copyPage('product-full.html', path.join(dist, 'checkout', 'index.html'), 'checkout-placeholder')

console.log(`Static WoodMart clone built to ${dist}`)
console.log('Routes: /, /home-full.html, /product-full.html, /product/abyss-bleu/, /checkout/')
