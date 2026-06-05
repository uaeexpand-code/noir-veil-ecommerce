import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, X, Truck, ShieldCheck, Sparkles, ChevronDown, Minus, Plus } from 'lucide-react'

const whatsapp = 'https://wa.me/971551495060'
const socials = { instagram:'https://www.instagram.com/niche_center/', threads:'https://www.threads.com/@niche_center' }

const sizes = [{l:'2ML',m:.45},{l:'3ML',m:.62},{l:'5ML',m:1},{l:'10ML',m:1.82},{l:'30ML',m:4.95}]

const products = [
  { id:'bdk-gris-charnel', brand:'BDK Parfums', name:'Gris Charnel Decant', ar:'تقسيمة غري تشارنيل', family:'Warm Spicy', price:68, img:'/images/niche-center/bdk-gris-charnel.webp', color:'#c4965a' },
  { id:'bdk-riviera', brand:'BDK Parfums', name:'Riviera Decant', ar:'تقسيمة ريفييرا', family:'Green Aromatic', price:72, img:'/images/niche-center/bdk-riviera.webp', color:'#23756b' },
  { id:'bdk-rouge-ardent', brand:'BDK Parfums', name:'Rouge Ardent Decant', ar:'تقسيمة روج أردنت', family:'Spicy Woody', price:74, img:'/images/niche-center/bdk-rouge-ardent.webp', color:'#b83040' },
  { id:'crivelli-cuir', brand:'Maison Crivelli', name:'Cuir InfraRouge Extrait', ar:'تقسيمة كوير إنفراروج', family:'Leather Spicy', price:98, img:'/images/niche-center/crivelli-cuir-infrarouge.webp', color:'#d47a30' },
  { id:'amouage-reasons', brand:'Amouage', name:'Reasons Decant', ar:'تقسيمة ريزونز', family:'Creamy Woody', price:92, img:'/images/niche-center/amouage-reasons.webp', color:'#d4c8a8' },
  { id:'amouage-reflection', brand:'Amouage', name:'Reflection Man Decant', ar:'تقسيمة ريفليكشن مان', family:'Fresh Aromatic', price:86, img:'/images/niche-center/amouage-reflection-man.webp', color:'#e8e0d0' },
]

const collections = [
  { id:'best', title:'Best Sellers', ar:'الأكثر طلباً', copy:'The fragrances our customers love most.', items:['bdk-gris-charnel','amouage-reasons','crivelli-cuir'] },
  { id:'fresh', title:'Fresh & Daily', ar:'فريش يومي', copy:'Light, clean scents perfect for UAE days.', items:['amouage-reflection','bdk-riviera'] },
  { id:'luxury', title:'Luxury Icons', ar:'أيقونات فاخرة', copy:'The most prestigious niche houses in decant sizes.', items:['bdk-rouge-ardent','amouage-reasons','crivelli-cuir'] },
]

