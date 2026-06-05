import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, CheckCircle2, Globe2, Minus, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, X } from 'lucide-react'

const socials = {
  instagram: 'https://www.instagram.com/niche_center/',
  threads: 'https://www.threads.com/@niche_center',
  facebook: 'https://www.facebook.com/788495237682966?ref=NONE_xav_ig_profile_page_web',
}

const sizeOptions = [
  { label: '2ML', multiplier: 0.45 },
  { label: '3ML', multiplier: 0.62 },
  { label: '5ML', multiplier: 1 },
  { label: '10ML', multiplier: 1.82 },
  { label: '30ML', multiplier: 4.95 },
]

const products = [
  {
    id: 'xerjoff-naxos', brand: 'Xerjoff', name: 'Naxos Decant', arName: 'تقسيمة ناكسوس', family: 'Honey Tobacco', price: 72, badge: 'Best seller',
    color: '#d7b36a', color2: '#fff4c9', accent: '#173d2f', notes: ['Honey', 'Tobacco', 'Lavender', 'Tonka', 'Citrus', 'Vanilla'],
    story: 'A rich Italian niche icon with honeyed tobacco, citrus brightness and a smooth vanilla-tonka trail.',
    arStory: 'أيقونة نيش إيطالية غنية بالعسل والتبغ ولمسة حمضيات وفانيلا ناعمة.',
  },
  {
    id: 'amouage-guidance', brand: 'Amouage', name: 'Guidance Decant', arName: 'تقسيمة غايدنس', family: 'Creamy Amber Floral', price: 88, badge: 'Luxury pick',
    color: '#e9b7a7', color2: '#fff0e4', accent: '#5d332b', notes: ['Pear', 'Hazelnut', 'Saffron', 'Rose', 'Sandalwood', 'Ambergris'],
    story: 'A statement scent for elegant evenings: creamy, textured, long-lasting and unmistakably premium.',
    arStory: 'عطر حضور للمناسبات: كريمي، فاخر، ثابت، ويترك بصمة واضحة.',
  },
  {
    id: 'byredo-gypsy-water', brand: 'Byredo', name: 'Gypsy Water Decant', arName: 'تقسيمة جيبسي ووتر', family: 'Fresh Woody', price: 58, badge: 'Clean luxury',
    color: '#e8dfc8', color2: '#ffffff', accent: '#2f3427', notes: ['Bergamot', 'Juniper', 'Incense', 'Pine Needle', 'Sandalwood', 'Vanilla'],
    story: 'Fresh, woody and easy to wear — the kind of niche scent that works every day in UAE weather.',
    arStory: 'فريش وخشبي وسهل الاستخدام اليومي، مناسب لأجواء الإمارات.',
  },
  {
    id: 'nishane-hacivat', brand: 'Nishane', name: 'Hacivat Decant', arName: 'تقسيمة هاجيفات', family: 'Pineapple Oakmoss', price: 76, badge: 'Strong sillage',
    color: '#c7df9a', color2: '#f6ffd7', accent: '#354626', notes: ['Pineapple', 'Grapefruit', 'Bergamot', 'Cedarwood', 'Patchouli', 'Oakmoss'],
    story: 'Bright fruit, clean woods and huge projection — a confident signature scent sample.',
    arStory: 'فاكهة مشرقة وخشب نظيف وفوحان قوي لمن يريد عطراً مميزاً.',
  },
  {
    id: 'diptyque-philosykos', brand: 'Diptyque', name: 'Philosykos Decant', arName: 'تقسيمة فيلوسيكوس', family: 'Green Fig', price: 52, badge: 'Summer ready',
    color: '#89a36a', color2: '#ecf6de', accent: '#314022', notes: ['Fig Leaf', 'Fig', 'Coconut', 'Green Notes', 'Cedar', 'Wood'],
    story: 'A calm green fig fragrance for daytime, office wear and quiet luxury styling.',
    arStory: 'رائحة تين خضراء وهادئة تناسب النهار والعمل والفخامة البسيطة.',
  },
  {
    id: 'frederic-malle-portrait', brand: 'Frederic Malle', name: 'Portrait Decant', arName: 'تقسيمة بورتريه', family: 'Rose Patchouli', price: 92, badge: 'Iconic rose',
    color: '#9d172a', color2: '#ffc0c9', accent: '#411018', notes: ['Rose', 'Blackcurrant', 'Raspberry', 'Clove', 'Patchouli', 'Incense'],
    story: 'A bold niche rose with depth, spice and power — made for evenings and formal presence.',
    arStory: 'ورد نيش جريء وعميق مع بهارات وفخامة، مثالي للمساء والمناسبات.',
  },
  {
    id: 'sospiro-vibrato', brand: 'Sospiro', name: 'Vibrato Decant', arName: 'تقسيمة فيبراتو', family: 'Citrus Aromatic', price: 64, badge: 'Fresh hit',
    color: '#64b4d4', color2: '#dff8ff', accent: '#123d4a', notes: ['Grapefruit', 'Bergamot', 'Magnolia', 'Ginger', 'Cedar', 'Musk'],
    story: 'Sparkling, fresh and refined with a polished citrus-musky drydown.',
    arStory: 'فريش لامع وراقي مع حمضيات ومسك نظيف في القاعدة.',
  },
  {
    id: 'discovery-wardrobe', brand: 'Niche Center', name: 'Signature Discovery Set', arName: 'مجموعة التجربة', family: 'Choose 8 x 2ML', price: 145, badge: 'Try first', set: true,
    color: '#173d2f', color2: '#d7b36a', accent: '#173d2f', notes: ['8 Decants', 'Original Bottles', 'Travel Ready', 'Gift Box', 'UAE Delivery', 'No Copies'],
    story: 'Build a personal niche wardrobe before investing in full bottles. Perfect as a gift or first order.',
    arStory: 'جرّب عدة عطور نيش أصلية قبل شراء الزجاجة الكاملة. مناسب كهدية أو أول طلب.',
  },
]

