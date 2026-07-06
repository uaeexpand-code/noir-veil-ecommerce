import fs from 'node:fs'
import path from 'node:path'

// Makes the home-page header match the product-page header on desktop:
// removes the floating "overcontent" pill treatment, switches the header row
// from light to dark text, and swaps the white logo for the black one.
// All edits are scoped to the <header>...</header> slice so nothing else on
// the page is touched.

const project = process.cwd()
const files = [
  'dist_8j_snapshot/index.html',
  'dist_8j_snapshot/home-full.html',
  'dist/index.html',
  'dist/home-full.html',
].map((f) => path.join(project, f))

function transformHeader(hdr) {
  let out = hdr

  // 1) Drop the overcontent + sticky-shadow floating treatment from <header>
  out = out.replace(
    /(<header class="whb-header[^"]*?)\s*whb-overcontent\s*whb-sticky-shadow([^"]*")/,
    '$1$2',
  )

  // 2) Row: light text -> dark text (match product header)
  out = out.replace(/whb-color-light/g, 'whb-color-dark')

  // 3) White logo -> black logo (product uses height 29)
  out = out.replace(
    /(<img width="276" height=")30("\s+src=")\/images\/tara-logo-white\.webp/g,
    '$129$2/images/tara-logo-black.webp',
  )
  // Fallback: any remaining white-logo refs inside the header -> black
  out = out.replace(/\/images\/tara-logo-white\.webp/g, '/images/tara-logo-black.webp')
  // dist build uses tara-logo.png for the (light) home header -> black logo
  out = out.replace(/\/images\/tara-logo\.png/g, '/images/tara-logo-black.webp')

  return out
}

let changed = 0
for (const file of files) {
  if (!fs.existsSync(file)) continue
  const html = fs.readFileSync(file, 'utf8')
  const s = html.indexOf('<header class="whb-header')
  if (s === -1) {
    console.warn('  ! no header in', path.relative(project, file))
    continue
  }
  const e = html.indexOf('</header>', s) + '</header>'.length
  const hdr = html.slice(s, e)
  const newHdr = transformHeader(hdr)
  if (newHdr === hdr) {
    console.log('  = no change needed', path.relative(project, file))
    continue
  }
  const out = html.slice(0, s) + newHdr + html.slice(e)
  fs.writeFileSync(file, out)
  changed++
  console.log('  updated', path.relative(project, file))
}
console.log(`\nDone. ${changed} file(s) updated.`)
