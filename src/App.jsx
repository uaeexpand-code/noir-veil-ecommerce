import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Minus, Plus, ShoppingBag, X, Truck, ShieldCheck, Sparkles } from 'lucide-react'

const socials = {
  instagram: 'https://www.instagram.com/niche_center/',
  threads: 'https://www.threads.com/@niche_center',
}

const sizes = ['60ML','100ML','200ML']
const sizeBaseMap = { '60ML':.6, '100ML':1, '200ML':1.82 }

const products = [
  { id:'sauvage-edp', brand:'Dior', name:'Sauvage Eau de Parfum', arName:'سافاج أو دو بارفان', family:'Citrus Vanilla', price:695, badge:'Bestseller',
    notes:['Bergamot','Vanilla','Patchouli','Amber','Sichuan Pepper'],
    story:'A powerful and noble trail inspired by the desert at twilight. Fresh Calabrian bergamot meets enveloping Papua New Guinean vanilla.',
    arStory:'مستوحى من الصحراء في الشفق. برغموت كالابريا الطازج يلتقي بفانيليا بابوا غينيا الجديدة.',
    campaign:'Born in the wild, crafted by Dior.' },
  { id:'sauvage-elixir', brand:'Dior', name:'Sauvage Elixir', arName:'سافاج إيليكسير', family:'Spicy Fresh Woody', price:1095,
    notes:['Cinnamon','Nutmeg','Grapefruit','Lavender','Patchouli'],
    story:'An ultra-concentrated elixir with intense spicy-fresh notes. A bold signature for those who dare.',
    arStory:'إيليكسير فائق التركيز بنوتات حارة طازجة. توقيع جريء لمن يجرؤ.' },
  { id:'sauvage-eau-forte', brand:'Dior', name:'Sauvage Eau Forte', arName:'سافاج أو فورت', family:'Alcohol-free Fresh', price:740,
    notes:['Bergamot','Sandalwood','Musk','Cedar'],
    story:'An alcohol-free interpretation of Sauvage. Fresh, intense and modern, crafted for a new generation.',
    arStory:'تفسير خالٍ من الكحول لسافاج. طازج، كثيف وعصري.' },
  { id:'miss-dior-edp', brand:'Dior', name:'Miss Dior Eau de Parfum', arName:'مس ديور أو دو بارفان', family:'Floral Chypre', price:815,
    notes:['Rose','Peony','Patchouli','Musk','Lily of the Valley'],
    story:'An absolutely fresh and audacious rose. Like a love letter to happiness, signed by Dior.',
    arStory:'وردة طازجة وجريئة. كرسالة حب للسعادة، موقعة من ديور.' },
  { id:'fahrenheit-edp', brand:'Dior', name:'Fahrenheit Eau de Parfum', arName:'فهرنهايت أو دو بارفان', family:'Leather Woody', price:750,
    notes:['Violet Leaf','Nutmeg','Leather','Cedar','Musk'],
    story:'An iconic masculine scent with a unique leather-violet accord. Timeless, distinctive and unforgettable.',
    arStory:'عطر رجالي أيقوني بمزيج فريد من الجلد والبنفسج. خالٍ من الزمن، مميز لا يُنسى.' },
  { id:'j-adore-edp', brand:'Dior', name:"J'adore Eau de Parfum", arName:'جادور أو دو بارفان', family:'Floral Fruity', price:875,
    notes:['Ylang-Ylang','Rose','Jasmine','Sandalwood','Vanilla'],
    story:'A floral bouquet of rare and precious flowers. The ultimate expression of femininity by Dior.',
    arStory:'باقة زهور نادرة وثمينة. التعبير الأسمى عن الأنوثة من ديور.' },
]

