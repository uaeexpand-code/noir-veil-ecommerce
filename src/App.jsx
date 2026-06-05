import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Search, ShoppingBag, SlidersHorizontal, X, Minus, Plus, ChevronDown, ShieldCheck, Truck, CreditCard, ArrowRight, Star } from 'lucide-react'

const whatsapp='https://wa.me/971551495060'
const socials={instagram:'https://www.instagram.com/niche_center/'}

const sizes=[{l:'2ML Sample',m:.3},{l:'5ML',m:.52},{l:'10ML',m:1},{l:'30ML',m:2.65}]
const products=[
  {id:'bdk-gris-charnel',badge:'NEW',brand:'BDK Parfums',name:'Gris Charnel',ar:'غري تشارنيل',family:['Amber','Woody'],collection:'Opus Essence',note:'Fig, black tea and sandalwood in a creamy amber trail.',price:250,img:'/images/niche-center/bdk-gris-charnel.webp'},
  {id:'bdk-riviera',badge:'HOT',brand:'BDK Parfums',name:'Riviera',ar:'ريفييرا',family:['Fresh','Aromatic'],collection:'Azure Edit',note:'Green citrus and clean musks for bright UAE days.',price:240,img:'/images/niche-center/bdk-riviera.webp'},
  {id:'bdk-rouge-ardent',badge:'SALE',brand:'BDK Parfums',name:'Rouge Ardent',ar:'روج أردنت',family:['Spicy','Amber'],collection:'Velours Noir',note:'Rose, spice and glowing woods with evening intensity.',price:260,img:'/images/niche-center/bdk-rouge-ardent.webp'},
  {id:'crivelli-cuir',badge:'RARE',brand:'Maison Crivelli',name:'Cuir InfraRouge',ar:'كوير إنفراروج',family:['Leather','Spicy'],collection:'Velours Noir',note:'A textured leather extrait with radiant red spices.',price:310,img:'/images/niche-center/crivelli-cuir-infrarouge.webp'},
  {id:'amouage-reasons',badge:'NEW',brand:'Amouage',name:'Reasons',ar:'ريزونز',family:['Amber','Woody'],collection:'Étheria',note:'Creamy woods, resin and soft amber for a refined signature.',price:295,img:'/images/niche-center/amouage-reasons.webp'},
  {id:'amouage-reflection',badge:'ICON',brand:'Amouage',name:'Reflection Man',ar:'ريفليكشن مان',family:['Floral','Fresh'],collection:'Maison Icons',note:'White florals, neroli and sandalwood in a polished profile.',price:285,img:'/images/niche-center/amouage-reflection-man.webp'},
]
const familyTiles=['Floral','Woody','Amber','Chypre','Leather','Aldehyde','Spicy','Fougere']
const AED=n=>`AED ${Number(n).toLocaleString()}`
const getP=id=>products.find(p=>p.id===id)||products[0]

const LangContext=createContext(null)
const useLang=()=>useContext(LangContext)
function LangProvider({children}){
  const [l,setL]=useState(()=>localStorage.getItem('nc-l')||'en')
  useEffect(()=>{localStorage.setItem('nc-l',l);document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'},[l])
  const v=useMemo(()=>({l,ar:l==='ar',toggle:()=>setL(x=>x==='ar'?'en':'ar')}),[l])
  return <LangContext.Provider value={v}>{children}</LangContext.Provider>
}

const CartContext=createContext(null)
const useCart=()=>useContext(CartContext)
function CartProvider({children}){
  const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('nc-c')||'[]')}catch{return[]}})
  const [open,setOpen]=useState(false)
  useEffect(()=>localStorage.setItem('nc-c',JSON.stringify(items)),[items])
  const add=(p,sl='10ML',q=1)=>{const s=sizes.find(x=>x.l===sl)||sizes[2];setItems(v=>{const hit=v.find(x=>x.id===p.id&&x.sl===sl);if(hit)return v.map(x=>x.id===p.id&&x.sl===sl?{...x,q:x.q+q}:x);return[...v,{id:p.id,na:p.name,ar:p.ar,br:p.brand,img:p.img,sl,pr:Math.round(p.price*s.m),q}]});setOpen(true)}
  const up=(id,sl,q)=>setItems(v=>v.map(x=>x.id===id&&x.sl===sl?{...x,q:Math.max(1,q)}:x))
  const rm=(id,sl)=>setItems(v=>v.filter(x=>!(x.id===id&&x.sl===sl)))
  const sub=items.reduce((s,x)=>s+x.pr*x.q,0),cnt=items.reduce((s,x)=>s+x.q,0)
  const v=useMemo(()=>({items,open,setOpen,add,up,rm,sub,cnt}),[items,open,sub,cnt])
  return <CartContext.Provider value={v}>{children}</CartContext.Provider>
}

