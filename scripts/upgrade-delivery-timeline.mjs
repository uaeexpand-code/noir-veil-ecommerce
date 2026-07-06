import fs from 'node:fs'
import path from 'node:path'

// Upgrades the hand-injected TARA delivery timeline into a proper 3-state
// progress tracker (done / active / upcoming) with a connecting rail, a
// filled progress portion, crisp inline SVG icons, and a subtle pulse on the
// active step. Countdown JS and all element IDs are left untouched.

const project = process.cwd()
const targets = []

function collect(dir) {
  const productDir = path.join(dir, 'product')
  if (!fs.existsSync(productDir)) return
  for (const slug of fs.readdirSync(productDir)) {
    const f = path.join(productDir, slug, 'index.html')
    if (fs.existsSync(f)) targets.push(f)
  }
}
collect(path.join(project, 'dist_8j_snapshot'))
collect(path.join(project, 'dist'))

const ICON_CHECK =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4.2L19 6.5"/></svg>'
const ICON_BOX =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>'
const ICON_SEND =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>'

const NEW_MARKUP = `<section class="tara-delivery-timeline tara-dt-v2" aria-label="Delivery timeline">
  <div class="tara-delivery-line"><span>Order within</span><strong id="tara-countdown">today</strong><span>to receive it around</span><span id="tara-delivery-date">tomorrow</span></div>
  <div class="tara-delivery-steps" role="list">
    <span class="tara-dt-track" aria-hidden="true"><span class="tara-dt-track-fill"></span></span>
    <div class="tara-delivery-step is-done" role="listitem"><span class="tara-step-icon">${ICON_CHECK}</span><b>Order placed</b><small id="tara-order-date">today</small></div>
    <div class="tara-delivery-step is-active" role="listitem"><span class="tara-step-icon">${ICON_BOX}</span><b>Preparing</b><small id="tara-ready-date">today</small></div>
    <div class="tara-delivery-step is-upcoming" role="listitem"><span class="tara-step-icon">${ICON_SEND}</span><b>Delivery</b><small id="tara-arrive-date">tomorrow</small></div>
  </div>
</section>`