const collections = [
  { id:'bestsellers', title:'Bestsellers', ar:'الأكثر مبيعاً', copy:'The fragrances that define Dior.', items:['sauvage-edp','miss-dior-edp','j-adore-edp'] },
  { id:'masculine', title:'Masculine Fragrances', ar:'عطور رجالية', copy:'Bold signatures for the modern man.', items:['sauvage-edp','sauvage-elixir','fahrenheit-edp'] },
  { id:'feminine', title:'Feminine Fragrances', ar:'عطور نسائية', copy:'Floral bouquets of rare beauty.', items:['j-adore-edp','miss-dior-edp'] },
]

const copy = {
  en: {
    announcement:'Complimentary delivery on all orders · 4-hour delivery in Dubai · Free samples',
    shop:'Fragrances', collections:'Collections', about:'Maison Dior',
    heroKicker:'Maison Dior', heroTitle:'Sauvage. Born in the wild.',
    heroBody:'The new Eau de Parfum. Fresh Calabrian bergamot meets enveloping Papua New Guinean vanilla. Refillable bottle, crafted by Dior.',
    cta:'Discover', dm:'Find your fragrance',
    proof1:'Complimentary delivery', proof2:'Free samples with every order', proof3:'4-Hour delivery in Dubai',
    best:'Our Fragrances', bestCta:'View all', whyTitle:'The Dior Experience',
    original:'Complimentary Delivery', originalBody:'Free standard delivery on all orders across the UAE.',
    sizes:'4-Hour Express', sizesBody:'Free express delivery in Dubai on orders above 300 AED. Order before 5 PM.',
    delivery:'Art of Gifting', deliveryBody:'Every order arrives in the iconic Dior gift box with pleated tissue paper and signature bow.',
    add:'Add to Bag', size:'Select Size', notes:'Fragrance Notes', description:'Description',
    authenticity:'Sustainability', related:'Complete the Collection',
    cart:'Your Bag', empty:'Your bag is empty.', subtotal:'Subtotal', checkout:'Checkout', keep:'Continue Shopping',
    free:'Free delivery unlocked', addFree:'Add', forFree:'for free express delivery',
    contact:'Contact', deliveryForm:'Delivery', payment:'Payment', place:'Place Order', orderSummary:'Order Summary',
    confirmed:'Order Confirmed', confirmedBody:'Thank you for your order. A Dior Beauty advisor will contact you shortly to confirm delivery details.',
  },
  ar: {
    announcement:'توصيل مجاني لجميع الطلبات · توصيل خلال 4 ساعات في دبي · عينات مجانية',
    shop:'العطور', collections:'المجموعات', about:'ميزون ديور',
    heroKicker:'ميزون ديور', heroTitle:'سافاج. مولود في البرية.',
    heroBody:'أو دو بارفان الجديد. برغموت كالابريا الطازج يلتقي بفانيليا بابوا غينيا الجديدة. زجاجة قابلة لإعادة التعبئة.',
    cta:'اكتشف', dm:'اعثر على عطرك',
    proof1:'توصيل مجاني', proof2:'عينات مجانية مع كل طلب', proof3:'توصيل خلال 4 ساعات في دبي',
    best:'عطورنا', bestCta:'عرض الكل', whyTitle:'تجربة ديور',
    original:'توصيل مجاني', originalBody:'توصيل مجاني لجميع الطلبات في جميع أنحاء الإمارات.',
    sizes:'توصيل سريع', sizesBody:'توصيل مجاني في دبي للطلبات فوق 300 درهم. اطلب قبل الساعة 5 مساءً.',
    delivery:'فن الإهداء', deliveryBody:'يصل كل طلب في صندوق ديور الأيقوني مع ورق التغليف والشريط المميز.',
    add:'أضف إلى السلة', size:'اختر الحجم', notes:'نوتات العطر', description:'الوصف',
    authenticity:'الاستدامة', related:'أكمل المجموعة',
    cart:'حقيبتك', empty:'حقيبتك فارغة.', subtotal:'المجموع', checkout:'الدفع', keep:'متابعة التسوق',
    free:'تم تفعيل التوصيل المجاني', addFree:'أضف', forFree:'للتوصيل السريع المجاني',
    contact:'بيانات التواصل', deliveryForm:'التوصيل', payment:'الدفع', place:'تأكيد الطلب', orderSummary:'ملخص الطلب',
    confirmed:'تم تأكيد الطلب', confirmedBody:'شكراً لطلبك. سيتواصل معك مستشار ديور قريباً لتأكيد تفاصيل التوصيل.',
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
  const add=(product,size='60ML',qty=1)=>{const m=sizeBaseMap[size]||.6;const p=Math.round(product.price*m);setItems(prev=>{const hit=prev.find(x=>x.id===product.id&&x.size===size);if(hit)return prev.map(x=>x.id===product.id&&x.size===size?{...x,qty:x.qty+qty}:x);return[...prev,{id:product.id,name:product.name,arName:product.arName,brand:product.brand,size,price:p,qty}]});setOpen(true)}
  const update=(id,size,qty)=>setItems(prev=>prev.map(x=>x.id===id&&x.size===size?{...x,qty:Math.max(1,qty)}:x))
  const remove=(id,size)=>setItems(prev=>prev.filter(x=>!(x.id===id&&x.size===size)))
  const clear=()=>setItems([]);const subtotal=items.reduce((s,x)=>s+x.price*x.qty,0);const count=items.reduce((s,x)=>s+x.qty,0)
  const value=useMemo(()=>({items,open,setOpen,add,update,remove,clear,subtotal,count}),[items,open,subtotal,count])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
const useCart=()=>useContext(CartContext)

function Header(){
  const {count,setOpen}=useCart();const {lang,t,toggle}=useLangText()
  return <>
    <div className="promo-bar">{t('announcement')}</div>
    <header className="site-header">
      <div className="shell flex items-center justify-between h-[68px]">
        <Link to="/" className="logo">DIOR</Link>
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-[.12em] uppercase">{['shop','collections','about'].map(k=><a key={k} href={k==='shop'?'#shop':k==='collections'?'#collections':'#about'} className="nav-link">{t(k)}</a>)}</nav>
        <div className="flex items-center gap-3">{['en','ar'].map(l=><button key={l} onClick={()=>{if(lang!==l)toggle()}} className={`lang-btn ${lang===l?'active':''}`}>{l.toUpperCase()}</button>)}<button onClick={()=>setOpen(true)} className="cart-btn"><ShoppingBag size={20}/>{count>0&&<span>{count}</span>}</button></div>
      </div>
    </header>
  </>
}

function Hero(){
  const {t}=useLangText()
  return <section className="hero"><div className="shell hero-grid">
    <div className="hero-copy"><p className="brand-tag">{t('heroKicker')}</p><h1>{t('heroTitle')}</h1><p className="hero-body">{t('heroBody')}</p><div className="flex gap-3 mt-8"><Link to="#shop" className="btn-primary">{t('cta')}</Link><a href={socials.instagram} target="_blank" className="btn-outline">{t('dm')}</a></div></div>
    <div className="hero-visual"><div className="hero-bottle"><span className="hero-badge">NEW</span><div className="bottle-art"><div className="bottle-glow"/><div className="bottle-glass"><div className="bottle-label"><small>DIOR</small><b>SAUVAGE</b><span>EAU DE PARFUM</span></div></div></div></div></div>
  </div>
  <div className="hero-strip"><span>{t('proof1')}</span><span>{t('proof2')}</span><span>{t('proof3')}</span></div></section>
}

function ProductCard({product,i=0}){
  const {add}=useCart();const {isAr}=useLangText()
  const base=product.price;const sizesPrices=sizes.map(s=>({label:s,price:Math.round(base*(sizeBaseMap[s]||.6))}))
  const [sel,setSel]=useState(0)
  return <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:i*.06}} className="product-card">
    <Link to={`/product/${product.id}`} className="card-visual"><div className="card-bottle"><div className="bottle-glass sm"><div className="bottle-label"><small>DIOR</small><b>{product.name.split(' ')[0]}</b></div></div></div></Link>
    <div className="p-5"><Link to={`/product/${product.id}`}><p className="text-[11px] tracking-[.15em] font-semibold text-neutral-500 uppercase">{product.brand}</p><h3 className="text-[17px] font-bold mt-1 leading-tight">{isAr?product.arName:product.name}</h3><p className="text-[13px] text-neutral-500 mt-1">{product.family}</p></Link>
    <div className="flex gap-1.5 mt-3">{sizes.map((s,j)=><button key={s} onClick={()=>setSel(j)} className={`size-pill ${sel===j?'active':''}`}>{s.replace('ML','')}<small>{'ml'}</small></button>)}</div>
    <button onClick={()=>add(product,sizes[sel])} className="btn-primary w-full mt-4">{money(sizesPrices[sel].price)}</button></div>
  </motion.div>
}