const copy = {
  en: {
    announce:'Original niche decants · UAE delivery · +3000 happy customers · Order via WhatsApp',
    shop:'Decants', coll:'Collections', about:'About',
    hero1:'Niche Center Perfumes AE', hero1h:'Original luxury decants, in smarter sizes.',
    hero1p:'Try Xerjoff, Amouage, Byredo and more before buying the full bottle. Premium decants from original retail bottles.',
    cta:'Shop Decants', dm:'Order via WhatsApp',
    hero2:'Try Before You Buy', hero2h:'Over 100 niche fragrances.', hero2p:'Choose from 2ML to 30ML sizes. 100% original, transferred from retail bottles.',
    hero3:'UAE Delivery', hero3h:'Fast delivery across the UAE.', hero3p:'Free shipping on orders over 200 AED. Express 4-hour delivery in Dubai available.',
    best:'Featured Decants', view:'View All',
    orig:'100% Original', origb:'Every decant from original retail bottles. No copies.',
    smart:'Smart Sizes', smartb:'2ML to 30ML for discovery, travel or daily wear.',
    fast:'Fast UAE Delivery', fastb:'Free delivery UAE-wide. Order via WhatsApp or Instagram.',
    add:'Add to Bag', size:'Size',
    cart:'Your Bag', empty:'Your bag is empty.', subtotal:'Subtotal', chkout:'Checkout', keep:'Continue Shopping',
    free:'Free delivery unlocked', addFree:'Add', forFree:'for free UAE delivery',
    contact:'Contact', del:'Delivery', pay:'Payment', place:'Place Order', summary:'Order Summary',
    confirmed:'Order Confirmed', confirmedBody:'Thank you! We will confirm via WhatsApp shortly.',
  },
  ar: {
    announce:'تقسيمات عطور نيش أصلية · توصيل الإمارات · +3000 عميل · الطلب عبر واتساب',
    shop:'التقسيمات', coll:'المجموعات', about:'عن المتجر',
    hero1:'نيش سنتر للعطور', hero1h:'عطور نيش أصلية بأحجام ذكية.',
    hero1p:'جرّب Xerjoff و Amouage و Byredo قبل شراء الزجاجة الكاملة.',
    cta:'تسوق التقسيمات', dm:'اطلب عبر واتساب',
    hero2:'جرّب قبل الشراء', hero2h:'أكثر من 100 عطر نيش.', hero2p:'اختر من 2مل إلى 30مل. أصلية 100%.',
    hero3:'توصيل الإمارات', hero3h:'توصيل سريع في جميع أنحاء الإمارات.', hero3p:'توصيل مجاني للطلبات فوق 200 درهم.',
    best:'تقسيمات مختارة', view:'عرض الكل',
    orig:'أصلي 100%', origb:'كل تقسيمة من الزجاجة الأصلية.', smart:'أحجام ذكية', smartb:'2مل إلى 30مل.',
    fast:'توصيل سريع', fastb:'توصيل مجاني في الإمارات.', add:'أضف للسلة', size:'الحجم',
    cart:'السلة', empty:'السلة فارغة.', subtotal:'المجموع', chkout:'الدفع', keep:'متابعة',
    free:'تم التوصيل المجاني', addFree:'أضف', forFree:'للتوصيل المجاني',
    contact:'بيانات التواصل', del:'التوصيل', pay:'الدفع', place:'تأكيد الطلب', summary:'ملخص الطلب',
    confirmed:'تم التأكيد', confirmedBody:'شكراً! سنؤكد عبر واتساب قريباً.',
  }
}

const AED = n => `AED ${n.toLocaleString()}`
const getP = id => products.find(p=>p.id===id)||products[0]
const useLang = () => useContext(LangContext)
const LangContext = createContext(null)
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

function WA(){return<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}

function IG(){return<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/></svg>}

function Header(){
  const {cnt,setOpen}=useCart();const {l,s,t}=useLang()
  return<><div className="announce">{s('announce')}</div><header className="site-header"><div className="shell header-inner">
    <div className="header-left">
      <Link to="/" className="font-semibold tracking-[.08em] uppercase text-[12px]">{s('shop')}</Link>
      <a href="#collections" className="font-semibold tracking-[.08em] uppercase text-[12px]">{s('coll')}</a>
      <a href="#about" className="font-semibold tracking-[.08em] uppercase text-[12px]">{s('about')}</a>
    </div>
    <Link to="/" className="logo">NICHE<span className="text-[var(--gold)]">CENTER</span></Link>
    <div className="header-right justify-end">
      <button onClick={t} className="font-semibold tracking-[.08em] uppercase text-[11px]">{l==='ar'?'EN':'AR'}</button>
      <a href={whatsapp} target="_blank" rel="noreferrer"><WA/></a>
      <a href={socials.instagram} target="_blank" rel="noreferrer" className="hidden sm:block"><IG/></a>
      <button onClick={()=>setOpen(true)} className="cart-icon"><ShoppingBag size={20}/>{cnt>0&&<span>{cnt}</span>}</button>
    </div>
  </div></header></>
}

