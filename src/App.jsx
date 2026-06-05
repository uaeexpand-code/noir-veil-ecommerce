import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Minus, Plus, ShoppingBag, X, Truck, ShieldCheck, Sparkles } from 'lucide-react'

const whatsapp = 'https://wa.me/971551495060'
const socials = {
  instagram: 'https://www.instagram.com/niche_center/',
  threads: 'https://www.threads.com/@niche_center',
  facebook: 'https://www.facebook.com/NicheCenter',
}

const decantSizes = [
  { label: '2ML', multiplier: 0.45 },
  { label: '3ML', multiplier: 0.62 },
  { label: '5ML', multiplier: 1 },
  { label: '10ML', multiplier: 1.82 },
  { label: '30ML', multiplier: 4.95 },
]

const products = [
  { id:'xerjoff-naxos', brand:'Xerjoff', name:'Naxos Decant', arName:'تقسيمة ناكسوس', family:'Honey Tobacco', price:72,
    notes:['Honey','Tobacco','Lavender','Tonka','Citrus','Vanilla'],
    story:'A rich Italian niche icon with honeyed tobacco, citrus brightness and a smooth vanilla-tonka trail.',
    arStory:'أيقونة نيش إيطالية غنية بالعسل والتبغ ولمسة حمضيات وفانيلا ناعمة.' },
  { id:'amouage-guidance', brand:'Amouage', name:'Guidance Decant', arName:'تقسيمة غايدنس', family:'Creamy Amber Floral', price:88,
    notes:['Pear','Hazelnut','Saffron','Rose','Sandalwood','Ambergris'],
    story:'A statement scent for elegant evenings: creamy, textured, long-lasting and unmistakably premium.',
    arStory:'عطر حضور للمناسبات: كريمي، فاخر، ثابت، ويترك بصمة واضحة.' },
  { id:'byredo-gypsy-water', brand:'Byredo', name:'Gypsy Water Decant', arName:'تقسيمة جيبسي ووتر', family:'Fresh Woody', price:58,
    notes:['Bergamot','Juniper','Incense','Pine Needle','Sandalwood','Vanilla'],
    story:'Fresh, woody and easy to wear — the kind of niche scent that works every day in UAE weather.',
    arStory:'فريش وخشبي وسهل الاستخدام اليومي، مناسب لأجواء الإمارات.' },
  { id:'nishane-hacivat', brand:'Nishane', name:'Hacivat Decant', arName:'تقسيمة هاجيفات', family:'Pineapple Oakmoss', price:76,
    notes:['Pineapple','Grapefruit','Bergamot','Cedarwood','Patchouli','Oakmoss'],
    story:'Bright fruit, clean woods and huge projection — a confident signature scent sample.',
    arStory:'فاكهة مشرقة وخشب نظيف وفوحان قوي لمن يريد عطراً مميزاً.' },
  { id:'diptyque-philosykos', brand:'Diptyque', name:'Philosykos Decant', arName:'تقسيمة فيلوسيكوس', family:'Green Fig', price:52,
    notes:['Fig Leaf','Fig','Coconut','Green Notes','Cedar','Wood'],
    story:'A calm green fig fragrance for daytime, office wear and quiet luxury styling.',
    arStory:'رائحة تين خضراء وهادئة تناسب النهار والعمل والفخامة البسيطة.' },
  { id:'frederic-malle-portrait', brand:'Frederic Malle', name:'Portrait Decant', arName:'تقسيمة بورتريه', family:'Rose Patchouli', price:92,
    notes:['Rose','Blackcurrant','Raspberry','Clove','Patchouli','Incense'],
    story:'A bold niche rose with depth, spice and power — made for evenings and formal presence.',
    arStory:'ورد نيش جريء وعميق مع بهارات وفخامة، مثالي للمساء والمناسبات.' },
  { id:'sospiro-vibrato', brand:'Sospiro', name:'Vibrato Decant', arName:'تقسيمة فيبراتو', family:'Citrus Aromatic', price:64,
    notes:['Grapefruit','Bergamot','Magnolia','Ginger','Cedar','Musk'],
    story:'Sparkling, fresh and refined with a polished citrus-musky drydown.',
    arStory:'فريش لامع وراقي مع حمضيات ومسك نظيف في القاعدة.' },
  { id:'atelier-materi', brand:'Atelier Materi', name:'Cacao Porcelana Decant', arName:'تقسيمة كاكاو بورسلان', family:'Gourmet Woody', price:78,
    notes:['Cacao','Sandalwood','Vanilla','Cedar','Musk'],
    story:'A rare gourmand wood fragrance from the niche house of Atelier Materi. Dark cacao meets creamy sandalwood.',
    arStory:'عطر نادر من بيت أتيليه ماتيري. كاكاو داكن يلتقي بخشب الصندل الكريمي.' },
  { id:'discovery-set', brand:'Niche Center', name:'Discovery Set (8x2ML)', arName:'مجموعة التجربة', family:'Choose 8 Decants', price:145, set:true,
    notes:['8 Decants','Original Bottles','Travel Ready','Gift Box','UAE Delivery','No Copies'],
    story:'Build your personal niche wardrobe before investing in full bottles. Perfect as a gift or first order.',
    arStory:'جرّب عدة عطور نيش أصلية قبل شراء الزجاجة الكاملة. مناسب كهدية أو أول طلب.' },
]