const collections = [
  { id: 'best', title: 'Best Sellers', ar: 'الأكثر طلباً', copy: 'Customer favourites from 3000+ UAE orders.', items: ['xerjoff-naxos', 'amouage-guidance', 'nishane-hacivat'] },
  { id: 'fresh', title: 'Fresh UAE Weather', ar: 'فريش لأجواء الإمارات', copy: 'Clean, citrus, fig and musky profiles for daily wear.', items: ['byredo-gypsy-water', 'diptyque-philosykos', 'sospiro-vibrato'] },
  { id: 'luxury', title: 'Luxury Icons', ar: 'أيقونات فاخرة', copy: 'Premium niche houses in smart decant sizes.', items: ['frederic-malle-portrait', 'amouage-guidance', 'xerjoff-naxos'] },
]

const copy = {
  en: {
    announcement: 'Luxury original niche decants · UAE delivery · No copies, no oils',
    shop: 'Shop', collections: 'Collections', process: 'Decant Process', about: 'About',
    heroKicker: 'Niche Center Perfumes AE', heroTitle: 'Original niche perfumes, in smarter sizes.',
    heroBody: 'Try Xerjoff, Amouage, Byredo, Diptyque and more before buying the full bottle. Premium decants from original retail bottles.',
    cta: 'Shop Decants', dm: 'Order on Instagram',
    proof1: '+3000 happy UAE customers', proof2: '2ml · 3ml · 5ml · 10ml · 30ml', proof3: 'Retail bottles · partials · decants',
    best: 'Featured Decants', bestCta: 'View all', whyTitle: 'Why decants?', whyBody: 'Blind-buying niche fragrance is expensive. Niche Center gives customers a cleaner way to test longevity, sillage and skin chemistry before committing to a full bottle.',
    original: '100% Original', originalBody: 'Transferred directly from retail bottles — no copies, no inspired oils, no mixing.',
    sizes: 'Smart Sizes', sizesBody: 'Choose 2ml to 30ml for discovery, travel, office, gifting or daily use.',
    delivery: 'UAE + GCC Delivery', deliveryBody: 'Built for UAE customers with fast delivery messaging and easy Instagram support.',
    add: 'Add to bag', size: 'Size', notes: 'Notes', description: 'Description', authenticity: 'Authenticity', related: 'You may also like',
    cart: 'Cart', empty: 'Your bag is empty.', subtotal: 'Subtotal', checkout: 'Checkout', keep: 'Keep shopping', free: 'Free delivery unlocked', addFree: 'Add', forFree: 'for free UAE delivery',
    contact: 'Contact', deliveryForm: 'Delivery', payment: 'Payment', place: 'Place order', orderSummary: 'Order summary', confirmed: 'Order confirmed', confirmedBody: 'Demo order ready. For the real business this can connect to WhatsApp, Stripe, WooCommerce or Shopify later.',
  },
  ar: {
    announcement: 'تقسيمات عطور نيش أصلية · توصيل الإمارات · بدون كوبي أو زيوت تركيب',
    shop: 'تسوق', collections: 'المجموعات', process: 'طريقة التقسيم', about: 'عن المتجر',
    heroKicker: 'نيش سنتر للعطور', heroTitle: 'عطور نيش أصلية بأحجام ذكية.',
    heroBody: 'جرّب Xerjoff و Amouage و Byredo و Diptyque قبل شراء الزجاجة الكاملة. تقسيمات فاخرة من الزجاجات الأصلية مباشرة.',
    cta: 'تسوق التقسيمات', dm: 'اطلب عبر إنستغرام',
    proof1: '+3000 عميل سعيد في الإمارات', proof2: '2مل · 3مل · 5مل · 10مل · 30مل', proof3: 'زجاجات أصلية · جزئيات · تقسيمات',
    best: 'تقسيمات مختارة', bestCta: 'عرض الكل', whyTitle: 'لماذا التقسيمات؟', whyBody: 'شراء عطر نيش كامل بدون تجربة مخاطرة مكلفة. نيش سنتر يساعد العميل على اختبار الثبات والفوحان وكيمياء البشرة قبل شراء الزجاجة.',
    original: 'أصلي 100%', originalBody: 'مسحوب مباشرة من الزجاجة الأصلية — بدون كوبي، بدون بدائل، بدون تركيب.',
    sizes: 'أحجام ذكية', sizesBody: 'اختر من 2مل إلى 30مل للتجربة، السفر، العمل، الهدايا أو الاستخدام اليومي.',
    delivery: 'توصيل الإمارات والخليج', deliveryBody: 'مصمم لعملاء الإمارات مع رسالة توصيل واضحة ودعم سهل عبر إنستغرام.',
    add: 'أضف للسلة', size: 'الحجم', notes: 'النوتات', description: 'الوصف', authenticity: 'الأصالة', related: 'منتجات مقترحة',
    cart: 'السلة', empty: 'السلة فارغة.', subtotal: 'المجموع', checkout: 'الدفع', keep: 'تابع التسوق', free: 'تم تفعيل التوصيل المجاني', addFree: 'أضف', forFree: 'للتوصيل المجاني داخل الإمارات',
    contact: 'بيانات التواصل', deliveryForm: 'التوصيل', payment: 'الدفع', place: 'تأكيد الطلب', orderSummary: 'ملخص الطلب', confirmed: 'تم تأكيد الطلب', confirmedBody: 'طلب تجريبي جاهز. لاحقاً يمكن ربط الموقع بواتساب، Stripe، WooCommerce أو Shopify.',
  }
}

