import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, User, ShoppingBag, X, ShieldCheck, ChevronDown, Minus, Plus, ArrowRight } from 'lucide-react'

const whatsapp = 'https://wa.me/971551495060'
const socials = { instagram:'https://www.instagram.com/niche_center/', threads:'https://www.threads.com/@niche_center' }

const sizes = [{l:'2ML',m:.45},{l:'3ML',m:.62},{l:'5ML',m:1},{l:'10ML',m:1.82},{l:'30ML',m:4.95}]

const products = [
  { id:'bdk-gris-charnel', badge:'BEST SELLER', brand:'BDK Parfums', name:'Gris Charnel Decant', ar:'تقسيمة غري تشارنيل', family:'Warm Spicy', price:68, img:'/images/niche-center/bdk-gris-charnel.webp' },
  { id:'bdk-riviera', badge:'NEW', brand:'BDK Parfums', name:'Riviera Decant', ar:'تقسيمة ريفييرا', family:'Green Aromatic', price:72, img:'/images/niche-center/bdk-riviera.webp' },
  { id:'bdk-rouge-ardent', badge:'BEST SELLER', brand:'BDK Parfums', name:'Rouge Ardent Decant', ar:'تقسيمة روج أردنت', family:'Spicy Woody', price:74, img:'/images/niche-center/bdk-rouge-ardent.webp' },
  { id:'crivelli-cuir', badge:'RARE', brand:'Maison Crivelli', name:'Cuir InfraRouge Extrait', ar:'تقسيمة كوير إنفراروج', family:'Leather Spicy', price:98, img:'/images/niche-center/crivelli-cuir-infrarouge.webp' },
  { id:'amouage-reasons', badge:'NEW', brand:'Amouage', name:'Reasons Decant', ar:'تقسيمة ريزونز', family:'Creamy Woody', price:92, img:'/images/niche-center/amouage-reasons.webp' },
  { id:'amouage-reflection', badge:'ICON', brand:'Amouage', name:'Reflection Man Decant', ar:'تقسيمة ريفليكشن مان', family:'Fresh Aromatic', price:86, img:'/images/niche-center/amouage-reflection-man.webp' },
]

const collections = [
  { id:'best', title:'Best Sellers', ar:'الأكثر طلباً', copy:'Customer-loved decants from iconic niche houses.', items:['bdk-gris-charnel','amouage-reasons','crivelli-cuir'] },
  { id:'fresh', title:'Fresh & Daily', ar:'فريش يومي', copy:'Clean, aromatic scents for warm UAE days.', items:['amouage-reflection','bdk-riviera'] },
  { id:'luxury', title:'Luxury Icons', ar:'أيقونات فاخرة', copy:'Prestige perfumes in smarter discovery sizes.', items:['bdk-rouge-ardent','amouage-reasons','crivelli-cuir'] },
]