const NEW_CSS = `<style id="tara-dt-v2-css">
.single-product .tara-dt-v2{position:relative!important;max-width:480px!important;margin:26px 0 0!important;padding:24px 22px!important;border:1px solid #e6e1db!important;border-radius:18px!important;background:linear-gradient(180deg,#fff 0%,#faf8f5 100%)!important;color:#1f1a17!important;box-shadow:0 20px 46px rgba(31,26,23,.08)!important;direction:ltr!important;text-align:center!important;box-sizing:border-box!important;clear:both!important;overflow:hidden!important;font-family:Satoshi,Arial,Helvetica,sans-serif!important}
.single-product .tara-dt-v2:before{display:none!important}
.single-product .tara-dt-v2 *{font-family:Satoshi,Arial,Helvetica,sans-serif!important;letter-spacing:normal!important}
.single-product .tara-dt-v2 .tara-delivery-line{position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;flex-wrap:wrap!important;width:auto!important;max-width:100%!important;direction:ltr!important;margin:0 auto 26px!important;padding:9px 16px!important;border:1px solid #1f1a17!important;border-radius:999px!important;background:#fff!important;color:#1f1a17!important;font-size:13px!important;line-height:1.4!important;font-weight:600!important;white-space:normal!important}
.single-product .tara-dt-v2 .tara-delivery-line strong{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:88px!important;padding:6px 13px!important;border-radius:999px!important;background:#1f1a17!important;color:#fff!important;font-size:13px!important;font-weight:800!important;letter-spacing:.02em!important;direction:ltr!important;unicode-bidi:isolate!important;box-shadow:0 6px 16px rgba(31,26,23,.22)!important}
.single-product .tara-dt-v2 .tara-delivery-line #tara-delivery-date{font-weight:800!important;color:#1f1a17!important}
.single-product .tara-dt-v2 .tara-delivery-steps{position:relative!important;display:grid!important;direction:ltr!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:start!important;gap:0!important;max-width:380px!important;width:100%!important;margin:0 auto!important}
.single-product .tara-dt-v2 .tara-dt-track{position:absolute!important;top:23px!important;left:16.66%!important;right:16.66%!important;height:3px!important;border-radius:999px!important;background:repeating-linear-gradient(90deg,#d8d2cc 0 6px,transparent 6px 11px)!important;z-index:0!important;overflow:hidden!important}
.single-product .tara-dt-v2 .tara-dt-track-fill{position:absolute!important;left:0!important;top:0!important;height:100%!important;width:0!important;border-radius:999px!important;background:#1f1a17!important;animation:taraDtFill 1s ease .15s forwards!important}
@keyframes taraDtFill{to{width:50%}}
.single-product .tara-dt-v2 .tara-delivery-step{position:relative!important;z-index:1!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:9px!important;min-width:0!important}
.single-product .tara-dt-v2 .tara-step-icon{width:46px!important;height:46px!important;border-radius:50%!important;display:flex!important;align-items:center!important;justify-content:center!important;line-height:1!important;box-sizing:border-box!important;transition:transform .2s ease!important}
.single-product .tara-dt-v2 .is-done .tara-step-icon{background:#1f1a17!important;color:#fff!important;border:2px solid #1f1a17!important;box-shadow:0 8px 18px rgba(31,26,23,.2)!important}
.single-product .tara-dt-v2 .is-active .tara-step-icon{background:#1f1a17!important;color:#fff!important;border:2px solid #1f1a17!important;box-shadow:0 0 0 5px rgba(31,26,23,.12)!important;animation:taraDtPulse 2s ease-in-out infinite!important}
.single-product .tara-dt-v2 .is-upcoming .tara-step-icon{background:#fff!important;color:#b7ada3!important;border:2px solid #ded8d1!important;box-shadow:none!important}
@keyframes taraDtPulse{0%,100%{box-shadow:0 0 0 4px rgba(31,26,23,.10)}50%{box-shadow:0 0 0 9px rgba(31,26,23,0)}}
.single-product .tara-dt-v2 .tara-delivery-step b{font-size:13px!important;line-height:1.25!important;font-weight:800!important;color:#1f1a17!important;text-align:center!important}
.single-product .tara-dt-v2 .is-upcoming b{color:#8a8079!important;font-weight:700!important}
.single-product .tara-dt-v2 .tara-delivery-step small{font-size:11px!important;line-height:1!important;color:#8a8079!important;font-weight:700!important;text-align:center!important}
.single-product .tara-dt-v2 .is-upcoming small{color:#b7ada3!important}
@media(max-width:760px){
.single-product .tara-dt-v2{max-width:none!important;width:100%!important;margin:22px 0 24px!important;padding:20px 16px!important;border-radius:16px!important}
.single-product .tara-dt-v2 .tara-delivery-line{font-size:12px!important;gap:6px!important;padding:8px 13px!important;margin-bottom:22px!important}
.single-product .tara-dt-v2 .tara-delivery-line strong{min-width:74px!important;font-size:12px!important;padding:5px 10px!important}
.single-product .tara-dt-v2 .tara-delivery-steps{max-width:none!important}
.single-product .tara-dt-v2 .tara-dt-track{top:21px!important}
.single-product .tara-dt-v2 .tara-step-icon{width:42px!important;height:42px!important}
.single-product .tara-dt-v2 .tara-delivery-step b{font-size:12px!important}
.single-product .tara-dt-v2 .tara-delivery-step small{font-size:10px!important}
}
@media(prefers-reduced-motion:reduce){
.single-product .tara-dt-v2 .tara-dt-track-fill{animation:none!important;width:50%!important}
.single-product .tara-dt-v2 .is-active .tara-step-icon{animation:none!important;box-shadow:0 0 0 5px rgba(31,26,23,.12)!important}
}
</style>`

const OLD_MARKUP_RE =
  /<section class="tara-delivery-timeline"[^>]*aria-label="Delivery timeline">[\s\S]*?<\/section>/
const JS_ANCHOR = '<script id="tara-delivery-timeline-js">'

let changed = 0
for (const file of targets) {
  let html = fs.readFileSync(file, 'utf8')
  const before = html

  // 1) Swap markup (matches both the original block and an already-v2 block)
  if (OLD_MARKUP_RE.test(html)) {
    html = html.replace(OLD_MARKUP_RE, NEW_MARKUP)
  } else {
    console.warn('  ! no timeline section found in', file)
  }

  // 2) Ensure a single v2 stylesheet, injected right before the countdown JS
  html = html.replace(/<style id="tara-dt-v2-css">[\s\S]*?<\/style>/g, '')
  if (html.includes(JS_ANCHOR)) {
    html = html.replace(JS_ANCHOR, `${NEW_CSS}${JS_ANCHOR}`)
  } else {
    console.warn('  ! no countdown JS anchor in', file)
  }

  if (html !== before) {
    fs.writeFileSync(file, html)
    changed++
    console.log('  updated', path.relative(project, file))
  }
}
console.log(`\nDone. ${changed}/${targets.length} files updated.`)