function WA(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>}

function Header(){
  const {cnt,setOpen}=useCart();const {l,toggle}=useLang()
  return <header className="wd-header">
    <div className="wd-top"><span>Free UAE delivery over AED 200</span><span>Original niche decants · WhatsApp support</span></div>
    <div className="wd-nav shell-wide">
      <Link to="/" className="wd-logo"><span>NICHE</span><em>CENTER</em></Link>
      <nav><Link to="/">Home</Link><a href="#new">Shop</a><a href="#family">Olfactive Family</a><a href="#offers">Offers</a><a href="#journal">Journal</a></nav>
      <div className="wd-actions"><button aria-label="Search"><Search size={19}/></button><button onClick={toggle}>{l==='ar'?'EN':'AR'}</button><a href={whatsapp} target="_blank" rel="noreferrer"><WA/></a><button className="bag-btn" onClick={()=>setOpen(true)}><ShoppingBag size={20}/><span>{cnt}</span></button></div>
    </div>
  </header>
}

function Hero(){
  return <section className="wd-hero">
    <div className="hero-slide-num"><b>01</b><span>02</span><span>03</span></div>
    <div className="wd-hero-copy">
      <p>NEW FRAGRANCE IN THE OPUS ESSENCE</p>
      <h1>Deep fragrance with a refined intensity</h1>
      <Link to={`/product/${products[0].id}`} className="wd-btn dark">Buy now</Link>
    </div>
    <div className="wd-hero-art">
      <div className="amber-orb orb-one"/><div className="amber-orb orb-two"/>
      <img className="hero-main" src={products[4].img} alt="Amouage Reasons"/>
      <img className="hero-side" src={products[2].img} alt="Rouge Ardent"/>
    </div>
  </section>
}

function ProductCard({p,i}){
  const {add}=useCart();const price=Math.round(p.price*sizes[2].m)
  return <motion.article className="wd-card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.32,delay:i*.035}}>
    <Link to={`/product/${p.id}`} className="wd-card-img"><span className="sale-badge">{p.badge}</span><button type="button" className="heart"><Heart size={17}/></button><img src={p.img} alt={p.name}/><button type="button" onClick={(e)=>{e.preventDefault();add(p)}} className="quick-cart">Add to cart</button></Link>
    <div className="wd-card-info"><Link to={`/product/${p.id}`}>{p.name} 10ml</Link><p>{p.family.join(', ')}</p><strong>{AED(price)}</strong></div>
  </motion.article>
}

function ProductGrid({title='New In',items=products,withFilter=false}){
  return <section className="wd-section" id="new"><div className="section-head"><div><p>PERFUMES</p><h2>{title}</h2></div>{withFilter&&<button className="filter-btn"><SlidersHorizontal size={16}/> Filters</button>}</div><div className="product-grid">{items.map((p,i)=><ProductCard key={p.id} p={p} i={i}/>)}</div></section>
}

function FamilySection(){return <section className="family-wrap" id="family"><div className="marquee"><span>Ethereal</span><span>Sensory</span><span>Signature</span><span>Ethereal</span><span>Sensory</span><span>Signature</span></div><div className="section-head centered"><p>SHOP BY</p><h2>Olfactory Family</h2></div><div className="family-grid">{familyTiles.map((f,i)=><a key={f} href="#new" className={f==='Amber'?'active':''}><span>{String(i+1).padStart(2,'0')}</span>{f}</a>)}</div></section>}

function FeatureBanners(){return <section className="feature-banners" id="offers">
  {[products[3],products[2],products[1]].map((p,i)=><article key={p.id} className="feature-row"><div><p>{p.collection}</p><h2>{i===0?'Velours Noir':p.name}</h2><span>{p.note}</span><Link to={`/product/${p.id}`} className="wd-link">Shop now <ArrowRight size={15}/></Link></div><img src={p.img} alt={p.name}/></article>)}
</section>}

function Home(){return <main><Hero/><ProductGrid title="New In"/><FamilySection/><FeatureBanners/><section className="promo-band"><div><p>SALE COLLECTION</p><h2>Get up to 20% off</h2><Link to="#new" className="wd-btn light">Shop now</Link></div><img src={products[2].img} alt="Sale collection"/></section><ProductGrid title="Promotional Offers" items={[...products].reverse()}/><Journal/></main>}