const copy = {
  en: {
    announce:'NEW: ORIGINAL NICHE DECANTS · UAE DELIVERY →',
    shop:'Shop', coll:'Collections', about:'About', membership:'Membership',
    heroKicker:'NEW', heroTitle:'A NICHE ESCAPE', heroBody:'Original luxury decants from Amouage, BDK, Maison Crivelli and more — poured from retail bottles into discovery sizes.',
    cta:'SHOP NOW', dm:'ORDER ON WHATSAPP', best:'BEST SELLERS', wear:'WEAR WHAT’S TRUE', shopAll:'Shop All', shopPerfume:'Shop Perfume',
    manifesto:'Modern niche fragrances inspired by memory, mood and identity — personal to you, recognizable to everyone close enough to notice.',
    aboutUs:'ABOUT US', memberTitle:'MEMBERS GET MORE', memberBody:'Try more scents, build a wardrobe, and reorder your favorites across the UAE.',
    discover:'THERE’S MORE TO DISCOVER', discoverBody:'Start with a 2ML sample, move to 10ML for daily wear, then commit to the full bottle only when it feels right.',
    add:'Add', size:'Size', cart:'Your Bag', empty:'Your bag is empty.', subtotal:'Subtotal', chkout:'Checkout', keep:'Continue Shopping',
    contact:'Contact', del:'Delivery', pay:'Payment', place:'Place Order', summary:'Order Summary', confirmed:'Order Confirmed', confirmedBody:'Thank you! We will confirm via WhatsApp shortly.',
  },
  ar: {
    announce:'جديد: تقسيمات عطور نيش أصلية · توصيل الإمارات ←',
    shop:'تسوق', coll:'المجموعات', about:'عن المتجر', membership:'العضوية',
    heroKicker:'جديد', heroTitle:'رحلة نيش فاخرة', heroBody:'تقسيمات أصلية من Amouage و BDK و Maison Crivelli وغيرها — من الزجاجات الأصلية إلى أحجام التجربة.',
    cta:'تسوق الآن', dm:'اطلب عبر واتساب', best:'الأكثر طلباً', wear:'اختر عطرك الحقيقي', shopAll:'عرض الكل', shopPerfume:'تسوق العطور',
    manifesto:'عطور نيش حديثة مستوحاة من الذكريات والمزاج والهوية — شخصية لك وواضحة لمن يقترب منك.',
    aboutUs:'عن المتجر', memberTitle:'مزايا أكثر', memberBody:'جرّب عطور أكثر، كوّن مجموعتك، وأعد طلب المفضلة داخل الإمارات.',
    discover:'اكتشف المزيد', discoverBody:'ابدأ بعينة 2مل، ثم 10مل للاستخدام اليومي، وبعدها اختر الزجاجة الكاملة بثقة.',
    add:'أضف', size:'الحجم', cart:'السلة', empty:'السلة فارغة.', subtotal:'المجموع', chkout:'الدفع', keep:'متابعة التسوق',
    contact:'بيانات التواصل', del:'التوصيل', pay:'الدفع', place:'تأكيد الطلب', summary:'ملخص الطلب', confirmed:'تم التأكيد', confirmedBody:'شكراً! سنؤكد عبر واتساب قريباً.',
  }
}

const AED = n => `AED ${Number(n).toLocaleString()}`
const getP = id => products.find(p=>p.id===id)||products[0]
const LangContext = createContext(null)
const useLang = () => useContext(LangContext)