const slides = [
  {label:'hero1',h:'hero1h',p:'hero1p',btn:'cta',href:'#shop',img:null,gradient:'linear-gradient(135deg,#e8e4da,#d6d0c0)'},
  {label:'hero2',h:'hero2h',p:'hero2p',btn:'dm',href:whatsapp,img:null,gradient:'linear-gradient(135deg,#d6d0c0,#c4bdab)'},
  {label:'hero3',h:'hero3h',p:'hero3p',btn:'cta',href:'#shop',img:null,gradient:'linear-gradient(135deg,#e0dcd0,#cec7b5)'},
]

function Hero(){
  const {s,ar}=useLang();const [slide,setSlide]=useState(0)
  useEffect(()=>{const t=setInterval(()=>setSlide(i=>(i+1)%3),5000);return()=>clearInterval(t)},[])
  const sl=slides[slide]
  return<section className="hero-slideshow"><AnimatePresence mode="wait">
    <motion.div key={slide} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.5}} className="slide">
      <div className="slide-copy"><p className="slide-label">{s(sl.label)}</p><h1>{s(sl.h)}</h1><p>{s(sl.p)}</p>
      <a href={sl.href} target={sl.href.startsWith('http')?'_blank':''} className="slide-btn">{s(sl.btn)}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></div>
      <div className="slide-visual" style={{background:sl.gradient}}><div className="text-center text-[#999] text-[13px] font-semibold tracking-[.2em] uppercase">{ar?'تقسيمات نيش أصلية':'Original Niche Decants'}</div></div>
    </motion.div>
  </AnimatePresence>
  <div className="slide-dots">{slides.map((_,i)=><button key={i} onClick={()=>setSlide(i)} className={`dot ${i===slide?'active':''}`}/>)}</div></section>
}

function ProdCard({p,i}){
  const {add}=useCart();const {ar,s}=useLang();const [sel,setSel]=useState(2)
  return<motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:i*.05}} className="prod-card">
    <Link to={`/product/${p.id}`} className="prod-img-wrap block">{p.img?<img src={p.img} alt={p.name}/>:<div className="text-[10px] text-[#999] tracking-[.12em] font-semibold uppercase">{p.brand}</div>}</Link>
    <div className="prod-info"><Link to={`/product/${p.id}`}><p className="prod-brand">{p.brand}</p><h3 className="prod-name">{ar?p.ar:p.name}</h3><p className="prod-family">{p.family}</p></Link>
    <div className="prod-sizes">{sizes.slice(0,4).map((s,i)=><button key={s.l} onClick={()=>setSel(i)} className={`size-chip ${sel===i?'active':''}`}>{s.l}</button>)}</div>
    <button onClick={()=>add(p,sizes[sel].l)} className="prod-btn">{AED(Math.round(p.price*sizes[sel].m))}</button></div>
  </motion.div>
}

function Home(){
  const {s,ar}=useLang()
  return<main>
    <Hero/>
    <section id="shop" className="py-14 md:py-20"><div className="shell">
      <div className="section-head"><div><p className="section-sub">Niche Center Perfumes AE</p><h2>{s('best')}</h2></div><a href={whatsapp} target="_blank">{s('view')}</a></div>
      <div className="product-grid">{products.map((p,i)=><ProdCard key={p.id} p={p} i={i}/>)}</div>
    </div></section>
    <section id="collections" className="py-14 md:py-20 bg-[#f8f8f8]"><div className="shell">
      <div className="section-head"><div><p className="section-sub">Curated Collections</p><h2>{s('coll')}</h2></div></div>
      <div className="collection-grid">{collections.map(c=>{const p=getP(c.items[0]);return <Link key={c.id} to={`/product/${p.id}`} className="col-card"><div className="col-visual">{p.img?<img src={p.img} className="w-full h-full object-contain p-6"/>:<div className="text-[10px] text-[#999] tracking-[.12em] font-semibold uppercase">{p.brand}</div>}</div><div className="col-card-info"><p>{c.copy}</p><h3>{ar?c.ar:c.title}</h3></div></Link>})}
    </div></div></section>
    <section id="about" className="py-14 md:py-20"><div className="shell">
      <div className="grid md:grid-cols-3 gap-6">{[
        [<ShieldCheck size={20}/>,s('orig'),s('origb')],
        [<Sparkles size={20}/>,s('smart'),s('smartb')],
        [<Truck size={20}/>,s('fast'),s('fastb')]
      ].map(([icon,title,body],i)=><div key={i} className="service-card">{icon}<h3>{title}</h3><p>{body}</p></div>)}
    </div></div></section>
    <section className="img-text-section bg-[#f8f8f8]"><div className="text"><p className="section-sub">Why Niche Center?</p><h2>{ar?'عطور نيش أصلية في الإمارات':'Original Niche Fragrances in the UAE'}</h2><p>{ar?'نيش سنتر يقدم أكثر من 100 عطر نيش أصلي من أشهر دور العطور العالمية. جميع التقسيمات من الزجاجات الأصلية.':'Niche Center offers 100+ original niche fragrances from the world\'s finest perfume houses. All decants from original retail bottles.'}</p><a href={whatsapp} target="_blank" className="slide-btn">{ar?'تواصل عبر واتساب':'Order via WhatsApp'}</a></div><div className="bg-[#e8e4da] min-h-[320px] flex items-center justify-center"><span className="text-[11px] text-[#999] tracking-[.2em] font-semibold uppercase">NICHE CENTER PERFUMES AE</span></div></section>
  </main>
}