const collections = [
  { id:'best', title:'Best Sellers', ar:'الأكثر طلباً', copy:'Customer favourites from 3000+ UAE orders.', items:['xerjoff-naxos','amouage-guidance','nishane-hacivat'] },
  { id:'fresh', title:'Fresh & Daily', ar:'فريش يومي', copy:'Clean, citrus and musky profiles for UAE weather.', items:['byredo-gypsy-water','diptyque-philosykos','sospiro-vibrato'] },
  { id:'luxury', title:'Luxury Icons', ar:'أيقونات فاخرة', copy:'The most prestigious niche houses in decant sizes.', items:['frederic-malle-portrait','amouage-guidance','atelier-materi'] },
]

const copy = {
  en: {
    announcement:'Original niche decants · UAE delivery · +3000 happy customers · WhatsApp order',
    shop:'Decants', collections:'Collections', about:'About',
    heroKicker:'Niche Center Perfumes AE', heroTitle:'Original luxury decants, in smarter sizes.',
    heroBody:'Try Xerjoff, Amouage, Byredo, Frederic Malle and more before buying the full bottle. Premium decants from original retail bottles — no copies, no oils.',
    cta:'Shop Decants', dm:'Order via WhatsApp',
    proof1:'3000+ Happy Customers', proof2:'2ML · 3ML · 5ML · 10ML · 30ML', proof3:'Fast UAE Delivery',
    best:'Our Decants', bestCta:'View All', whyTitle:'Why Decants?',
    original:'100% Original', originalBody:'Every decant is transferred directly from original retail bottles. No copies, no inspired oils, no mixing.',
    sizes:'Smart Sizes', sizesBody:'Choose from 2ML to 30ML for discovery, travel, office or daily wear.',
    delivery:'Fast UAE Delivery', deliveryBody:'Free delivery across the UAE. Order via WhatsApp or Instagram DM.',
    add:'Add to Bag', size:'Size', notes:'Notes', description:'Description',
    authenticity:'Authenticity', related:'You May Also Like',
    cart:'Your Bag', empty:'Your bag is empty.', subtotal:'Subtotal', checkout:'Checkout', keep:'Continue Shopping',
    free:'Free delivery unlocked', addFree:'Add', forFree:'for free UAE delivery',
    contact:'Contact', deliveryForm:'Delivery', payment:'Payment', place:'Place Order', orderSummary:'Order Summary',
    confirmed:'Order Confirmed', confirmedBody:'Thank you! We will confirm your order via WhatsApp shortly.',
  },
  ar: {
    announcement:'تقسيمات عطور نيش أصلية · توصيل الإمارات · +3000 عميل · الطلب عبر واتساب',
    shop:'التقسيمات', collections:'المجموعات', about:'عن المتجر',
    heroKicker:'نيش سنتر للعطور', heroTitle:'عطور نيش أصلية بأحجام ذكية.',
    heroBody:'جرّب Xerjoff و Amouage و Byredo و Frederic Malle قبل شراء الزجاجة الكاملة. تقسيمات فاخرة من الزجاجات الأصلية.',
    cta:'تسوق التقسيمات', dm:'اطلب عبر واتساب',
    proof1:'+3000 عميل سعيد', proof2:'2مل · 3مل · 5مل · 10مل · 30مل', proof3:'توصيل سريع الإمارات',
    best:'تقسيماتنا', bestCta:'عرض الكل', whyTitle:'لماذا التقسيمات؟',
    original:'أصلي 100%', originalBody:'كل تقسيمة مسحوبة مباشرة من الزجاجة الأصلية. بدون كوبي أو زيوت.',
    sizes:'أحجام ذكية', sizesBody:'اختر من 2مل إلى 30مل للتجربة، السفر، العمل أو الاستخدام اليومي.',
    delivery:'توصيل سريع الإمارات', deliveryBody:'توصيل مجاني في جميع أنحاء الإمارات. اطلب عبر واتساب أو إنستغرام.',
    add:'أضف للسلة', size:'الحجم', notes:'النوتات', description:'الوصف',
    authenticity:'الأصالة', related:'قد يعجبك أيضاً',
    cart:'السلة', empty:'السلة فارغة.', subtotal:'المجموع', checkout:'الدفع', keep:'متابعة التسوق',
    free:'تم تفعيل التوصيل المجاني', addFree:'أضف', forFree:'للتوصيل المجاني',
    contact:'بيانات التواصل', deliveryForm:'التوصيل', payment:'الدفع', place:'تأكيد الطلب', orderSummary:'ملخص الطلب',
    confirmed:'تم تأكيد الطلب', confirmedBody:'شكراً! سنؤكد طلبك عبر واتساب قريباً.',
  }
}