function LangProvider({children}){
  const [l,set]=useState(()=>localStorage.getItem('nc-l')||'en')
  useEffect(()=>{localStorage.setItem('nc-l',l);document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'},[l])
  const v=useMemo(()=>({l,ar:l==='ar',t:()=>set(x=>x==='ar'?'en':'ar'),s:k=>copy[l][k]||copy.en[k]||k}),[l])
  return <LangContext.Provider value={v}>{children}</LangContext.Provider>
}

const CartContext = createContext(null)
function CartProvider({children}){
  const [items,set]=useState(()=>{try{return JSON.parse(localStorage.getItem('nc-c')||'[]')}catch{return[]}})
  const [open,setOpen]=useState(false)
  useEffect(()=>localStorage.setItem('nc-c',JSON.stringify(items)),[items])
  const add=(p,sl='5ML',q=1)=>{const o=sizes.find(x=>x.l===sl)||sizes[2];set(v=>{const h=v.find(x=>x.id===p.id&&x.sl===sl);if(h)return v.map(x=>x.id===p.id&&x.sl===sl?{...x,q:x.q+q}:x);return[...v,{id:p.id,na:p.name,ar:p.ar,br:p.brand,img:p.img,sl,pr:Math.round(p.price*o.m),q}]});setOpen(true)}
  const up=(id,sl,q)=>set(v=>v.map(x=>x.id===id&&x.sl===sl?{...x,q:Math.max(1,q)}:x))
  const rm=(id,sl)=>set(v=>v.filter(x=>!(x.id===id&&x.sl===sl)))
  const cl=()=>set([]);const sub=items.reduce((s,x)=>s+x.pr*x.q,0);const cnt=items.reduce((s,x)=>s+x.q,0)
  const v=useMemo(()=>({items,open,setOpen,add,up,rm,cl,sub,cnt}),[items,open,sub,cnt])
  return <CartContext.Provider value={v}>{children}</CartContext.Provider>
}
const useCart=()=>useContext(CartContext)

function WA(){return<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
function IG(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>}

function Header(){
  const {cnt,setOpen}=useCart();const {l,s,t}=useLang()
  return<><div className="announce"><Link to="/">{s('announce')}</Link></div><header className="site-header"><div className="header-inner">
    <Link to="/" className="logo" aria-label="Niche Center home">NICHE CENTER</Link>
    <nav className="header-nav"><Link to="/">{s('shop')}</Link><a href="#collections">{s('coll')}</a><a href="#about">{s('about')}</a><a href="#membership">{s('membership')}</a></nav>
    <div className="header-actions"><button aria-label="Search"><Search size={22}/></button><button onClick={t}>{l==='ar'?'EN':'AR'}</button><a href={whatsapp} target="_blank" rel="noreferrer"><WA/></a><a className="desktop-icon" href={socials.instagram} target="_blank" rel="noreferrer"><IG/></a><button onClick={()=>setOpen(true)} className="cart-icon" aria-label="Open cart"><ShoppingBag size={23}/>{cnt>0&&<span>{cnt}</span>}</button></div>
  </div></header></>
}

function Hero(){
  const {s,ar}=useLang()
  return <section className="hero-phlur">
    <div className="hero-copy">
      <span className="outline-label">{s('heroKicker')}</span>
      <h1>{s('heroTitle')}</h1>
      <p>{s('heroBody')}</p>
      <div className="hero-ctas"><a href="#shop" className="outline-btn light">{s('cta')}</a><a href={whatsapp} target="_blank" className="text-link light">{s('dm')} <ArrowRight size={14}/></a></div>
    </div>
    <div className="hero-products" aria-hidden="true">
      <img className="hero-bottle hero-bottle-main" src={products[1].img} alt="" />
      <img className="hero-bottle hero-bottle-left" src={products[2].img} alt="" />
      <img className="hero-bottle hero-bottle-right" src={products[4].img} alt="" />
      <div className="hero-caption">{ar?'تقسيمات أصلية':'ORIGINAL DECANTS'}</div>
    </div>
  </section>
}

function ProductRail({title,linkText,items=products}){
  const {ar}=useLang()
  return <section className="rail-section" id={title==='BEST SELLERS'?'shop':undefined}>
    <div className="section-line"><h2>{title}</h2><a href={whatsapp} target="_blank">{linkText}</a></div>
    <div className="rail-row">{items.map((p,i)=><ProductCard key={p.id} p={p} i={i} ar={ar}/>)}</div>
  </section>
}

function ProductCard({p,i,ar}){
  const {add}=useCart();const sel=2
  const price=Math.round(p.price*sizes[sel].m)
  return <motion.article initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.28,delay:i*.035}} className="rail-card">
    <Link to={`/product/${p.id}`} className="rail-img"><span className="badge">{p.badge}</span><img src={p.img} alt={p.name}/><i/></Link>
    <div className="rail-info"><Link to={`/product/${p.id}`}><h3>{ar?p.ar:p.name.replace(' Decant','')}</h3><p>{p.family} · {sizes[sel].l}</p></Link>
    <button className="add-line" onClick={()=>add(p,sizes[sel].l)}>{ar?'أضف':'ADD'} <span>·</span> {AED(price)}</button></div>
  </motion.article>
}

function Home(){
  const {s,ar}=useLang()
  return <main>
    <Hero/>
    <ProductRail title={s('best')} linkText={s('shopAll')} items={products}/>
    <section id="about" className="manifesto"><p>{s('manifesto')}</p><a href={whatsapp} target="_blank" className="outline-btn">{s('aboutUs')}</a></section>
    <section id="membership" className="membership-panel"><div className="membership-copy"><h2>{s('memberTitle')}</h2><p>{s('memberBody')}</p><a href={whatsapp} target="_blank" className="outline-btn light">{ar?'انضم الآن':'JOIN NOW'}</a></div><div className="membership-products"><img src={products[0].img} alt=""/><img src={products[3].img} alt=""/><img src={products[5].img} alt=""/></div></section>
    <ProductRail title={s('wear')} linkText={s('shopPerfume')} items={[...products].reverse()}/>
    <section id="collections" className="collections-phlur"><div className="section-line"><h2>{s('coll')}</h2><a href={whatsapp} target="_blank">{s('shopAll')}</a></div><div className="collection-row">{collections.map(c=>{const p=getP(c.items[0]);return <Link key={c.id} to={`/product/${p.id}`} className="collection-tile"><img src={p.img} alt=""/><div><p>{c.copy}</p><h3>{ar?c.ar:c.title}</h3></div></Link>})}</div></section>
    <section className="discover-block"><div><h2>{s('discover')}</h2><p>{s('discoverBody')}</p><a href="#shop" className="outline-btn">{s('cta')}</a></div><img src={products[2].img} alt="Rouge Ardent perfume decant"/></section>
  </main>
}

function ProductPage(){
  const {id}=useParams();const p=getP(id);const {add}=useCart();const {ar,s}=useLang()
  const [sel,setSel]=useState(2);const [q,setQ]=useState(1);const [open,setOpen]=useState('Description')
  const pr=Math.round(p.price*(sizes[sel]?.m||1))
  useEffect(()=>{document.title=`${p.name} | Niche Center`},[p])
  return<main className="product-page"><div className="shell"><nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>{p.brand}</span></nav><div className="product-layout">
      <div className="prod-visual"><div className="prod-main-img"><span className="badge">{p.badge}</span><img src={p.img} alt={p.name}/></div><div className="prod-thumbs">{products.map(x=><Link key={x.id} to={`/product/${x.id}`} className={`prod-thumb ${x.id===p.id?'active':''}`}><img src={x.img} alt=""/></Link>)}</div></div>
      <aside className="prod-detail"><p className="prod-label">{p.brand}</p><h1>{ar?p.ar:p.name}</h1><p className="prod-sub">{p.family} · Original decant · UAE delivery</p><p className="prod-desc">{ar?`تقسيمة أصلية من ${p.brand}. اختر الحجم المناسب للتجربة أو الاستخدام اليومي.`:`An original decant from ${p.brand}. Choose a size for discovery, travel, or daily wear.`}</p>
      <div className="size-block"><p>{s('size')}</p><div className="size-grid">{sizes.map((x,i)=><button key={x.l} onClick={()=>setSel(i)} className={sel===i?'active':''}>{x.l}<small>{AED(Math.round(p.price*x.m))}</small></button>)}</div></div>
      <div className="buy-row"><div className="qty"><button onClick={()=>setQ(Math.max(1,q-1))}><Minus size={14}/></button><span>{q}</span><button onClick={()=>setQ(q+1)}><Plus size={14}/></button></div><button onClick={()=>add(p,sizes[sel].l,q)} className="black-btn">{s('add')} · {AED(pr*q)}</button></div>
      <div className="trust-strip"><span><ShieldCheck size={13}/>100% Original</span><span>UAE Delivery</span><span>WhatsApp Support</span></div>
      <div className="accordion-wrap">{[
        ['Description',`${p.name} by ${p.brand}. ${p.family} scent profile.`],
        ['Notes',`${p.family.replace(' ',' · ')} · Long-lasting · Original bottle decant`],
        ['Authenticity','Every decant is transferred from an original retail bottle into a clean atomizer. No copies.']
      ].map(([n,b])=><Accordion key={n} n={n} open={open} set={setOpen}>{b}</Accordion>)}</div></aside>
    </div></div></main>
}

function Accordion({n,open,set,children}){
  const a=open===n
  return <div className="accordion"><button onClick={()=>set(a?'':n)}><span>{n}</span><ChevronDown size={14} className={a?'rotate':''}/></button><AnimatePresence>{a&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>{children}</motion.p>}</AnimatePresence></div>
}

function CartDrawer(){
  const {open,setOpen,items,up,rm,sub}=useCart();const {ar,s}=useLang();const nav=useNavigate()
  return <AnimatePresence>{open&&<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} className="drawer-backdrop"/><motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:260}} className="cart-drawer"><div className="cart-head"><h2>{s('cart')}</h2><button onClick={()=>setOpen(false)}><X size={19}/></button></div>{items.length===0?<div className="cart-empty"><ShoppingBag/><p>{s('empty')}</p><Link onClick={()=>setOpen(false)} to="/" className="black-btn">{s('keep')}</Link></div>:<><div className="cart-items">{items.map(x=><div key={x.id+x.sl} className="cart-item"><div className="cart-item-thumb"><img src={x.img} alt=""/></div><div><p>{ar?x.ar:x.na}</p><small>{x.sl}</small><button onClick={()=>rm(x.id,x.sl)}>Remove</button></div><div className="cart-price"><span>{AED(x.pr*x.q)}</span><div className="cart-qty"><button onClick={()=>up(x.id,x.sl,x.q-1)}>-</button><span>{x.q}</span><button onClick={()=>up(x.id,x.sl,x.q+1)}>+</button></div></div></div>)}</div><div className="cart-foot"><div><span>{s('subtotal')}</span><strong>{AED(sub)}</strong></div><button onClick={()=>{setOpen(false);nav('/checkout')}} className="black-btn">{s('chkout')}</button></div></>}</motion.aside></>}</AnimatePresence>
}