const money = n => `AED ${Math.round(n).toLocaleString()}`
const getProduct = id => products.find(p => p.id === id) || products[0]
function InstagramIcon({ size=18 }){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/></svg>
}
const useLangText = () => useContext(LangContext)

const LangContext = createContext(null)
function LangProvider({ children }){
  const [lang,setLang] = useState(() => localStorage.getItem('niche-center-lang') || 'en')
  useEffect(() => {
    localStorage.setItem('niche-center-lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])
  const value = useMemo(() => ({ lang, isAr: lang === 'ar', toggle: () => setLang(x => x === 'ar' ? 'en' : 'ar'), t: key => copy[lang][key] || copy.en[key] || key }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

const CartContext = createContext(null)
function CartProvider({ children }){
  const [items,setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('niche-center-cart') || '[]') } catch { return [] } })
  const [open,setOpen] = useState(false)
  useEffect(() => localStorage.setItem('niche-center-cart', JSON.stringify(items)), [items])
  const add = (product, sizeLabel='5ML', qty=1) => {
    const opt = sizeOptions.find(x => x.label === sizeLabel) || sizeOptions[2]
    const price = Math.round(product.price * opt.multiplier)
    setItems(prev => {
      const hit = prev.find(x => x.id === product.id && x.size === sizeLabel)
      if(hit) return prev.map(x => x.id === product.id && x.size === sizeLabel ? { ...x, qty: x.qty + qty } : x)
      return [...prev, { id: product.id, name: product.name, arName: product.arName, brand: product.brand, family: product.family, color: product.color, color2: product.color2, set: product.set, size: sizeLabel, price, qty }]
    })
    setOpen(true)
  }
  const update = (id,size,qty) => setItems(prev => prev.map(x => x.id === id && x.size === size ? { ...x, qty: Math.max(1, qty) } : x))
  const remove = (id,size) => setItems(prev => prev.filter(x => !(x.id === id && x.size === size)))
  const clear = () => setItems([])
  const subtotal = items.reduce((sum,x) => sum + x.price * x.qty, 0)
  const count = items.reduce((sum,x) => sum + x.qty, 0)
  const value = useMemo(() => ({ items, open, setOpen, add, update, remove, clear, subtotal, count }), [items, open, subtotal, count])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
const useCart = () => useContext(CartContext)

function ProductName({ product, className='' }){
  const { isAr } = useLangText()
  return <span className={className}>{isAr ? product.arName : product.name}</span>
}

function VialArt({ product, small=false }){
  if(product?.set) return <div className={`set-box ${small ? 'set-box-small' : ''}`}><div className="set-logo">NICHE<br/>CENTER</div><div className="grid grid-cols-4 gap-1.5 w-[70%]">{products.slice(0,8).map(p => <i key={p.id} style={{ background:`linear-gradient(180deg,${p.color2},${p.color})` }} />)}</div><span>DISCOVERY SET</span></div>
  return <div className={`vial ${small ? 'vial-small' : ''}`} style={{ '--juice': product?.color || '#d7b36a', '--juice2': product?.color2 || '#fff4c9' }}><span>{product?.brand || 'NICHE'}</span><b>{product?.name?.split(' ')[0] || 'CENTER'}</b></div>
}

function BrandMark(){
  return <Link to="/" className="brand-mark" aria-label="Niche Center home"><span className="brand-seal">NC</span><span><b>NICHE CENTER</b><small>Perfumes AE</small></span></Link>
}

function Header(){
  const { count,setOpen } = useCart()
  const { lang,t,toggle } = useLangText()
  return <>
    <div className="promo-bar">{t('announcement')}</div>
    <header className="site-header">
      <div className="section-shell h-[66px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 min-w-0"><BrandMark/><nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold"><a href="#shop">{t('shop')}</a><a href="#collections">{t('collections')}</a><a href="#process">{t('process')}</a><a href="#about">{t('about')}</a></nav></div>
        <div className="flex items-center gap-2 md:gap-4"><a className="icon-pill hidden sm:inline-flex" href={socials.instagram} target="_blank" rel="noreferrer"><InstagramIcon size={17}/> Instagram</a><button className="icon-pill" onClick={toggle}><Globe2 size={16}/>{lang === 'ar' ? 'EN' : 'AR'}</button><Search size={21} className="hidden md:block"/><button onClick={() => setOpen(true)} className="cart-button" aria-label="Open cart"><ShoppingBag size={24}/>{count > 0 && <span>{count}</span>}</button></div>
      </div>
    </header>
  </>
}

function Hero(){
  const { t,isAr } = useLangText()
  return <section className="hero-wrap">
    <div className="hero-card">
      <div className="hero-glow" />
      <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55 }} className="hero-copy">
        <p className="mono text-gold">{t('heroKicker')}</p>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroBody')}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8"><Link to="#shop" className="gold-btn">{t('cta')}</Link><a href={socials.instagram} target="_blank" rel="noreferrer" className="ghost-btn">{t('dm')}</a></div>
      </motion.div>
      <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.7, delay:.1 }} className="hero-products">
        <div className="big-card"><VialArt product={products[1]}/></div>
        <div className="big-card lifted"><VialArt product={products[0]}/></div>
        <div className="big-card"><VialArt product={products[7]}/></div>
      </motion.div>
      <div className="hero-proof"><span>{t('proof1')}</span><span>{t('proof2')}</span><span>{t('proof3')}</span></div>
      <span className={`arabic-stamp ${isAr ? 'opacity-100' : 'opacity-80'}`}>عطور نيش أصلية</span>
    </div>
  </section>
}