const money = n => `AED ${n.toLocaleString()}`
const getProduct = id => products.find(p => p.id === id) || products[0]
const useLangText = () => useContext(LangContext)
const LangContext = createContext(null)
function LangProvider({children}){
  const [lang,setLang] = useState(()=>localStorage.getItem('nc-lang')||'en')
  useEffect(()=>{localStorage.setItem('nc-lang',lang);document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr'},[lang])
  const value=useMemo(()=>({lang,isAr:lang==='ar',toggle:()=>setLang(x=>x==='ar'?'en':'ar'),t:key=>copy[lang][key]||copy.en[key]||key}),[lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

const CartContext = createContext(null)
function CartProvider({children}){
  const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('nc-cart')||'[]')}catch{return[]}})
  const [open,setOpen]=useState(false)
  useEffect(()=>localStorage.setItem('nc-cart',JSON.stringify(items)),[items])
  const add=(product,size='5ML',qty=1) => {
    const opt=decantSizes.find(x=>x.label===size)||decantSizes[2]
    const price=Math.round(product.price*opt.multiplier)
    setItems(prev=>{const hit=prev.find(x=>x.id===product.id&&x.size===size);if(hit)return prev.map(x=>x.id===product.id&&x.size===size?{...x,qty:x.qty+qty}:x);return[...prev,{id:product.id,name:product.name,arName:product.arName,brand:product.brand,family:product.family,set:product.set,size,price,qty}]})
    setOpen(true)
  }
  const update=(id,size,qty)=>setItems(prev=>prev.map(x=>x.id===id&&x.size===size?{...x,qty:Math.max(1,qty)}:x))
  const remove=(id,size)=>setItems(prev=>prev.filter(x=>!(x.id===id&&x.size===size)))
  const clear=()=>setItems([]);const subtotal=items.reduce((s,x)=>s+x.price*x.qty,0);const count=items.reduce((s,x)=>s+x.qty,0)
  const value=useMemo(()=>({items,open,setOpen,add,update,remove,clear,subtotal,count}),[items,open,subtotal,count])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
const useCart=()=>useContext(CartContext)

function VialArt({product,small=false}){
  if(product?.set) return <div className={`set-box ${small?'set-box-sm':''}`}><div className="set-logo">NC</div><div className="grid grid-cols-4 gap-1 w-[65%]">{products.slice(0,8).map(p=><i key={p.id} style={{background:`linear-gradient(180deg,${p.color2||'#fff4c9'},${p.color||'#d7b36a'})`}}/>)}</div><span>DISCOVERY</span></div>
  return <div className={`vial ${small?'vial-sm':''}`} style={{'--juice':product?.color||'#d7b36a','--juice2':product?.color2||'#fff4c9'}}><span>{product?.brand||'NICHE'}</span><b>{product?.name?.split(' ')[0]||'CENTER'}</b></div>
}

function InstagramIcon({size=18}){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/></svg>
}

function Header(){
  const {count,setOpen}=useCart();const {lang,t,toggle}=useLangText()
  return <>
    <div className="promo-bar">{t('announcement')}</div>
    <header className="site-header">
      <div className="shell flex items-center justify-between h-[68px]">
        <Link to="/" className="logo"><span className="logo-seal">NC</span><span className="logo-text">NICHE<span className="text-gold">CENTER</span></span></Link>
        <nav className="hidden md:flex items-center gap-7 text-[12px] font-semibold tracking-[.12em] uppercase">
          <a href="#shop" className="nav-link">{t('shop')}</a>
          <a href="#collections" className="nav-link">{t('collections')}</a>
          <a href="#about" className="nav-link">{t('about')}</a>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="nav-link text-gold">WhatsApp</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href={socials.instagram} target="_blank" rel="noreferrer" className="icon-btn hidden sm:flex"><InstagramIcon size={17}/></a>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="icon-btn hidden sm:flex"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>
          <button className="lang-btn" onClick={toggle}>{lang==='ar'?'EN':'AR'}</button>
          <button onClick={()=>setOpen(true)} className="cart-btn"><ShoppingBag size={20}/>{count>0&&<span>{count}</span>}</button>
        </div>
      </div>
    </header>
  </>
}

function Hero(){
  const {t,isAr}=useLangText()
  return <section className="hero"><div className="shell hero-grid">
    <div className="hero-copy"><p className="brand-tag">{t('heroKicker')}</p><h1>{t('heroTitle')}</h1><p className="hero-body">{t('heroBody')}</p><div className="flex gap-3 mt-8"><Link to="#shop" className="btn-primary">{t('cta')}</Link><a href={whatsapp} target="_blank" className="btn-outline">{t('dm')}</a></div></div>
    <div className="hero-visual"><div className="hero-bottle"><div className="hero-badge">+3000</div><VialArt product={products[0]}/><VialArt product={products[1]} small/><VialArt product={products[2]} small/></div></div>
  </div>
  <div className="hero-strip"><span>{t('proof1')}</span><span>{t('proof2')}</span><span>{t('proof3')}</span></div></section>
}

function ProductCard({product,i=0}){
  const {add}=useCart();const {isAr,t}=useLangText()
  const [sel,setSel]=useState(2)
  return <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:i*.06}} className="product-card">
    <Link to={`/product/${product.id}`} className="card-visual"><VialArt product={product}/></Link>
    <div className="p-5"><Link to={`/product/${product.id}`}><p className="text-[11px] tracking-[.12em] font-semibold text-neutral-500 uppercase">{product.brand}</p><h3 className="text-[16px] font-bold mt-1 leading-tight">{isAr?product.arName:product.name}</h3><p className="text-[12px] text-neutral-400 mt-1">{product.family}</p></Link>
    <div className="flex flex-wrap gap-1.5 mt-3">{decantSizes.slice(0,4).map((s,i)=><button key={s.label} onClick={()=>setSel(i)} className={`size-pill ${sel===i?'active':''}`}>{s.label}</button>)}</div>
    <button onClick={()=>add(product,decantSizes[sel].label)} className="btn-primary w-full mt-4">{money(Math.round(product.price*decantSizes[sel].multiplier))}</button></div>
  </motion.div>
}