function ProductRail({title,cta,items=products}){
  const {t}=useLangText()
  return <section id="shop" className="py-16 md:py-24"><div className="shell"><div className="flex items-end justify-between mb-10"><div><p className="text-[11px] tracking-[.2em] font-semibold text-neutral-400 uppercase">Maison Dior Fragrances</p><h2 className="section-title">{title}</h2></div><Link to={`/product/${items[0].id}`} className="text-sm font-medium underline underline-offset-4">{cta}</Link></div></div>
  <div className="shell"><div className="grid md:grid-cols-3 gap-6">{items.map((p,i)=><ProductCard key={p.id} product={p} i={i}/>)}</div></div></section>
}

function CollectionCard({col}){
  const {isAr}=useLangText();const p=getProduct(col.items[0])
  return <Link to={`/product/${p.id}`} className="collection-card"><div className="collection-bottle"><div className="bottle-glass sm"><div className="bottle-label"><small>DIOR</small><b>{p.name.split(' ')[0]}</b></div></div></div><div className="p-6"><p className="text-[11px] tracking-[.15em] text-neutral-400 uppercase">{col.copy}</p><h3 className="text-[22px] font-bold mt-1">{isAr?col.ar:col.title}</h3></div></Link>
}

function Home(){
  const {t,isAr}=useLangText()
  return <main><Hero/>
    <ProductRail title={t('best')} cta={t('bestCta')} items={products.filter(p=>p.id!=='sauvage-elixir').slice(0,6)}/>
    <section id="about" className="py-16 md:py-24 bg-[#f8f8f8]"><div className="shell grid md:grid-cols-2 gap-12 items-center"><div><p className="text-[11px] tracking-[.2em] font-semibold text-neutral-400 uppercase">Maison Dior</p><h2 className="text-[38px] md:text-[56px] font-bold leading-[.92] tracking-[-.03em]">{isAr?'فن العطور الفرنسي':'The Art of French Perfumery'}</h2></div><div className="space-y-5 text-[15px] leading-7 text-neutral-600"><p>{isAr?'منذ عام 1947، تجسد ديور فن العطور الفرنسي بأرقى مستوياته. كل عطر يُخلق كتحفة فنية.':'Since 1947, Dior has embodied the pinnacle of French perfumery. Each fragrance is created as a work of art.'}</p><p>{isAr?'نقدم تشكيلة من عطور ديور الأصلية – سافاج، مس ديور، جادور، فهرنهايت – مع خدمة التوصيل المجاني في الإمارات.':'We present a curated selection of original Dior fragrances — Sauvage, Miss Dior, J\'adore, Fahrenheit — with complimentary delivery across the UAE.'}</p></div></div></section>
    <section id="collections" className="py-16 md:py-24"><div className="shell"><h2 className="section-title mb-8">{t('collections')}</h2></div>
    <div className="shell"><div className="grid md:grid-cols-3 gap-6">{collections.map(col=><CollectionCard key={col.id} col={col}/>)}</div></div></section>
    <section className="py-16 md:py-24 bg-[#f8f8f8]"><div className="shell grid md:grid-cols-3 gap-8"><div className="service-card"><Truck size={22}/><h3>{t('original')}</h3><p>{t('originalBody')}</p></div><div className="service-card"><ShieldCheck size={22}/><h3>{t('sizes')}</h3><p>{t('sizesBody')}</p></div><div className="service-card"><Sparkles size={22}/><h3>{t('delivery')}</h3><p>{t('deliveryBody')}</p></div></div></section>
  </main>
}