function Checkout(){
  const {items,sub}=useCart();const {ar,s}=useLang();const [done,setDone]=useState(false);const ship=sub===0||sub>=200?0:15
  if(done)return <main className="confirm"><div><h1>{s('confirmed')}</h1><p>{s('confirmedBody')}</p><a href={whatsapp} target="_blank" className="black-btn">{ar?'واتساب':'WhatsApp'}</a></div></main>
  return <main className="checkout shell"><h1>{s('chkout')}</h1><div className="checkout-grid"><form onSubmit={e=>{e.preventDefault();setDone(true)}} className="checkout-form"><section><h2>{s('contact')}</h2><div className="form-grid">{['First name','Last name','Email','Phone'].map(l=><label key={l}><span>{l}</span><input required type={l==='Email'?'email':'text'}/></label>)}</div></section><section><h2>{s('del')}</h2><label><span>Address</span><input required/></label><div className="form-grid three">{['City','Emirate','Country'].map(l=><label key={l}><span>{l}</span><input required defaultValue={l==='Country'?'UAE':''}/></label>)}</div></section><section><h2>{s('pay')}</h2>{['Credit Card','Tabby / Tamara','Cash on Delivery','WhatsApp Order'].map(p=><label key={p} className="pay-opt"><input type="radio" name="pay" defaultChecked={p==='Credit Card'}/><span>{p}</span></label>)}</section><button className="black-btn">{s('place')} · {AED(sub+ship)}</button></form><aside className="summary-box"><h2>{s('summary')}</h2>{items.map(x=><div key={x.id+x.sl} className="summary-item"><img src={x.img} alt=""/><div><p>{ar?x.ar:x.na}</p><small>Qty {x.q} · {x.sl}</small></div><span>{AED(x.pr*x.q)}</span></div>)}<div className="summary-total"><div><span>{s('subtotal')}</span><span>{AED(sub)}</span></div><div><span>Shipping</span><span>{ship===0?'Free':AED(ship)}</span></div><strong><span>Total</span><span>{AED(sub+ship)}</span></strong></div></aside></div></main>
}