function Journal(){return <section className="journal" id="journal"><div className="section-head centered"><p>FRAGRANCE JOURNAL</p><h2>From our world</h2></div><div className="journal-grid"><article><span>NOTES</span><h3>How amber perfumes become a signature</h3><p>Warm resin, vanilla and woods create the soft glow people remember.</p></article><article><span>GUIDE</span><h3>Choose between samples and daily sizes</h3><p>Start small, wear it in UAE weather, then move to a larger decant.</p></article><article><span>CARE</span><h3>Keep your scent fresh for longer</h3><p>Store decants away from sun and heat to protect the original profile.</p></article></div></section>}

function ProductPage(){
  const {id}=useParams();const p=getP(id);const {add}=useCart();const [sel,setSel]=useState(2);const [qty,setQty]=useState(1);const [tab,setTab]=useState('Description')
  const price=Math.round(p.price*sizes[sel].m)
  useEffect(()=>{document.title=`${p.name} 10ml - Niche Center`},[p])
  const gallery=[p.img,...products.filter(x=>x.id!==p.id).slice(0,4).map(x=>x.img)]
  const [main,setMain]=useState(gallery[0])
  useEffect(()=>setMain(p.img),[p.id])
  return <main className="wd-product shell-wide">
    <nav className="wd-breadcrumb"><Link to="/">Home</Link><span>/</span><a href="#family">{p.family[0]}</a><span>/</span><span>{p.name} 10ml</span></nav>
    <section className="product-main">
      <div className="product-gallery"><div className="thumb-col">{gallery.map((img,i)=><button key={img+i} className={main===img?'active':''} onClick={()=>setMain(img)}><img src={img} alt=""/></button>)}</div><div className="big-img"><span>{p.badge}</span><img src={main} alt={p.name}/></div></div>
      <aside className="summary"><p className="brand-line">{p.brand}</p><h1>{p.name} 10ml</h1><div className="rating"><span>{[1,2,3,4,5].map(x=><Star key={x} size={14} fill="currentColor"/>)} </span><em>3 customer reviews</em></div><p className="short">{p.note}</p><div className="price-line">{AED(price)}</div><div className="size-picker"><label>Size</label><div>{sizes.map((s,i)=><button key={s.l} onClick={()=>setSel(i)} className={sel===i?'active':''}>{s.l}</button>)}</div></div><div className="buy-box"><div className="qty"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={14}/></button><span>{qty}</span><button onClick={()=>setQty(qty+1)}><Plus size={14}/></button></div><button className="wd-btn dark grow" onClick={()=>add(p,sizes[sel].l,qty)}>Add to cart</button></div><button className="buy-now" onClick={()=>add(p,sizes[sel].l,qty)}>Buy now</button><button className="wishlist"><Heart size={16}/> Add to wishlist</button><div className="meta"><p><b>Collection:</b> {p.collection}</p><p><b>Olfactive family:</b> {p.family.join(', ')}</p><p><b>Perfume:</b> Original niche decant</p></div></aside>
    </section>
    <section className="notes-grid"><div><h3>Top Notes</h3><p>Bergamot, Pimento Berry, Oregano</p></div><div><h3>Heart Notes</h3><p>Amber, Citrus, Frankincense, Vanilla</p></div><div><h3>Base Notes</h3><p>Oud, Leather, Patchouli, Sandalwood</p></div></section>
    <section className="desc-tabs"><div className="tab-head">{['Description','Additional information','Reviews'].map(x=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{x}</button>)}</div><p>{tab==='Description'?`${p.name} is poured from an original retail bottle into a clean atomizer. A refined fragrance for discovery, travel and daily wear.`:tab==='Additional information'?`Size ${sizes[sel].l}. UAE delivery available. WhatsApp confirmation after order.`:'Beautiful scent, fast delivery and very clean packaging.'}</p></section>
    <ProductGrid title="From Collection" items={[...products].filter(x=>x.id!==p.id).slice(0,4)}/>
  </main>
}