function ProductPage(){
  const {id}=useParams();const product=getProduct(id);const {add}=useCart();const {t,isAr}=useLangText()
  const [sel,setSel]=useState(0);const [qty,setQty]=useState(1);const [open,setOpen]=useState('Description')
  const price=Math.round(product.price*(sizeBaseMap[sizes[sel]]||.6))
  useEffect(()=>{document.title=`${product.name} | Dior Fragrances`},[product])
  return <main className="pt-4 md:pt-8">
    <section className="shell pb-8"><nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/#shop">Fragrances</Link><span>/</span><span className="text-neutral-900">{product.name}</span></nav></section>
    <section className="shell"><div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 md:gap-14 items-start">
      <div className="product-visual"><div className="product-bottle-wrap"><div className="bottle-glass lg"><div className="bottle-label"><small>DIOR</small><b>{product.name.split(' ')[0]}</b><span>{product.family.toUpperCase()}</span></div></div><div className="size-indicator"><p className="text-[11px] tracking-[.12em] font-semibold uppercase">{sizes[sel]}</p><p className="text-[13px] text-neutral-500">{money(price)}</p></div></div>
      <div className="product-thumbs">{products.slice(0,5).map(p=><Link key={p.id} to={`/product/${p.id}`} className={`thumb ${p.id===product.id?'active':''}`}><div className="bottle-glass xs"><div className="bottle-label"><small>DIOR</small><b>{p.name.split(' ')[0]}</b></div></div></Link>)}</div></div>
      <div className="product-info"><h1>{isAr?product.arName:product.name}</h1><p className="text-[13px] tracking-[.15em] font-semibold text-neutral-500 uppercase mt-2">{product.brand} · {product.family}</p><div className="flex items-center gap-2 mt-4"><span className="text-[15px] tracking-tight">★★★★★</span><span className="text-[13px] text-neutral-500">4.9 · 65 {isAr?'تقييم':'reviews'}</span></div>
      <p className="mt-6 text-[15px] leading-7 text-neutral-600">{isAr?product.arStory:product.story}</p>
      <p className="mt-3 text-[13px] italic text-neutral-500">{product.campaign}</p>
      <div className="mt-8"><p className="text-[13px] tracking-[.12em] font-semibold uppercase mb-3">{t('size')}</p><div className="grid grid-cols-3 gap-3">{sizes.map((s,i)=><button key={s} onClick={()=>setSel(i)} className={`size-opt ${sel===i?'active':''}`}>{s}<small>{money(Math.round(product.price*(sizeBaseMap[s]||.6)))}</small></button>)}</div></div>
      <div className="mt-8 flex items-center gap-3"><div className="qty"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={14}/></button><span>{qty}</span><button onClick={()=>setQty(qty+1)}><Plus size={14}/></button></div><motion.button whileTap={{scale:.97}} onClick={()=>add(product,sizes[sel],qty)} className="btn-primary flex-1 h-[52px]">{t('add')} · {money(price*qty)}</motion.button></div>
      <div className="mt-6 grid grid-cols-3 gap-2">{['Complimentary Delivery','Free Samples','4H Dubai'].map(s=><div key={s} className="service-pill"><Truck size={13}/><span>{s}</span></div>)}</div>
      <div className="mt-8 border-t border-neutral-200">{[[t('description'),product.story],[t('notes'),product.notes.join(' · ')],[t('authenticity'),'Every Dior fragrance is crafted with the finest ingredients. Our bottles are refillable through Dior\'s sustainable development initiative, reducing waste and preserving the art of perfumery.']].map(([n,b])=><Accordion key={n} name={n} open={open} setOpen={setOpen}>{b}</Accordion>)}</div>
    </div></div></section>
    <ProductRail title={t('related')} cta={t('bestCta')} items={products.filter(p=>p.id!==product.id)}/>
  </main>
}

