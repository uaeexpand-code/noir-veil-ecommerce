import fs from 'node:fs'
import path from 'node:path'

// Restores the "real customer reviews" photo carousel on the home page. It was
// defined in apply-live-home-fixes.mjs and injected before <footer>, but the
// deploy snapshot never carried it, so it disappeared from the live site.
// This re-injects the identical CSS (before </head>) and section (before the
// footer) into the home files. Images live at /images/reviews/review-01..16.webp.

const project = process.cwd()
const homeFiles = [
  'dist_8j_snapshot/index.html',
  'dist_8j_snapshot/home-full.html',
  'dist/index.html',
  'dist/home-full.html',
].map((f) => path.join(project, f))

const CSS = `<style id="tara-reviews-css">
.tara-reviews-section{margin:96px auto 88px!important;padding:0 clamp(16px,4vw,64px)!important;max-width:1440px!important;direction:rtl!important}
.tara-reviews-head{text-align:center!important;margin:0 auto 34px!important}
.tara-reviews-kicker{display:block!important;margin-bottom:8px!important;color:#8d7865!important;font-size:13px!important;font-weight:700!important;letter-spacing:.04em!important}
.tara-reviews-head h2{margin:0!important;color:#111!important;font-size:clamp(32px,4vw,54px)!important;line-height:1.15!important;font-weight:500!important}
.tara-reviews-head p{margin:14px auto 0!important;max-width:620px!important;color:#6d6259!important;font-size:15px!important;line-height:1.8!important}
.tara-reviews-rail{display:flex!important;gap:18px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;padding:0 0 18px!important;direction:rtl!important;scrollbar-color:#d7d0c8 transparent!important}
.tara-review-card{flex:0 0 clamp(230px,24vw,340px)!important;border:1px solid #ded8d0!important;background:#fff!important;scroll-snap-align:start!important;line-height:0!important}
.tara-review-card img{display:block!important;width:100%!important;aspect-ratio:4/5!important;height:auto!important;object-fit:cover!important;border:0!important;border-radius:0!important}
@media(max-width:760px){
  .tara-reviews-section{margin:64px auto 58px!important;padding:0 0 0 14px!important}
  .tara-reviews-head{padding:0 18px!important;margin-bottom:24px!important}
  .tara-reviews-head h2{font-size:34px!important}
  .tara-reviews-head p{font-size:13px!important}
  .tara-reviews-rail{gap:12px!important;padding-right:18px!important}
  .tara-review-card{flex-basis:76%!important}
}
</style>`

const cards = Array.from({ length: 16 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `<figure class="tara-review-card"><img loading="lazy" decoding="async" src="/images/reviews/review-${n}.webp" alt="تقييم عميل ${i + 1}"></figure>`
}).join('\n    ')

const SECTION = `<section class="tara-reviews-section" aria-labelledby="tara-reviews-title">
  <div class="tara-reviews-head">
    <span class="tara-reviews-kicker">تجارب عملائنا</span>
    <h2 id="tara-reviews-title">تقييمات حقيقية بالصور</h2>
    <p>لقطات ورسائل من عميلات تارا بعد تجربة المنتجات.</p>
  </div>
  <div class="tara-reviews-rail" aria-label="صور تقييمات العملاء">
    ${cards}
  </div>
</section>`

let changed = 0
for (const file of homeFiles) {
  if (!fs.existsSync(file)) continue
  let html = fs.readFileSync(file, 'utf8')
  // Idempotent: strip prior copies
  html = html.replace(/<style id="tara-reviews-css">[\s\S]*?<\/style>/g, '')
  html = html.replace(/<section class="tara-reviews-section"[\s\S]*?<\/section>\s*/g, '')

  if (html.includes('</head>')) html = html.replace('</head>', `${CSS}\n</head>`)

  // Inject before the first real footer element
  const footerIdx = html.search(/<footer\b/)
  if (footerIdx === -1) {
    console.warn('  ! no <footer> in', path.relative(project, file))
    continue
  }
  html = html.slice(0, footerIdx) + `${SECTION}\n` + html.slice(footerIdx)

  fs.writeFileSync(file, html)
  changed++
  console.log('  updated', path.relative(project, file))
}
console.log(`\nDone. ${changed} file(s) updated.`)