function ProductRail({title,cta,items=products}){
  return <section id="shop" className="py-16 md:py-24"><div className="shell"><div className="flex items-end justify-between mb-10"><div><p className="text-[11px] tracking-[.2em] font-semibold text-neutral-400 uppercase">Niche Center Perfumes AE</p><h2 className="section-title">{title}</h2></div><Link to={whatsapp} className="text-sm font-medium underline underline-offset-4">{cta}</Link></div></div>
  <div className="shell"><div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">{items.map((p,i)=><ProductCard key={p.id} product={p} i={i}/>)}</div></div></section>
}

function CollectionCard({col}){
  const {isAr}=useLangText();const p=getProduct(col.items[0])
  return <Link to={`/product/${p.id}`} className="collection-card"><div className="collection-visual"><VialArt product={p}/></div><div className="p-6"><p className="text-[11px] tracking-[.12em] text-neutral-400 uppercase">{col.copy}</p><h3 className="text-[20px] font-bold mt-1">{isAr?col.ar:col.title}</h3></div></Link>
}

function Home(){
  const {t,isAr}=useLangText()
  return <main><Hero/>
    <ProductRail title={t('best')} cta={t('bestCta')} items={products}/>
    <section id="about" className="py-16 md:py-24 bg-[#f8f8f8]"><div className="shell grid md:grid-cols-2 gap-12 items-center"><div><p className="text-[11px] tracking-[.2em] font-semibold text-neutral-400 uppercase">Niche Center</p><h2 className="text-[36px] md:text-[52px] font-bold leading-[.92] tracking-[-.03em]">{isAr?'لماذا التقسيمات؟':'Why Decants?'}</h2></div><div className="space-y-5 text-[15px] leading-7 text-neutral-600"><p>{isAr?'شراء عطر نيش كامل بدون تجربة مكلف. نيش سنتر يقدم طريقة أذكى لاختبار الثبات والفوحان قبل الشراء.':'Blind-buying a full bottle of niche fragrance is expensive. Niche Center gives you a smarter way to test longevity, sillage and skin chemistry before committing.'}</p><p>{isAr?'أكثر من 100 عطر نيش فاخر، جميعها أصلية 100%، مسحوبة من الزجاجة الأصلية في الإمارات.':'Over 100 luxury niche fragrances, all 100% original, transferred from retail bottles here in the UAE.'}</p><a href={whatsapp} target="_blank" className="btn-primary mt-4 w-fit">{isAr?'تواصل عبر واتساب':'Order via WhatsApp'}</a></div></div></section>
    <section id="collections" className="py-16 md:py-24"><div className="shell"><h2 className="section-title mb-8">{t('collections')}</h2></div>
    <div className="shell"><div className="grid md:grid-cols-3 gap-6">{collections.map(col=><CollectionCard key={col.id} col={col}/>)}</div></div></section>
    <section className="py-16 md:py-24 bg-[#f8f8f8]"><div className="shell grid md:grid-cols-3 gap-8"><div className="service-card"><ShieldCheck size={22}/><h3>{t('original')}</h3><p>{t('originalBody')}</p></div><div className="service-card"><Sparkles size={22}/><h3>{t('sizes')}</h3><p>{t('sizesBody')}</p></div><div className="service-card"><Truck size={22}/><h3>{t('delivery')}</h3><p>{t('deliveryBody')}</p></div></div></section>
  </main>
}

