import fs from 'node:fs'
import path from 'node:path'

// The product pages render a light (white pill) header because of rules scoped
// to `.single-product`. The home page body has class `.home` instead, so those
// rules never fire and the header stays dark. This injects the same header
// treatment scoped to `.home` so the home header matches the product header.

const project = process.cwd()
const homeFiles = [
  'dist_8j_snapshot/index.html',
  'dist_8j_snapshot/home-full.html',
  'dist/index.html',
  'dist/home-full.html',
].map((f) => path.join(project, f))

const CART_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='2.1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 6h15l-1.5 9h-12z'/%3E%3Cpath d='M6 6 5 3H2'/%3E%3Ccircle cx='9' cy='20' r='1.3'/%3E%3Ccircle cx='18' cy='20' r='1.3'/%3E%3C/svg%3E\")"

const CSS = `<style id="tara-home-header-light">
.home .whb-header,.home .whb-main-header,.home .whb-general-header,.home .whb-row,.home .whb-column{background:transparent!important}
.home .whb-general-header>.container{background:rgba(255,255,255,.92)!important;box-shadow:0 14px 40px rgba(0,0,0,.08)!important}
.home .whb-header{border-bottom:1px solid rgba(0,0,0,.08)!important}
.home .whb-header a,.home .whb-header .wd-tools-text,.home .whb-header .wd-tools-count,.home .whb-header .nav-link-text,.home .whb-header .wd-nav-main>li>a,.home .whb-header .wd-tools-element>a,.home .whb-header .wd-tools-text-cart{color:#111!important}
.home .whb-header .wd-tools-icon:before{color:#111!important}
.home .wd-header-lang-switch{border-color:rgba(0,0,0,.34)!important;background:rgba(255,255,255,.72)!important;color:#111!important}
.home .wd-header-lang-switch button{color:#111!important;-webkit-text-fill-color:#111!important}
.home .whb-header .wd-header-cart>a:before,.home .whb-header .wd-header-cart .wd-tools-icon:before{background-image:${CART_SVG}!important}
.home .wd-header-mobile-nav .wd-tools-icon:before{color:#111!important}
.home .wd-header-mobile-nav a{background:rgba(255,255,255,.78)!important;color:#111!important}
.home .wd-header-lang-switch{display:none!important}
/* Hide hero overlay heading text */
.home .wd-slide-container .wd-2e380cb2,.home .wd-slide .wd-2e380cb2{display:none!important}
</style>`

let changed = 0
for (const file of homeFiles) {
  if (!fs.existsSync(file)) continue
  let html = fs.readFileSync(file, 'utf8')
  // Idempotent: drop any prior copy first
  html = html.replace(/<style id="tara-home-header-light">[\s\S]*?<\/style>/g, '')
  // Inject right before </head> so it wins the cascade over base branding CSS
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${CSS}\n</head>`)
  } else {
    html = html.replace(/(<header class="whb-header)/, `${CSS}\n$1`)
  }
  fs.writeFileSync(file, html)
  changed++
  console.log('  updated', path.relative(project, file))
}
console.log(`\nDone. ${changed} file(s) updated.`)