function ProductCard({ product, i=0 }){
  const { add } = useCart()
  const { isAr,t } = useLangText()
  return <motion.article initial={{ opacity:1, y:0 }} animate={{ opacity:1, y:0 }} transition={{ duration:.38, delay:i*.04 }} className="product-card">
    <Link to={`/product/${product.id}`} className="product-image"><span className="label">{product.badge}</span><VialArt product={product}/></Link>
    <Link to={`/product/${product.id}`} className="block pt-4"><p className="mono text-[10px] text-neutral-500">{product.brand}</p><h3 className="mt-1 text-[18px] font-black tracking-[.02em]"><ProductName product={product}/></h3><p className="mt-2 text-[14px] text-neutral-600">{product.family}</p></Link>
    <button onClick={() => add(product)} className="outline-btn w-full mt-5">{t('add')} <span>·</span> {money(product.price)} <small>{isAr ? '5مل' : '5ML'}</small></button>
  </motion.article>
}

function ProductRail({ title, cta, items=products }){
  return <section id="shop" className="section-shell py-14 md:py-20"><div className="flex items-end justify-between gap-5 mb-7"><div><p className="mono text-[10px] text-gold">Niche perfume decants</p><h2 className="section-title">{title}</h2></div><Link to={`/product/${items[0].id}`} className="text-sm underline underline-offset-4">{cta}</Link></div><div className="grid grid-flow-col auto-cols-[78%] sm:auto-cols-[43%] lg:auto-cols-[24%] gap-4 md:gap-5 overflow-x-auto pb-3 snap-x">{items.map((p,i) => <div key={p.id} className="snap-start"><ProductCard product={p} i={i}/></div>)}</div></section>
}