function ProductPage(){
  const {id}=useParams();const p=getP(id);const {add}=useCart();const {ar,s}=useLang()
  const [sel,setSel]=useState(2);const [q,setQ]=useState(1);const [open,setOpen]=useState('Description')
  const pr=Math.round(p.price*(sizes[sel]?.m||1))
  useEffect(()=>{document.title=`${p.name} | Niche Center`},[p])
  return<main className="pt-6 pb-16">
    <div className="shell"><nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>{p.name}</span></nav></div>
    <div className="shell"><div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 md:gap-12 items-start">
      <div className="prod-visual"><div className="prod-main-img"><img src={p.img} alt={p.name}/></div>
      <div className="prod-thumbs">{products.slice(0,6).map(x=><Link key={x.id} to={`/product/${x.id}`} className={`prod-thumb ${x.id===p.id?'active':''}`}><img src={x.img} className="w-full h-full object-contain p-1.5"/></Link>)}</div></div>
      <div className="prod-detail"><h1>{ar?p.ar:p.name}</h1><p className="text-[12px] tracking-[.15em] font-semibold text-neutral-500 uppercase mt-2">{p.brand} · {p.family}</p>
      <p className="mt-5 text-[14px] leading-7 text-neutral-600">{ar?`تقسيمة أصلية من ${p.brand}. نوتات: ${p.family}`:`An original decant from ${p.brand}. Scent family: ${p.family}. Available in 5 sizes.`}</p>
      <div className="mt-6"><p className="text-[11px] tracking-[.12em] font-semibold uppercase mb-2">{s('size')}</p><div className="grid grid-cols-5 gap-2">{sizes.map((s,i)=><button key={s.l} onClick={()=>setSel(i)} className={`size-opt ${sel===i?'active':''}`}>{s.l}<small>{AED(Math.round(p.price*s.m))}</small></button>)}</div></div>
      <div className="mt-6 flex items-center gap-3"><div className="qty"><button onClick={()=>setQ(Math.max(1,q-1))}><Minus size={14}/></button><span>{q}</span><button onClick={()=>setQ(q+1)}><Plus size={14}/></button></div><button onClick={()=>add(p,sizes[sel].l,q)} className="slide-btn flex-1 h-[48px] justify-center">{s('add')} · {AED(pr*q)}</button></div>
      <div className="mt-5 grid grid-cols-3 gap-2">{['100% Original','UAE Delivery','WhatsApp Order'].map(x=><div key={x} className="service-pill"><ShieldCheck size={12}/><span>{x}</span></div>)}</div>
      <div className="mt-6 border-t border-[var(--border)]">{[
        [s('add')??'Description',`${p.name} by ${p.brand}. ${p.family} scent profile.`],
        ['Notes',`${p.family.replace(' ',' · ')} · Warm · Long-lasting`],
        ['Authenticity','Every decant is transferred from an original retail bottle into travel-friendly atomizers. 100% authentic, no copies.']
      ].map(([n,b])=><Accordion key={n} n={n} open={open} set={setOpen}>{b}</Accordion>)}</div>
    </div></div></div>
  </main>
}

