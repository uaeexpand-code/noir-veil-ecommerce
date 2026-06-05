import fs from 'node:fs'
import path from 'node:path'

const project = process.cwd()
const refDir = path.join(project, 'static', 'woodmart')
const dist = path.join(project, 'dist')
const remote = 'https://woodmart.xtemos.com'
const perfRemote = `${remote}/perfumes`

function ensure(dir){ fs.mkdirSync(dir, { recursive: true }) }
function clean(){ fs.rmSync(dist, { recursive: true, force: true }); ensure(dist) }

function rewriteNavigation(html){
  // Keep every clickable WoodMart product/card/title URL inside this clone.
  html = html.replace(/https:\/\/woodmart\.xtemos\.com\/perfumes\/product\/[^"'\s<>]+\/?/g, '/product/abyss-bleu/')
  html = html.replace(/https:\/\/woodmart\.xtemos\.com\/product\/[^"'\s<>]+\/?/g, '/product/abyss-bleu/')
  html = html.replace(/\/perfumes\/product\/[^"'\s<>]+\/?/g, '/product/abyss-bleu/')

  // Keep cart/checkout/add-to-cart clicks local too.
  html = html.replace(/(href|action)=(['"])https:\/\/woodmart\.xtemos\.com\/perfumes\/(cart|checkout)\/?\2/g, '$1=$2/checkout/$2')
  html = html.replace(/(href|action)=(['"])https:\/\/woodmart\.xtemos\.com\/perfumes\/?\?add-to-cart=[^'"]*\2/g, '$1=$2/checkout/$2')
  html = html.replace(/(href|action)=(['"])\/perfumes\/(cart|checkout)\/?\2/g, '$1=$2/checkout/$2')
  html = html.replace(/(href|action)=(['"])\/perfumes\/?\?add-to-cart=[^'"]*\2/g, '$1=$2/checkout/$2')

  // Any remaining clickable WoodMart demo/navigation URL should never leave the Vercel site.
  html = html.replace(/href=(['"])https:\/\/woodmart\.xtemos\.com\/perfumes\/(shop|fragrances|collection|journal|about-us|wishlist|olfactive-family)[^'"]*\1/g, 'href=$1/$1')
  html = html.replace(/href=(['"])https:\/\/woodmart\.xtemos\.com\/perfumes\/?\1/g, 'href=$1/$1')

  // Final hard stop: no <a> tag is allowed to keep a WoodMart URL (blog links, image zoom links, demos, etc.).
  html = html.replace(/(<a\b[^>]*\bhref=)(['"])https:\/\/woodmart\.xtemos\.com\/[^'"]*\2/gi, '$1$2/$2')
  html = html.replace(/(<a\b[^>]*\bhref=)(['"])\/perfumes\/[^'"]*\2/gi, '$1$2/$2')

  return html
}

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

  html = rewriteNavigation(html)

  // Clean up duplicate host prefixes that can appear when a root-relative /perfumes path is inside an already absolute URL.
  html = html.replaceAll('https://woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')
  html = html.replaceAll('//woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')
  html = html.replaceAll('http://woodmart.xtemos.comhttps://woodmart.xtemos.com', 'https://woodmart.xtemos.com')
  html = rewriteNavigation(html)

  // Runtime guard: WoodMart's remote JS can rehydrate links after load, so rewrite and intercept every click.
  const cleanup = `<style id="static-clone-cleanup">.mfp-bg,.mfp-wrap,.wd-close-side,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}html,body{overflow:auto!important}</style><script>(function(){function localFor(h){if(!h)return null;try{var u=new URL(h,location.origin);if(u.hostname!=='woodmart.xtemos.com')return null;if(/^\\/product\\//.test(u.pathname)||/^\\/perfumes\\/product\\//.test(u.pathname))return '/product/abyss-bleu/';if(u.pathname==='/perfumes/'&&u.search.indexOf('add-to-cart=')>=0)return '/checkout/';if(/^\\/perfumes\\/(cart|checkout)\\/?$/.test(u.pathname))return '/checkout/';if(/^\\/perfumes\\//.test(u.pathname))return '/';return '/'}catch(e){return null}}function rewriteWoodmartLinks(){document.querySelectorAll('a[href],form[action]').forEach(function(el){var attr=el.tagName==='FORM'?'action':'href';var target=localFor(el.getAttribute(attr));if(target)el.setAttribute(attr,target)})}function killWoodmartDemo(){rewriteWoodmartLinks();document.querySelectorAll('.mfp-bg,.mfp-wrap,.wd-close-side,.xts-buy,.xts-show-demos,.xts-demos-preview,.xts-promo-popup,.wd-popup,.wd-promo-popup,a[href*="themeforest"],a[href*="xtemos.com/item/woodmart"],a[href*="woodmart.xtemos.com/main"]').forEach(function(e){e.remove()});document.querySelectorAll('a,button,div,span').forEach(function(e){if(/Buy\\s+WoodMart/i.test((e.textContent||'').trim())){var t=e.closest('a,button,.xts-buy,.xts-demos-preview,.xts-show-demos')||e;e.remove?t.remove():t.style.display='none'}});document.documentElement.style.overflow='auto';if(document.body)document.body.style.overflow='auto'}document.addEventListener('click',function(ev){var a=ev.target&&ev.target.closest&&ev.target.closest('a[href]');if(!a)return;var target=localFor(a.getAttribute('href'));if(target){ev.preventDefault();ev.stopPropagation();location.href=target}},true);killWoodmartDemo();document.addEventListener('DOMContentLoaded',killWoodmartDemo);window.addEventListener('load',killWoodmartDemo);new MutationObserver(killWoodmartDemo).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href','action']});})();</script>`
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