function TrustCard({ icon:Icon, title, body }){
  return <div className="trust-card"><Icon size={24}/><h3>{title}</h3><p>{body}</p></div>
}

function Home(){
  const { t,isAr } = useLangText()
  return <main>
    <Hero/>
    <ProductRail title={t('best')} cta={t('bestCta')} items={products}/>
    <section id="process" className="section-shell py-10 md:py-20"><div className="story-panel"><div><p className="mono text-gold">{isAr ? 'طريقة أذكى لاختيار عطرك' : 'A smarter fragrance purchase'}</p><h2>{t('whyTitle')}</h2><p>{t('whyBody')}</p></div><div className="grid md:grid-cols-3 gap-4"><TrustCard icon={ShieldCheck} title={t('original')} body={t('originalBody')}/><TrustCard icon={Sparkles} title={t('sizes')} body={t('sizesBody')}/><TrustCard icon={Truck} title={t('delivery')} body={t('deliveryBody')}/></div></div></section>
    <section id="collections" className="section-shell py-12 md:py-20"><div className="flex items-end justify-between mb-7"><h2 className="section-title">{t('collections')}</h2><span className="mono text-[10px] text-neutral-500">Xerjoff · Amouage · Byredo · Diptyque</span></div><div className="grid md:grid-cols-3 gap-5">{collections.map(col => <CollectionCard key={col.id} col={col}/>)}</div></section>
    <section id="about" className="section-shell pb-16 md:pb-24"><div className="about-strip"><div><p className="mono text-gold">No copies. No blind buy risk.</p><h2>{isAr ? 'متجر مبني حول الثقة، التجربة، والأصالة.' : 'A store built around trust, sampling and authenticity.'}</h2></div><p>{isAr ? 'التصميم يعطي العميل إحساس بوتيك فاخر: مجموعات حسب البراند، أحجام واضحة، سعر بالدرهم، ورسالة قوية أن العطر أصلي ومسحوب من الزجاجة الأصلية.' : 'The website positions Niche Center as a premium UAE fragrance boutique: brand-led collections, clear decant sizes, AED pricing, and strong “original only” confidence.'}</p></div></section>
  </main>
}

function CollectionCard({ col }){
  const { isAr } = useLangText()
  const p = getProduct(col.items[0])
  return <Link to={`/product/${p.id}`} className="collection-card"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(215,179,106,.32),transparent_46%)]"/><VialArt product={p}/><div className="relative z-10 mt-auto"><p className="mono text-[10px] text-gold">{col.copy}</p><h3>{isAr ? col.ar : col.title}</h3></div></Link>
}