function Accordion({n,open,set,children}){
  const a=open===n
  return<div className="border-b border-[var(--border)]"><button onClick={()=>set(a?'':n)} className="w-full py-4 flex items-center justify-between text-start font-semibold text-[13px]"><span>{n}</span><ChevronDown size={14} className={`transition ${a?'rotate-180':''}`}/></button><AnimatePresence>{a&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden pb-4 text-[13px] leading-6 text-neutral-500">{children}</motion.p>}</AnimatePresence></div>
}

function CartDrawer(){
  const {open,setOpen,items,up,rm,sub}=useCart();const {ar,s}=useLang();const nav=useNavigate()
  return<AnimatePresence>{open&&<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} className="fixed inset-0 bg-black/30 z-50"/><motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:260}} className="cart-drawer"><div className="h-14 px-5 flex items-center justify-between border-b border-[var(--border)]"><h2>{s('cart')}</h2><button onClick={()=>setOpen(false)}><X size={18}/></button></div>{items.length===0?<div className="flex-1 grid place-items-center"><div className="text-center"><ShoppingBag className="mx-auto mb-3 text-neutral-300"/><p className="text-sm text-neutral-500">{s('empty')}</p><Link onClick={()=>setOpen(false)} to="/" className="prod-btn px-8 mt-5 inline-flex w-auto">{s('keep')}</Link></div></div>:<><div className="p-5"><div className="ship-card"><span>{s('free')}</span><div className="ship-bar"><span style={{width:'30%'}}/></div></div></div><div className="flex-1 overflow-auto px-5">{items.map(x=><div key={x.id+x.sl} className="cart-item"><div className="cart-item-thumb"><img src={x.img}/></div><div><p className="text-sm font-semibold">{ar?x.ar:x.na}</p><p className="text-xs text-neutral-500">{x.sl}</p></div><div className="text-right"><span className="font-semibold text-sm">{AED(x.pr*x.q)}</span><div className="cart-qty mt-2"><button onClick={()=>up(x.id,x.sl,x.q-1)}>-</button><span>{x.q}</span><button onClick={()=>up(x.id,x.sl,x.q+1)}>+</button></div></div></div>)}</div><div className="p-5 border-t border-[var(--border)]"><div className="flex justify-between mb-3"><span className="text-sm">{s('subtotal')}</span><span className="font-bold">{AED(sub)}</span></div><button onClick={()=>{setOpen(false);nav('/checkout')}} className="slide-btn w-full justify-center">{s('chkout')}</button></div></>}</motion.aside></>}</AnimatePresence>
}