function Accordion({name,open,setOpen,children}){
  const active=open===name
  return <div className="border-b border-neutral-200"><button onClick={()=>setOpen(active?'':name)} className="w-full py-5 flex items-center justify-between text-start font-semibold text-[14px]"><span>{name}</span><ChevronDown size={16} className={`transition ${active?'rotate-180':''}`}/></button><AnimatePresence>{active&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden pb-5 text-[14px] leading-7 text-neutral-500">{children}</motion.p>}</AnimatePresence></div>
}

function CartDrawer(){
  const {open,setOpen,items,update,remove,subtotal}=useCart();const {t,isAr}=useLangText();const navigate=useNavigate()
  const freeAt=300;const left=Math.max(0,freeAt-subtotal)
  return <AnimatePresence>{open&&<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} className="fixed inset-0 bg-black/40 z-50"/><motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:260}} className="cart-drawer"><div className="h-16 px-6 flex items-center justify-between border-b border-neutral-200"><h2 className="text-lg font-bold">{t('cart')}</h2><button onClick={()=>setOpen(false)}><X/></button></div>{items.length===0?<div className="flex-1 grid place-items-center text-center px-8"><div><ShoppingBag className="mx-auto mb-4 text-neutral-300"/><p className="text-neutral-500">{t('empty')}</p><Link onClick={()=>setOpen(false)} to="/" className="btn-primary px-10 mt-7">{t('keep')}</Link></div></div>:<><div className="px-6 pt-4 pb-2"><div className={`shipping-card ${left===0?'done':''}`}><span>{left===0?t('free'):`${t('addFree')} ${money(left)} ${t('forFree')}`}</span><div><span style={{width:`${Math.min(100,subtotal/freeAt*100)}%`}}/></div></div></div><div className="flex-1 overflow-auto px-6 space-y-4">{items.map(item=><div key={item.id+item.size} className="grid grid-cols-[72px_1fr] gap-4 border-b border-neutral-100 pb-4"><div className="cart-thumb"><div className="bottle-glass xs"><div className="bottle-label"><small>DIOR</small><b>{item.name.split(' ')[0]}</b></div></div></div><div><div className="flex justify-between"><div><h3 className="text-sm font-semibold">{isAr?item.arName:item.name}</h3><p className="text-xs text-neutral-500">{item.brand} · {item.size}</p></div><button onClick={()=>remove(item.id,item.size)}><X size={15}/></button></div><div className="flex items-center justify-between mt-3"><div className="qty sm"><button onClick={()=>update(item.id,item.size,item.qty-1)}><Minus size={12}/></button><span>{item.qty}</span><button onClick={()=>update(item.id,item.size,item.qty+1)}><Plus size={12}/></button></div><span className="font-semibold">{money(item.price*item.qty)}</span></div></div></div>)}</div><div className="p-6 border-t border-neutral-200"><div className="flex justify-between mb-4"><span className="text-sm">{t('subtotal')}</span><span className="font-bold">{money(subtotal)}</span></div><button onClick={()=>{setOpen(false);navigate('/checkout')}} className="btn-primary w-full h-[50px]">{t('checkout')}</button></div></>}</motion.aside></>}</AnimatePresence>
}