function ProductPage(){
  const { id } = useParams()
  const product = getProduct(id)
  const { add } = useCart()
  const { t,isAr } = useLangText()
  const [size,setSize] = useState('5ML')
  const [qty,setQty] = useState(1)
  const [open,setOpen] = useState('Description')
  const price = Math.round(product.price * (sizeOptions.find(x => x.label === size)?.multiplier || 1))
  useEffect(() => { document.title = `${product.name} | Niche Center Perfumes AE` }, [product])
  return <main>
    <section className="section-shell py-4 md:py-10"><nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>{product.brand}</span></nav><div className="grid lg:grid-cols-[1.06fr_.94fr] gap-5 md:gap-10 items-start">
      <div className="product-main-frame"><span className="label">{product.badge}</span><VialArt product={product}/><div className="mini-vials">{products.slice(0,6).map(p => <Link key={p.id} to={`/product/${p.id}`} className={p.id === product.id ? 'active' : ''}><VialArt product={p} small/></Link>)}</div></div>
      <aside className="product-info"><p className="mono text-gold">{product.brand} · Original Decant</p><h1><ProductName product={product}/></h1><div className="flex items-center gap-3 mt-4"><span className="stars">★★★★★</span><span className="text-sm text-neutral-500">4.9 · {isAr ? 'عملاء موثقون' : 'verified buyers'}</span></div><p className="mt-6 text-[16px] leading-8 text-neutral-700">{isAr ? product.arStory : product.story}</p>
        <div className="mt-7"><p className="font-bold mb-3">{t('size')}</p><div className="grid grid-cols-3 sm:grid-cols-5 gap-2">{sizeOptions.map(s => <button key={s.label} onClick={() => setSize(s.label)} className={`size-btn ${size === s.label ? 'active' : ''}`}>{s.label}<small>{money(product.price * s.multiplier)}</small></button>)}</div></div>
        <div className="mt-7 flex items-center gap-3"><div className="qty"><button onClick={() => setQty(Math.max(1, qty-1))}><Minus size={14}/></button><span>{qty}</span><button onClick={() => setQty(qty+1)}><Plus size={14}/></button></div><motion.button whileTap={{ scale:.97 }} onClick={() => add(product, size, qty)} className="black-btn flex-1">{t('add')} · {money(price * qty)}</motion.button></div>
        <div className="mt-6 grid sm:grid-cols-3 gap-3"><div className="mini-trust"><ShieldCheck/>100% Original</div><div className="mini-trust"><Truck/>UAE Delivery</div><div className="mini-trust"><Sparkles/>Premium Decant</div></div>
        <div className="mt-7 border-t border-[#e5ded1]">{[
          [t('description'), isAr ? product.arStory : product.story],
          [t('notes'), product.notes.join(' · ')],
          [t('authenticity'), isAr ? 'كل تقسيمة يتم سحبها من الزجاجة الأصلية مباشرة في عبوات مناسبة للسفر والتجربة.' : 'Every decant is transferred from an original retail bottle into travel-friendly atomizers for sampling and daily use.'],
        ].map(([name,body]) => <Accordion key={name} name={name} open={open} setOpen={setOpen}>{body}</Accordion>)}</div>
      </aside>
    </div></section>
    <ProductRail title={t('related')} cta={t('bestCta')} items={products.filter(p => p.id !== product.id).slice(0,6)}/>
  </main>
}

function Accordion({ name, open, setOpen, children }){
  const active = open === name
  return <div className="border-b border-[#e5ded1]"><button onClick={() => setOpen(active ? '' : name)} className="w-full py-5 flex items-center justify-between text-start font-semibold"><span>{name}</span><ChevronDown className={`transition ${active ? 'rotate-180' : ''}`}/></button><AnimatePresence>{active && <motion.p initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} className="overflow-hidden pb-5 text-[15px] leading-7 text-neutral-600">{children}</motion.p>}</AnimatePresence></div>
}

