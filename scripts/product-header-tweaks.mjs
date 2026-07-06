import fs from 'node:fs'
import path from 'node:path'

// Product-page header tweaks:
//   1. Remove the line/shadow under the header (the white-pill container's
//      box-shadow reads as a divider line beneath TARA).
//   2. Remove the AR/EN language switcher from the product header.
// Scoped to .single-product so the home header is unaffected.

const project = process.cwd()
const productDir = path.join(project, 'dist_8j_snapshot', 'product')
const distProductDir = path.join(project, 'dist', 'product')

const files = []
for (const dir of [productDir, distProductDir]) {
  if (!fs.existsSync(dir)) continue
  for (const slug of fs.readdirSync(dir)) {
    const f = path.join(dir, slug, 'index.html')
    if (fs.existsSync(f)) files.push(f)
  }
}

const CSS = `<style id="tara-product-header-tweaks">
.single-product .whb-header .whb-general-header>.container{box-shadow:none!important;border-bottom:0!important}
.single-product .whb-header{border-bottom:0!important;box-shadow:none!important}
.single-product .whb-header .whb-general-header-inner{border-bottom:0!important;box-shadow:none!important}
.single-product .whb-header .whb-general-header,.single-product .whb-header .whb-main-header{border-bottom:0!important;box-shadow:none!important}
.single-product .wd-header-lang-switch{display:none!important}
</style>`

let changed = 0
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8')
  html = html.replace(/<style id="tara-product-header-tweaks">[\s\S]*?<\/style>/g, '')
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${CSS}\n</head>`)
  } else {
    console.warn('  ! no </head> in', path.relative(project, file))
    continue
  }
  fs.writeFileSync(file, html)
  changed++
  console.log('  updated', path.relative(project, file))
}
console.log(`\nDone. ${changed} file(s) updated.`)