function Footer(){
  const {ar}=useLang()
  const cols = [[ar?'المجموعات':'Collections',['Best Sellers','Fresh & Daily','Luxury Icons']],[ar?'الفئات':'Categories',['Decants','Discovery Sizes','Gift Sets']],[ar?'خدمة العملاء':'Customer Care',['WhatsApp','Delivery','Authenticity']],[ar?'القصة':'Our Story',['About','Instagram','Contact']]]
  return <footer className="site-footer"><div className="prefooter"><h2>NICHE CENTER</h2><p>{ar?'تقسيمات عطور نيش أصلية في الإمارات.':'Original luxury niche decants in the UAE.'}</p></div><div className="footer-grid">{cols.map(([t,links])=><div key={t}><h3>{t}</h3>{links.map(l=><a key={l} href={l==='WhatsApp'?whatsapp:'#'}>{l}</a>)}</div>)}<div><h3>Subscribe</h3><p>{ar?'العطور الجديدة والعروض عبر واتساب.':'New scents, drops, and UAE delivery updates.'}</p><div className="footer-social"><a href={socials.instagram}><IG/></a><a href={whatsapp}><WA/></a></div></div></div><div className="footer-bottom"><span>United Arab Emirates · AED · {ar?'العربية':'English'}</span><span>© 2026 Niche Center Perfumes AE</span></div></footer>
}

function Shell(){
  const loc=useLocation()
  useEffect(()=>window.scrollTo(0,0),[loc.pathname])
  return <><Header/><CartDrawer/><AnimatePresence mode="wait"><motion.div key={loc.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}><Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes></motion.div></AnimatePresence><Footer/><a href={whatsapp} target="_blank" className="floating-wa" aria-label="WhatsApp"><WA/></a></>
}

export default function App(){return <LangProvider><CartProvider><Shell/></CartProvider></LangProvider>}