function CartDrawer(){
  const { open,setOpen,items,update,remove,subtotal } = useCart()
  const { t,isAr } = useLangText()
  const navigate = useNavigate()
  const freeAt = 300
  const left = Math.max(0, freeAt - subtotal)
  return <AnimatePresence>{open && <><motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-black/45 z-50"/><motion.aside initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', damping:28, stiffness:260 }} className="cart-drawer"><div className="h-16 px-5 flex items-center justify-between border-b border-[#e8dfd2]"><h2>{t('cart')}</h2><button onClick={() => setOpen(false)}><X/></button></div>{items.length === 0 ? <div className="flex-1 grid place-items-center text-center px-8"><div><ShoppingBag className="mx-auto mb-4"/><p>{t('empty')}</p><Link onClick={() => setOpen(false)} to="/" className="outline-btn px-10 mt-7">{t('keep')}</Link></div></div> : <><div className="p-5"><div className={`shipping-card ${left === 0 ? 'done' : ''}`}><p>{left === 0 ? t('free') : `${t('addFree')} ${money(left)} ${t('forFree')}`}</p><div><span style={{ width:`${Math.min(100, subtotal / freeAt * 100)}%` }}/></div></div></div><div className="flex-1 overflow-auto px-5 space-y-5">{items.map(item => <div key={item.id + item.size} className="grid grid-cols-[88px_1fr] gap-4 border-b border-[#eee5d8] pb-5"><div className="cart-thumb"><VialArt product={item} small/></div><div><div className="flex justify-between gap-3"><div><h3>{isAr ? item.arName : item.name}</h3><p>{item.brand} · {item.size}</p></div><button onClick={() => remove(item.id,item.size)}><X size={16}/></button></div><div className="flex items-center justify-between mt-5"><div className="qty small"><button onClick={() => update(item.id,item.size,item.qty-1)}><Minus size={13}/></button><span>{item.qty}</span><button onClick={() => update(item.id,item.size,item.qty+1)}><Plus size={13}/></button></div><b>{money(item.price * item.qty)}</b></div></div></div>)}</div><div className="p-5 border-t border-[#e8dfd2]"><div className="flex justify-between mb-4"><span>{t('subtotal')}</span><b>{money(subtotal)}</b></div><button onClick={() => { setOpen(false); navigate('/checkout') }} className="black-btn w-full">{t('checkout')}</button></div></>}</motion.aside></>}</AnimatePresence>
}

function Checkout(){
  const { items, subtotal, clear } = useCart()
  const { t,isAr } = useLangText()
  const [done,setDone] = useState(false)
  const shipping = subtotal === 0 || subtotal >= 300 ? 0 : 20
  if(done) return <main className="section-shell min-h-[70vh] py-20 grid place-items-center text-center"><div><CheckCircle2 size={64} className="mx-auto mb-5 text-[#173d2f]"/><h1 className="text-3xl font-black">{t('confirmed')}</h1><p className="mt-4 text-neutral-600 max-w-[560px]">{t('confirmedBody')}</p><Link to="/" onClick={clear} className="black-btn px-12 mt-8">{t('keep')}</Link></div></main>
  return <main className="section-shell py-8 md:py-16"><h1 className="section-title mb-8">{t('checkout')}</h1><div className="grid lg:grid-cols-[1fr_430px] gap-8"><form onSubmit={(e) => { e.preventDefault(); setDone(true) }} className="checkout-form"><CheckoutBlock title={t('contact')}><div className="grid md:grid-cols-2 gap-4"><Input label={isAr ? 'الاسم الأول' : 'First name'} required/><Input label={isAr ? 'اسم العائلة' : 'Last name'} required/><Input label={isAr ? 'البريد الإلكتروني' : 'Email'} type="email" required/><Input label={isAr ? 'رقم الهاتف' : 'Phone'} required/></div></CheckoutBlock><CheckoutBlock title={t('deliveryForm')}><div className="grid gap-4"><Input label={isAr ? 'العنوان' : 'Address'} required/><div className="grid md:grid-cols-3 gap-4"><Input label={isAr ? 'المدينة' : 'City'} required/><Input label={isAr ? 'الإمارة' : 'Emirate'} required/><Input label={isAr ? 'الدولة' : 'Country'} defaultValue={isAr ? 'الإمارات' : 'United Arab Emirates'}/></div></div></CheckoutBlock><CheckoutBlock title={t('payment')}><div className="grid gap-3">{['Credit Card','Tabby / Tamara','Cash on Delivery UAE','Instagram DM Order'].map((p,i) => <label key={p} className="payment-row"><input type="radio" name="pay" defaultChecked={i===0}/><span>{p}</span></label>)}</div></CheckoutBlock><button className="black-btn w-full md:w-[320px]">{t('place')} · {money(subtotal + shipping)}</button></form><aside className="summary"><h2>{t('orderSummary')}</h2>{items.length === 0 ? <p className="text-neutral-500">{t('empty')}</p> : items.map(item => <div key={item.id + item.size} className="summary-line"><div className="cart-thumb"><VialArt product={item} small/></div><div className="flex-1"><p>{isAr ? item.arName : item.name}</p><small>Qty {item.qty} · {item.size}</small></div><b>{money(item.price * item.qty)}</b></div>)}<div className="space-y-3 pt-5 text-sm"><div className="flex justify-between"><span>{t('subtotal')}</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span>{isAr ? 'التوصيل' : 'Shipping'}</span><span>{shipping ? money(shipping) : 'Free'}</span></div><div className="flex justify-between text-lg font-black border-t pt-4"><span>Total</span><span>{money(subtotal + shipping)}</span></div></div></aside></div></main>
}
function CheckoutBlock({ title, children }){ return <section><h2>{title}</h2>{children}</section> }
function Input({ label, type='text', required=false, defaultValue='' }){ return <label className="block"><span>{label}</span><input type={type} required={required} defaultValue={defaultValue}/></label> }

function DiscoverMore(){
  const { isAr } = useLangText()
  return <section className="discover"><div className="section-shell grid md:grid-cols-[34%_1fr] gap-8 items-center"><div><p className="mono text-gold">Niche Center</p><h2>{isAr ? 'هناك المزيد لاكتشافه' : "There's more to discover"}</h2><p>{isAr ? 'أكثر من 100 عطر نيش فاخر من أشهر دور العطور العالمية.' : 'More than 100 luxury niche perfumes from global fragrance houses.'}</p><a href={socials.instagram} target="_blank" rel="noreferrer" className="gold-btn mt-6 w-fit">Instagram DM</a></div><div className="discover-strip">{products.slice(0,7).map(p => <VialArt key={p.id} product={p} small/> )}</div></div></section>
}

const footerColumns = [
  ['Brands', ['Xerjoff', 'Amouage', 'Byredo', 'Diptyque', 'Nishane']],
  ['Shop', ['Best Sellers', 'Discovery Sets', 'Retail Bottles', 'Partials', 'Gift Ideas']],
  ['Support', ['Instagram Orders', 'UAE Delivery', 'GCC Shipping', 'Authenticity', 'Decant Process']],
]
function Footer(){
  const { isAr } = useLangText()
  return <footer className="site-footer"><div className="section-shell footer-top"><div><BrandMark/><p>{isAr ? 'تقسيمات عطور نيش أصلية في الإمارات. تجربة فاخرة قبل شراء الزجاجة الكاملة.' : 'Original luxury niche perfume decants in the UAE. Try the scent before committing to the full bottle.'}</p><div className="flex gap-2 mt-5"><a href={socials.instagram} target="_blank" rel="noreferrer" className="icon-pill"><InstagramIcon size={16}/> Instagram</a><a href={socials.threads} target="_blank" rel="noreferrer" className="icon-pill">Threads</a></div></div>{footerColumns.map(([title,links]) => <div key={title} className="footer-col"><h3>{title}</h3>{links.map(l => <Link key={l} to="/">{l}</Link>)}</div>)}</div><div className="section-shell footer-bottom"><button>United Arab Emirates · AED · {isAr ? 'العربية' : 'English'}</button><p>©2026 Niche Center Perfumes AE — demo ecommerce build.</p></div></footer>
}

function Shell(){
  const location = useLocation()
  useEffect(() => window.scrollTo(0,0), [location.pathname])
  return <><Header/><CartDrawer/><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:.28, ease:'easeOut' }}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes></motion.div></AnimatePresence><DiscoverMore/><Footer/></>
}

export default function App(){ return <LangProvider><CartProvider><Shell/></CartProvider></LangProvider> }