function Checkout(){
  const {items,subtotal,clear}=useCart();const {t,isAr}=useLangText();const [done,setDone]=useState(false);const shipping=subtotal===0||subtotal>=300?0:20
  if(done)return<main className="min-h-[70vh] py-20 grid place-items-center text-center shell"><div><div className="w-16 h-16 rounded-full bg-neutral-900 text-white grid place-items-center mx-auto mb-6"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div><h1 className="text-3xl font-bold">{t('confirmed')}</h1><p className="mt-4 text-neutral-500 max-w-md">{t('confirmedBody')}</p><Link to="/" onClick={clear} className="btn-primary px-12 mt-8">{t('keep')}</Link></div></main>
  return<main className="py-8 md:py-16 shell"><h1 className="text-2xl font-bold mb-8">{t('checkout')}</h1><div className="grid lg:grid-cols-[1fr_380px] gap-8"><form onSubmit={e=>{e.preventDefault();setDone(true)}} className="space-y-8"><section><h2 className="text-[13px] tracking-[.15em] font-semibold uppercase mb-4">{t('contact')}</h2><div className="grid md:grid-cols-2 gap-4">{['First name','Last name','Email','Phone'].map(l=><label key={l} className="input-label"><span>{l}</span><input required type={l==='Email'?'email':'text'}/></label>)}</div></section><section><h2 className="text-[13px] tracking-[.15em] font-semibold uppercase mb-4">{t('deliveryForm')}</h2><div className="grid gap-4"><label className="input-label"><span>Address</span><input required/></label><div className="grid md:grid-cols-3 gap-4">{['City','Emirate','Country'].map(l=><label key={l} className="input-label"><span>{l}</span><input required defaultValue={l==='Country'?'United Arab Emirates':''}/></label>)}</div></div></section><section><h2 className="text-[13px] tracking-[.15em] font-semibold uppercase mb-4">{t('payment')}</h2><div className="grid gap-2">{['Credit Card','Tabby / Tamara','Cash on Delivery'].map(p=><label key={p} className="pay-row"><input type="radio" name="pay" defaultChecked={p==='Credit Card'}/><span>{p}</span></label>)}</div></section><button className="btn-primary h-[52px] w-full md:w-[300px]">{t('place')} · {money(subtotal+shipping)}</button></form>
  <aside className="summary"><h2 className="text-[13px] tracking-[.15em] font-semibold uppercase mb-4">{t('orderSummary')}</h2>{items.length===0?<p className="text-sm text-neutral-500">{t('empty')}</p>:items.map(item=><div key={item.id+item.size} className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-4"><div className="cart-thumb small"><div className="bottle-glass xs"><div className="bottle-label"><small>DIOR</small><b>{item.name.split(' ')[0]}</b></div></div></div><div className="flex-1"><p className="text-sm font-semibold">{isAr?item.arName:item.name}</p><p className="text-xs text-neutral-500">Qty {item.qty} · {item.size}</p></div><span className="font-semibold">{money(item.price*item.qty)}</span></div>)}<div className="space-y-2 text-sm pt-4 border-t border-neutral-200"><div className="flex justify-between"><span>{t('subtotal')}</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-neutral-500"><span>Shipping</span><span>{shipping===0?'Complimentary':money(shipping)}</span></div><div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>{money(subtotal+shipping)}</span></div></div></aside></div></main>
}

function Footer(){
  const {isAr}=useLangText()
  return <footer className="site-footer"><div className="shell footer-grid"><div><Link to="/" className="logo">DIOR</Link><p className="footer-desc">{isAr?'عطور ديور الأصلية في الإمارات. توصيل مجاني، عينات مجانية، وهدية ديور مع كل طلب.':'Original Dior fragrances in the UAE. Complimentary delivery, free samples, and the iconic Dior gift box with every order.'}</p></div>
  {[['Fragrances',['Sauvage','Miss Dior','J\'adore','Fahrenheit']],['Services',['Complimentary Delivery','Free Samples','Art of Gifting','Engraving']],['Support',['Contact Us','FAQ','Returns','Track Order']]].map(([t,links])=><div key={t} className="footer-col"><h3>{t}</h3>{links.map(l=><Link key={l} to="/">{l}</Link>)}</div>)}</div>
  <div className="shell footer-btm"><span>© 2026 Niche Center Perfumes AE</span><span>UAE · English</span></div></footer>
}

function Shell(){
  const location=useLocation()
  useEffect(()=>window.scrollTo(0,0),[location.pathname])
  return <><Header/><CartDrawer/><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes></motion.div></AnimatePresence><Footer/></>
}

export default function App(){return <LangProvider><CartProvider><Shell/></CartProvider></LangProvider>}