function ProductPage(){
  const {id}=useParams();const product=getProduct(id);const {add}=useCart();const {t,isAr}=useLangText()
  const [sel,setSel]=useState(2);const [qty,setQty]=useState(1);const [open,setOpen]=useState('Description')
  const price=Math.round(product.price*(decantSizes[sel]?.multiplier||1))
  useEffect(()=>{document.title=`${product.name} | Niche Center Perfumes AE`},[product])
  return <main className="pt-4 md:pt-8">
    <section className="shell pb-6"><nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="text-neutral-900">{product.name}</span></nav></section>
    <section className="shell"><div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 md:gap-14 items-start">
      <div className="product-visual"><div className="product-bottle-wrap"><div className="hero-badge">{product.badge||'Premium Decant'}</div><VialArt product={product}/></div>
      <div className="product-thumbs">{products.slice(0,6).map(p=><Link key={p.id} to={`/product/${p.id}`} className={`thumb ${p.id===product.id?'active':''}`}><VialArt product={p} small/></Link>)}</div></div>
      <div className="product-info"><h1>{isAr?product.arName:product.name}</h1><p className="text-[12px] tracking-[.15em] font-semibold text-neutral-500 uppercase mt-2">{product.brand} · {product.family}</p>
      <p className="mt-6 text-[15px] leading-7 text-neutral-600">{isAr?product.arStory:product.story}</p>
      <div className="mt-8"><p className="text-[12px] tracking-[.12em] font-semibold uppercase mb-3">{t('size')}</p><div className="grid grid-cols-5 gap-2">{decantSizes.map((s,i)=><button key={s.label} onClick={()=>setSel(i)} className={`size-opt ${sel===i?'active':''}`}>{s.label}<small>{money(Math.round(product.price*s.multiplier))}</small></button>)}</div></div>
      <div className="mt-8 flex items-center gap-3"><div className="qty"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={14}/></button><span>{qty}</span><button onClick={()=>setQty(qty+1)}><Plus size={14}/></button></div><motion.button whileTap={{scale:.97}} onClick={()=>add(product,decantSizes[sel].label,qty)} className="btn-primary flex-1 h-[52px]">{t('add')} · {money(price*qty)}</motion.button></div>
      <div className="mt-6 grid grid-cols-3 gap-2">{['100% Original','UAE Delivery','WhatsApp Order'].map(s=><div key={s} className="service-pill"><ShieldCheck size={13}/><span>{s}</span></div>)}</div>
      <div className="mt-8 border-t border-neutral-200">{[[t('description'),`${product.story}\n\n${product.notes.join(' · ')}`],[t('notes'),product.notes.join(' · ')],[t('authenticity'),isAr?'كل تقسيمة مسحوبة من الزجاجة الأصلية مباشرة في عبوات مناسبة للسفر والتجربة.':'Every decant is transferred from an original retail bottle into travel-friendly atomizers for sampling and daily use.']].map(([n,b])=><Accordion key={n} name={n} open={open} setOpen={setOpen}>{b}</Accordion>)}</div>
    </div></div></section>
    <ProductRail title={t('related')} cta={t('bestCta')} items={products.filter(p=>p.id!==product.id)}/>
  </main>
}

