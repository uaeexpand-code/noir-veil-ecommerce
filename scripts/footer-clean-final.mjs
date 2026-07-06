import fs from 'node:fs'
import path from 'node:path'

// Final footer cleanup. Prior passes (tara-footer-cleanup-v2, -redesign-v3,
// tara-polish-2026, tara-final-polish-fixes) left the footer with a broken
// flex "grid", a redundant 4-icon social row, uneven column baselines and a
// misaligned bottom bar. This appends ONE authoritative override block (loaded
// last so it wins the cascade) that:
//   - restores a clean 3-column grid (wide brand/newsletter col + 2 link cols)
//   - removes card borders/tints so whitespace does the separating
//   - hides the redundant newsletter social row (IG already in nav + floating)
//   - aligns link columns to a shared top baseline with breathable spacing
//   - centers the bottom bar (copyright / payment icons) on one baseline
//   - lifts email placeholder contrast and adds button hover polish

const project = process.cwd()
const homeFiles = [
  'dist_8j_snapshot/index.html',
  'dist_8j_snapshot/home-full.html',
  'dist/index.html',
  'dist/home-full.html',
].map((f) => path.join(project, f))

const CSS = `<style id="tara-footer-clean-final">
/* Container rhythm */
.wd-footer .main-footer{max-width:1140px!important;margin:0 auto!important;padding:64px clamp(20px,5vw,56px) 26px!important}
/* Brand + description block */
.wd-footer .wd-d8665e4e{margin:0 0 46px!important;padding:0 0 40px!important;gap:22px!important;border-bottom:1px solid rgba(255,255,255,.12)!important}
.wd-footer .wd-19d62820{max-width:600px!important;font-size:clamp(17px,1.8vw,23px)!important;line-height:1.55!important;font-weight:500!important;color:rgba(255,255,255,.92)!important}
/* 3-column grid: newsletter (wide) + 2 link columns, borderless, top-aligned */
.wd-footer .wd-0aa12142{display:grid!important;grid-template-columns:minmax(300px,1.4fr) minmax(140px,.5fr) minmax(140px,.5fr)!important;gap:clamp(28px,5vw,64px)!important;align-items:start!important;margin:0 0 44px!important}
.wd-footer .wd-17dba9e0,.wd-footer .wd-b6eec67a,.wd-footer .wd-d375fee6{border:0!important;background:transparent!important;padding:0!important;min-height:0!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important}
/* Newsletter heading + copy, left aligned and tightened */
.wd-footer .wd-a2f8dcea{font-size:15px!important;font-weight:700!important;letter-spacing:.14em!important;text-transform:uppercase!important;color:#fff!important;margin:0 0 14px!important;text-align:left!important}
.wd-footer .wd-d5cb8a8b{max-width:380px!important;margin:0 0 20px!important;color:rgba(255,255,255,.6)!important;font-size:14px!important;line-height:1.65!important;text-align:left!important}
/* Newsletter form */
.wd-footer .mc4wp-form,.wd-footer .mc4wp-form-fields{max-width:400px!important;margin:0!important}
.wd-footer .mc4wp-form .wd-grid-f-stretch{grid-template-columns:1fr auto!important;gap:0!important}
.wd-footer .mc4wp-form input[type=email],.wd-footer .mc4wp-form input[type=text]{background:rgba(255,255,255,.06)!important;border:0!important;border-bottom:1px solid rgba(255,255,255,.28)!important;color:#fff!important;height:50px!important;padding:0 16px!important}
.wd-footer .mc4wp-form input::placeholder{color:rgba(255,255,255,.6)!important}
.wd-footer .mc4wp-form input[type=submit]{background:#fff!important;color:#090a0a!important;height:50px!important;padding:0 24px!important;font-size:12px!important;font-weight:800!important;letter-spacing:.1em!important;text-transform:uppercase!important;border:0!important;cursor:pointer!important;transition:opacity .2s ease!important}
.wd-footer .mc4wp-form input[type=submit]:hover{opacity:.82!important}
/* Kill the redundant newsletter social row (Instagram is in nav + floating btn) */
.wd-footer .wd-social-icons{display:none!important}
/* Link columns: shared baseline, breathable spacing, quiet labels */
.wd-footer .wp-block-wd-menu-list,.wd-footer .wp-block-wd-menu-list ul{margin:0!important;padding:0!important;list-style:none!important}
.wd-footer .sub-sub-menu{display:grid!important;gap:15px!important;width:100%!important;text-align:left!important;justify-items:start!important}
.wd-footer .sub-sub-menu a{display:inline-block!important;font-size:14px!important;font-weight:500!important;color:rgba(255,255,255,.7)!important;letter-spacing:.01em!important;text-align:left!important;transition:color .18s ease!important}
.wd-footer .sub-sub-menu a:hover{color:#fff!important;transform:none!important}
/* Bottom bar: single baseline, centered items */
.wd-footer .wd-5ff0a678{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:24px!important;border-top:1px solid rgba(255,255,255,.12)!important;padding:24px 0 0!important}
.wd-footer .wd-ee235e53{margin:0!important;color:rgba(255,255,255,.55)!important;font-size:12.5px!important;line-height:1.7!important;letter-spacing:.01em!important}
.wd-footer .wd-d46e65a9{display:flex!important;align-items:center!important;margin:0!important}
.wd-footer .wd-d46e65a9 img{max-width:210px!important;height:auto!important;opacity:.65!important;filter:grayscale(1) brightness(1.7)!important}
/* Tablet / mobile */
@media(max-width:768px){
.wd-footer .main-footer{padding:48px 22px 24px!important}
.wd-footer .wd-d8665e4e{margin-bottom:32px!important;padding-bottom:30px!important;text-align:center!important}
.wd-footer .wd-19d62820{margin:0 auto!important;text-align:center!important;font-size:17px!important;max-width:330px!important}
/* Stack everything into one centered column on mobile */
.wd-footer .wd-0aa12142{display:flex!important;flex-direction:column!important;align-items:center!important;gap:34px!important;margin-bottom:34px!important}
.wd-footer .wd-17dba9e0,.wd-footer .wd-b6eec67a,.wd-footer .wd-d375fee6{width:100%!important;align-items:center!important;order:0!important}
.wd-footer .wd-17dba9e0{order:-1!important}
.wd-footer .wd-a2f8dcea,.wd-footer .wd-d5cb8a8b{text-align:center!important;margin-left:auto!important;margin-right:auto!important}
/* Newsletter: input full width, button full width beneath it */
.wd-footer .mc4wp-form,.wd-footer .mc4wp-form-fields{max-width:340px!important;margin:0 auto!important}
.wd-footer .mc4wp-form .wd-grid-f-stretch{display:grid!important;grid-template-columns:1fr!important;gap:12px!important;max-width:340px!important;margin:0 auto!important}
.wd-footer .mc4wp-form input[type=email],.wd-footer .mc4wp-form input[type=text]{width:100%!important;text-align:center!important;border:1px solid rgba(255,255,255,.28)!important}
.wd-footer .mc4wp-form input::placeholder{text-align:center!important}
.wd-footer .mc4wp-form input[type=submit]{width:100%!important}
/* Both link lists as one centered column */
.wd-footer .sub-sub-menu{gap:16px!important;justify-items:center!important;text-align:center!important;width:100%!important}
.wd-footer .sub-sub-menu a{text-align:center!important;width:auto!important}
/* Bottom bar stacked, no orphaned phone number */
.wd-footer .wd-5ff0a678{flex-direction:column!important;text-align:center!important;gap:18px!important;padding-top:22px!important}
.wd-footer .wd-ee235e53{text-align:center!important;max-width:320px!important;margin:0 auto!important}
.wd-footer .wd-d46e65a9 img{max-width:230px!important;opacity:.7!important}
}
</style>`

let changed = 0
for (const file of homeFiles) {
  if (!fs.existsSync(file)) continue
  let html = fs.readFileSync(file, 'utf8')
  html = html.replace(/<style id="tara-footer-clean-final">[\s\S]*?<\/style>/g, '')
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${CSS}\n</head>`)
  } else {
    html = html.replace(/(<footer\b)/, `${CSS}\n$1`)
  }
  fs.writeFileSync(file, html)
  changed++
  console.log('  updated', path.relative(project, file))
}
console.log(`\nDone. ${changed} file(s) updated.`)