function Checkout(){
  const {items,sub,cl}=useCart();const {ar,s}=useLang();const [done,setDone]=useState(false);const ship=sub===0||sub>=200?0:15
  if(done)return<main className="min-h-[60vh] grid place-items-center shell py-20 text-center"><div><div className="w-14 h-14 rounded-full bg-[var(--emerald)] text-white grid place-items-center mx-auto mb-5"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div><h1 className="text-2xl font-bold">{s('confirmed')}</h1><p className="mt-3 text-sm text-neutral-500 max-w-sm">{s('confirmedBody')}</p><a href={whatsapp} target="_blank" className="slide-btn px-10 mt-6">{ar?'واتساب':'WhatsApp'}</a></div></main>
  return<main className="py-10 shell"><h1 className="text-xl font-bold mb-6">{s('chkout')}</h1><div className="grid lg:grid-cols-[1fr_360px] gap-8"><form onSubmit={e=>{e.preventDefault();setDone(true)}} className="space-y-6"><section><h2 className="text-[12px] tracking-[.12em] font-semibold uppercase mb-3">{s('contact')}</h2><div className="grid md:grid-cols-2 gap-3">{['First name','Last name','Email','Phone'].map(l=><label key={l} className="input-wrap"><span>{l}</span><input required type={l==='Email'?'email':'text'}/></label>)}</div></section><section><h2 className="text-[12px] tracking-[.12em] font-semibold uppercase mb-3">{s('del')}</h2><div className="grid gap-3"><label className="input-wrap"><span>Address</span><input required/></label><div className="grid md:grid-cols-3 gap-3">{['City','Emirate','Country'].map(l=><label key={l} className="input-wrap"><span>{l}</span><input required defaultValue={l==='Country'?'UAE':''}/></label>)}</div></div></section><section><h2 className="text-[12px] tracking-[.12em] font-semibold uppercase mb-3">{s('pay')}</h2><div className="grid gap-2">{['Credit Card','Tabby / Tamara','Cash on Delivery','WhatsApp Order'].map(p=><label key={p} className="pay-opt"><input type="radio" name="pay" defaultChecked={p==='Credit Card'}/><span>{p}</span></label>)}</div></section><button className="slide-btn px-10">{s('place')} · {AED(sub+ship)}</button></form>
  <aside className="summary-box"><h2 className="text-[12px] tracking-[.12em] font-semibold uppercase mb-3">{s('summary')}</h2>{items.map(x=><div key={x.id+x.sl} className="flex items-center gap-3 border-b border-[#f0f0f0] pb-3 mb-3"><div className="cart-item-thumb"><img src={x.img}/></div><div className="flex-1"><p className="text-sm font-semibold">{ar?x.ar:x.na}</p><p className="text-xs text-neutral-500">Qty {x.q} · {x.sl}</p></div><span className="font-semibold text-sm">{AED(x.pr*x.q)}</span></div>)}<div className="text-sm space-y-1 pt-3 border-t border-[var(--border)]"><div className="flex justify-between"><span>{s('subtotal')}</span><span>{AED(sub)}</span></div><div className="flex justify-between text-neutral-500"><span>Shipping</span><span>{ship===0?'Free':AED(ship)}</span></div><div className="flex justify-between font-bold pt-1"><span>Total</span><span>{AED(sub+ship)}</span></div></div></aside></div></main>
}

function Footer(){
  const {ar}=useLang()
  return<footer className="site-footer"><div className="shell foot-grid"><div><div className="foot-brand">NICHE<span style={{color:'var(--gold)'}}>CENTER</span></div><p className="foot-desc">{ar?'تقسيمات عطور نيش أصلية في الإمارات.':'Original luxury niche decants in the UAE.'}</p><div className="flex gap-2 mt-4"><a href={socials.instagram} target="_blank" className="w-9 h-9 rounded-full border border-[var(--border)] grid place-items-center hover:bg-[var(--emerald)] hover:border-[var(--emerald)] hover:text-white transition"><IG/></a><a href={whatsapp} target="_blank" className="w-9 h-9 rounded-full border border-[var(--border)] grid place-items-center hover:bg-[var(--emerald)] hover:border-[var(--emerald)] hover:text-white transition"><WA/></a></div></div>
  {[[ar?'عطور':'Brands',['BDK Parfums','Maison Crivelli','Amouage','Xerjoff','Byredo']],[ar?'تسوق':'Shop',['Best Sellers','Decants','Discovery Sets']],[ar?'الدعم':'Support',['WhatsApp','Instagram DM','Delivery','Contact']]].map(([t,links])=><div key={t} className="foot-col"><h3>{t}</h3>{links.map(l=><Link key={l} to={l==='WhatsApp'?whatsapp:'/'}>{l}</Link>)}</div>)}</div>
  <div className="shell foot-btm"><span>© 2026 Niche Center Perfumes AE</span><span><a href={socials.instagram}>Instagram</a> · <a href={whatsapp}>WhatsApp</a> · UAE</span></div></footer>
}

function Shell(){
  const loc=useLocation()
  useEffect(()=>window.scrollTo(0,0),[loc.pathname])
  return<><Header/><CartDrawer/><AnimatePresence mode="wait"><motion.div key={loc.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}><Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes></motion.div></AnimatePresence><Footer/><a href={whatsapp} target="_blank" className="floating-wa" aria-label="WhatsApp"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a></>
}

export default function App(){return <LangProvider><CartProvider><Shell/></CartProvider></LangProvider>}