function Accordion({name,open,setOpen,children}){
  const active=open===name
  return <div className="border-b border-neutral-200"><button onClick={()=>setOpen(active?'':name)} className="w-full py-5 flex items-center justify-between text-start font-semibold text-[14px]"><span>{name}</span><ChevronDown size={16} className={`transition ${active?'rotate-180':''}`}/></button><AnimatePresence>{active&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden pb-5 text-[14px] leading-7 text-neutral-500 whitespace-pre-line">{children}</motion.p>}</AnimatePresence></div>
}

function CartDrawer(){
  const {open,setOpen,items,update,remove,subtotal}=useCart();const {t,isAr}=useLangText();const navigate=useNavigate()
  const freeAt=200;const left=Math.max(0,freeAt-subtotal)
  return <AnimatePresence>{open&&<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} className="fixed inset-0 bg-black/40 z-50"/><motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:260}} className="cart-drawer"><div className="h-16 px-6 flex items-center justify-between border-b border-neutral-200"><h2 className="text-lg font-bold">{t('cart')}</h2><button onClick={()=>setOpen(false)}><X/></button></div>{items.length===0?<div className="flex-1 grid place-items-center text-center px-8"><div><ShoppingBag className="mx-auto mb-4 text-neutral-300"/><p className="text-neutral-500">{t('empty')}</p><Link onClick={()=>setOpen(false)} to="/" className="btn-primary px-10 mt-7">{t('keep')}</Link></div></div>:<><div className="px-6 pt-4 pb-2"><div className={`shipping-card ${left===0?'done':''}`}><span>{left===0?t('free'):`${t('addFree')} ${money(left)} ${t('forFree')}`}</span><div><span style={{width:`${Math.min(100,subtotal/freeAt*100)}%`}}/></div></div></div><div className="flex-1 overflow-auto px-6 space-y-4">{items.map(item=><div key={item.id+item.size} className="grid grid-cols-[72px_1fr] gap-4 border-b border-neutral-100 pb-4"><div className="cart-thumb"><VialArt product={item} small/></div><div><div className="flex justify-between"><div><h3 className="text-sm font-semibold">{isAr?item.arName:item.name}</h3><p className="text-xs text-neutral-500">{item.brand} · {item.size}</p></div><button onClick={()=>remove(item.id,item.size)}><X size={15}/></button></div><div className="flex items-center justify-between mt-3"><div className="qty sm"><button onClick={()=>update(item.id,item.size,item.qty-1)}><Minus size={12}/></button><span>{item.qty}</span><button onClick={()=>update(item.id,item.size,item.qty+1)}><Plus size={12}/></button></div><span className="font-semibold">{money(item.price*item.qty)}</span></div></div></div>)}</div><div className="p-6 border-t border-neutral-200"><div className="flex justify-between mb-4"><span className="text-sm">{t('subtotal')}</span><span className="font-bold">{money(subtotal)}</span></div><button onClick={()=>{setOpen(false);navigate('/checkout')}} className="btn-primary w-full h-[50px]">{t('checkout')}</button><a href={whatsapp} target="_blank" rel="noreferrer" className="btn-outline-dark w-full h-[46px] mt-3 flex items-center justify-center gap-2 text-sm font-semibold">{isAr?'اطلب عبر واتساب':'Order via WhatsApp'} · +971 55 149 5060</a></div></>}</motion.aside></>}</AnimatePresence>
}