function CartDrawer(){const {open,setOpen,items,up,rm,sub}=useCart();const nav=useNavigate();return <AnimatePresence>{open&&<><motion.div className="drawer-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)}/><motion.aside className="wd-drawer" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:260}}><div className="drawer-head"><h3>Shopping cart</h3><button onClick={()=>setOpen(false)}><X size={18}/></button></div>{items.length===0?<div className="empty-cart"><ShoppingBag/><h4>Your cart is currently empty.</h4><p>Before checkout, add something from the shop.</p><Link to="/" onClick={()=>setOpen(false)} className="wd-btn dark">Return to shop</Link></div>:<><div className="drawer-items">{items.map(x=><div className="drawer-item" key={x.id+x.sl}><img src={x.img} alt=""/><div><b>{x.na}</b><small>{x.sl}</small><button onClick={()=>rm(x.id,x.sl)}>Remove</button></div><div><strong>{AED(x.pr*x.q)}</strong><span><button onClick={()=>up(x.id,x.sl,x.q-1)}>-</button>{x.q}<button onClick={()=>up(x.id,x.sl,x.q+1)}>+</button></span></div></div>)}</div><div className="drawer-foot"><p><span>Subtotal</span><b>{AED(sub)}</b></p><button className="wd-btn dark" onClick={()=>{setOpen(false);nav('/checkout')}}>Checkout</button></div></>}</motion.aside></>}</AnimatePresence>}

function Checkout(){const {items,sub}=useCart();const [done,setDone]=useState(false);const ship=sub>200||sub===0?0:15;if(done)return <main className="order-complete"><div><h1>Order complete</h1><p>Thank you. We will confirm your niche perfume order on WhatsApp shortly.</p><a className="wd-btn dark" href={whatsapp}>WhatsApp</a></div></main>;return <main className="checkout-page shell-wide"><div className="checkout-steps"><span>Shopping cart</span><b>Checkout</b><span>Order complete</span></div><h1>Checkout</h1>{items.length===0?<div className="empty-check"><h2>Your cart is currently empty.</h2><p>Before proceed to checkout you must add some products to your shopping cart.</p><Link className="wd-btn dark" to="/">Return to shop</Link></div>:<div className="checkout-layout"><form className="checkout-form" onSubmit={e=>{e.preventDefault();setDone(true)}}><section><h2>Billing details</h2><div className="form-row"><label>First name<input required/></label><label>Last name<input required/></label></div><label>Country / Region<input defaultValue="United Arab Emirates" required/></label><label>Street address<input required/></label><div className="form-row"><label>Town / City<input required/></label><label>Phone<input required/></label></div><label>Email address<input required type="email"/></label></section><section><h2>Payment</h2>{['Credit card','Tabby / Tamara','Cash on delivery','WhatsApp order'].map((m,i)=><label className="pay-line" key={m}><input type="radio" name="pay" defaultChecked={i===0}/>{m}</label>)}<button className="wd-btn dark full">Place order</button></section></form><aside className="order-box"><h2>Your order</h2>{items.map(x=><div className="order-item" key={x.id+x.sl}><img src={x.img}/><p>{x.na}<small>Qty {x.q} · {x.sl}</small></p><b>{AED(x.pr*x.q)}</b></div>)}<div className="totals"><p><span>Subtotal</span><b>{AED(sub)}</b></p><p><span>Shipping</span><b>{ship?'AED 15':'Free'}</b></p><strong><span>Total</span><span>{AED(sub+ship)}</span></strong></div><div className="secure"><ShieldCheck size={16}/> Secure checkout · UAE delivery</div></aside></div>}</main>}

function Footer(){return <footer className="wd-footer"><div className="footer-promo"><div><h2>Velours Noir</h2><p>Sale Collection · Get up to 20% off</p></div><Link to="#new" className="wd-btn light">Shop now</Link></div><div className="footer-grid"><div><h3>NICHE CENTER</h3><p>Original luxury niche decants in the UAE.</p></div><div><h4>Shop</h4><a>New In</a><a>Amber</a><a>Samples</a></div><div><h4>Support</h4><a href={whatsapp}>WhatsApp</a><a>Delivery</a><a>Authenticity</a></div><div><h4>Newsletter</h4><p>New drops and offers.</p><div className="signup"><input placeholder="Your email"/><button>→</button></div></div></div><div className="footer-bottom"><span>© 2026 Niche Center Perfumes AE</span><span>AED · UAE · <a href={socials.instagram}>Instagram</a></span></div></footer>}

function Shell(){const loc=useLocation();useEffect(()=>scrollTo(0,0),[loc.pathname]);return <><Header/><CartDrawer/><AnimatePresence mode="wait"><motion.div key={loc.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.22}}><Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes></motion.div></AnimatePresence><Footer/><a className="float-wa" href={whatsapp} target="_blank" aria-label="WhatsApp"><WA/></a></>}
export default function App(){return <LangProvider><CartProvider><Shell/></CartProvider></LangProvider>}