function Checkout(){
  const {items,subtotal,clear}=useCart();const {t,isAr}=useLangText();const [done,setDone]=useState(false);const shipping=subtotal===0||subtotal>=200?0:15
  if(done)return<main className="min-h-[70vh] py-20 grid place-items-center text-center shell"><div><div className="w-16 h-16 rounded-full bg-[#173d2f] text-white grid place-items-center mx-auto mb-6"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div><h1 className="text-3xl font-bold">{t('confirmed')}</h1><p className="mt-4 text-neutral-500 max-w-md">{t('confirmedBody')}</p><a href={whatsapp} target="_blank" className="btn-primary px-12 mt-8">{isAr?'تواصل عبر واتساب':'Contact via WhatsApp'}</a></div></main>
  return<main className="py-8 md:py-16 shell"><h1 className="text-2xl font-bold mb-8">{t('checkout')}</h1><div className="grid lg:grid-cols-[1fr_380px] gap-8"><form onSubmit={e=>{e.preventDefault();setDone(true)}} className="space-y-8"><section><h2 className="text-[13px] tracking-[.15em] font-semibold uppercase mb-4">{t('contact')}</h2><div className="grid md:grid-cols-2 gap-4">{['First name','Last name','Email','Phone'].map(l=><label key={l} className="input-label"><span>{l}</span><input required type={l==='Email'?'email':'text'}/></label>)}</div></section><section><h2 className="text-[13px] tracking-[.15em] font-semibold uppercase mb-4">{t('deliveryForm')}</h2><div className="grid gap-4"><label className="input-label"><span>Address</span><input required/></label><div className="grid md:grid-cols-3 gap-4">{['City','Emirate','Country'].map(l=><label key={l} className="input-label"><span>{l}</span><input required defaultValue={l==='Country'?'United Arab Emirates':''}/></label>)}</div></div></section><section><h2 className="text-[13px] tracking-[.15em] font-semibold uppercase mb-4">{t('payment')}</h2><div className="grid gap-2">{['Credit Card','Tabby / Tamara','Cash on Delivery','WhatsApp Order'].map(p=><label key={p} className="pay-row"><input type="radio" name="pay" defaultChecked={p==='Credit Card'}/><span>{p}</span></label>)}</div></section><button className="btn-primary h-[52px] w-full md:w-[300px]">{t('place')} · {money(subtotal+shipping)}</button></form>
  <aside className="summary"><h2 className="text-[13px] tracking-[.15em] font-semibold uppercase mb-4">{t('orderSummary')}</h2>{items.length===0?<p className="text-sm text-neutral-500">{t('empty')}</p>:items.map(item=><div key={item.id+item.size} className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-4"><div className="cart-thumb small"><VialArt product={item} small/></div><div className="flex-1"><p className="text-sm font-semibold">{isAr?item.arName:item.name}</p><p className="text-xs text-neutral-500">Qty {item.qty} · {item.size}</p></div><span className="font-semibold">{money(item.price*item.qty)}</span></div>)}<div className="space-y-2 text-sm pt-4 border-t border-neutral-200"><div className="flex justify-between"><span>{t('subtotal')}</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-neutral-500"><span>Shipping</span><span>{shipping===0?'Complimentary':money(shipping)}</span></div><div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>{money(subtotal+shipping)}</span></div></div><div className="mt-4 pt-4 border-t border-neutral-200"><a href={whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm font-semibold text-[#173d2f]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>{isAr?'اطلب عبر واتساب':'Order via WhatsApp'} +971 55 149 5060</a></div></aside></div></main>
}

function Footer(){
  const {isAr}=useLangText()
  return <footer className="site-footer"><div className="shell footer-grid"><div><Link to="/" className="logo mb-3"><span className="logo-seal">NC</span><span className="logo-text">NICHE<span className="text-gold">CENTER</span></span></Link><p className="footer-desc">{isAr?'تقسيمات عطور نيش أصلية في الإمارات. جرب العطر قبل شراء الزجاجة الكاملة.':'Original luxury niche decants in the UAE. Try before you buy the full bottle.'}</p><div className="flex gap-2 mt-5"><a href={socials.instagram} target="_blank" className="icon-btn"><InstagramIcon size={17}/></a><a href={whatsapp} target="_blank" className="icon-btn"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a></div></div>
  {[[isAr?'عطور':'Brands',['Xerjoff','Amouage','Byredo','Frederic Malle','Atelier Materi']],[isAr?'تسوق':'Shop',['Best Sellers','Discovery Sets','Decants','Retail Bottles']],[isAr?'الدعم':'Support',['WhatsApp +971 55 149 5060','Instagram DM','Fast Delivery','Authenticity']]].map(([t,links])=><div key={t} className="footer-col"><h3>{t}</h3>{links.map(l=><Link key={l} to={l.includes('+971')?whatsapp:'/'}>{l}</Link>)}</div>)}</div>
  <div className="shell footer-btm"><span>© 2026 Niche Center Perfumes AE</span><span><a href={socials.instagram} className="hover:text-black">Instagram</a> · <a href={whatsapp} className="hover:text-black">WhatsApp</a> · UAE · {isAr?'العربية':'English'}</span></div></footer>
}

function FloatingWA(){
  return <a href={whatsapp} target="_blank" rel="noreferrer" className="floating-wa" aria-label="WhatsApp"><svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
}

function Shell(){
  const location=useLocation()
  useEffect(()=>window.scrollTo(0,0),[location.pathname])
  return <><Header/><CartDrawer/><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes></motion.div></AnimatePresence><Footer/><FloatingWA/></>
}

export default function App(){return <LangProvider><CartProvider><Shell/></CartProvider></LangProvider>}
