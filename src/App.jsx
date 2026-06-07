import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Heart, Search, ShoppingBag, X, Minus, Plus } from 'lucide-react'

const whatsapp='https://wa.me/971551495060'
const W='https://woodmart.xtemos.com/perfumes/wp-content/uploads/sites/32'
const img={
  logoWhite:'/images/tara-logo.png', logoBlack:'/images/tara-logo.png',
  heroBg:`${W}/2025/12/prf-slide-1-bg-ov.jpg.webp`, heroBottle:`${W}/2025/11/prf-slide-1-bottle-1-opt.png.webp`,
  etheria:`${W}/2025/11/prf-collection-etheria.jpg.webp`, opus:`${W}/2025/11/prf-collection-opus-essence.jpg`,
  banner2:`${W}/2025/11/prf-slide-banner-bg-2.jpg.webp`, banner3:`${W}/2025/11/prf-slide-banner-bg-3.jpg.webp`,
  abyss:`${W}/2025/11/abyss-bleu.jpeg.webp`, abyss1:`${W}/2025/11/abyss-bleu-1.jpeg.webp`, abyss2:`${W}/2025/11/abyss-bleu-2.jpeg.webp`, abyss3:`${W}/2025/11/abyss-bleu-3.jpeg.webp`,
  amber:`${W}/2025/11/amber-bloom.jpeg.webp`, amber2:`${W}/2025/11/amber-bloom-2.jpeg.webp`, ember:`${W}/2025/11/ember-glow.jpeg.webp`, amethyst:`${W}/2025/11/amethyst-haze.jpeg.webp`,
  arctic:`${W}/2025/11/arctic-dusk.jpeg`, celestial:`${W}/2025/11/celestial-frost.jpeg.webp`, surge:`${W}/2025/11/celestial-surge-3.jpeg.webp`, glacier:`${W}/2025/11/glacier-bloom-2.jpeg.webp`,
}

const sizes=[{l:'100ml',m:1},{l:'50ml',m:.5},{l:'2ml Sample',m:.08}]
const products=[
  {id:'marash-al-tayyib',name:'الطيب',full:'مرش الطيب',family:['مرش','TARA'],collection:'TARA',desc:'مرش معطر من TARA بلمسة فاخرة مناسبة للمنزل والمفارش والعبايات.',price:168,img:'/images/products/1.webp',gallery:['/images/products/1.webp']},
  {id:'marash-sahab',name:'سحاب',full:'مرش سحاب',family:['مرش','TARA'],collection:'TARA',desc:'مرش سحاب من TARA برائحة ناعمة ومنعشة للاستخدام اليومي.',price:197,img:'/images/products/2.webp',gallery:['/images/products/2.webp']},
  {id:'marash-ghram',name:'غرام',full:'مرش غرام',family:['مرش','TARA'],collection:'TARA',desc:'مرش غرام من TARA، عطر أنيق بانتشار جميل وثبات لطيف.',price:214,img:'/images/products/3.webp',gallery:['/images/products/3.webp']},
  {id:'marash-tara',name:'تارا',full:'مرش تارا',family:['مرش','TARA'],collection:'TARA',desc:'مرش تارا بتوقيع فاخر ورائحة دافئة تناسب الأجواء الراقية.',price:188,img:'/images/products/4.webp',gallery:['/images/products/4.webp']},
  {id:'dukhoon-sheikha',name:'شيخة',full:'دخون شيخة',family:['دخون','TARA'],collection:'TARA',desc:'دخون شيخة من TARA بتركيبة فاخرة تضيف عبقاً شرقياً للمكان.',price:225,img:'/images/products/5.webp',gallery:['/images/products/5.webp']},
  {id:'marash-tara-clear',name:'تارا كلير',full:'مرش تارا كلير',family:['مرش','TARA'],collection:'TARA',desc:'مرش تارا كلير برائحة نظيفة وخفيفة للاستخدام المتكرر.',price:196,img:'/images/products/6.webp',gallery:['/images/products/6.webp']},
  {id:'dukhoon-sheikha-v2',name:'شيخه',full:'دخون شيخه',family:['دخون','TARA'],collection:'TARA',desc:'دخون شيخه بعبير شرقي فاخر ولمسة ذهبية راقية.',price:242,img:'/images/products/7.webp',gallery:['/images/products/7.webp']},
  {id:'dukhoon-sheikha-v3',name:'شيخه',full:'دخون شيخه',family:['دخون','TARA'],collection:'TARA',desc:'دخون شيخه بإحساس ملكي ودخان عطر فخم للمناسبات.',price:255,img:'/images/products/8.webp',gallery:['/images/products/8.webp']},
  {id:'dukhoon-alzaby',name:'الظبي',full:'دخون الظبي',family:['دخون','TARA'],collection:'TARA',desc:'دخون الظبي من TARA برائحة شرقية ناعمة ومميزة.',price:170,img:'/images/products/9.webp',gallery:['/images/products/9.webp']},
  {id:'marash-albadr',name:'البدر',full:'مرش البدر',family:['مرش','TARA'],collection:'TARA',desc:'مرش البدر من TARA برائحة مشرقة وفاخرة تناسب كل الأوقات.',price:199,img:'/images/products/10.webp',gallery:['/images/products/10.webp']},
]
const fromCollection=[
  {id:'dukhoon-alzaby',full:'دخون الظبي',price:170,img:'/images/products/9.webp'},
  {id:'marash-albadr',full:'مرش البدر',price:199,img:'/images/products/10.webp'},
  {id:'dukhoon-sheikha-v3',full:'دخون شيخه',price:255,img:'/images/products/8.webp'},
  {id:'marash-ghram',full:'مرش غرام',price:214,img:'/images/products/3.webp'},
]
const familyTiles=['مرش','دخون','TARA','الطيب','سحاب','غرام','شيخة','الظبي']
const money=n=>`AED ${Number(n).toFixed(2)}`
const getP=id=>products.find(p=>p.id===id)||products[0]

const LangContext=createContext(null)
const useLang=()=>useContext(LangContext)
function LangProvider({children}){const [l,setL]=useState(()=>localStorage.getItem('nc-l')||'en');useEffect(()=>{localStorage.setItem('nc-l',l);document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'},[l]);return <LangContext.Provider value={{l,toggle:()=>setL(x=>x==='ar'?'en':'ar')}}>{children}</LangContext.Provider>}

const CartContext=createContext(null)
const useCart=()=>useContext(CartContext)
function CartProvider({children}){
  const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('nc-c')||'[]')}catch{return[]}})
  const [open,setOpen]=useState(false)
  useEffect(()=>localStorage.setItem('nc-c',JSON.stringify(items)),[items])
  const add=(p,sl='100ml',q=1)=>{const s=sizes.find(x=>x.l===sl)||sizes[0];setItems(v=>{const hit=v.find(x=>x.id===p.id&&x.sl===sl);if(hit)return v.map(x=>x.id===p.id&&x.sl===sl?{...x,q:x.q+q}:x);return[...v,{id:p.id,na:p.full||p.name,img:p.img,sl,pr:Math.round((p.price||250)*s.m),q}]});setOpen(true)}
  const up=(id,sl,q)=>setItems(v=>v.map(x=>x.id===id&&x.sl===sl?{...x,q:Math.max(1,q)}:x))
  const rm=(id,sl)=>setItems(v=>v.filter(x=>!(x.id===id&&x.sl===sl)))
  const sub=items.reduce((s,x)=>s+x.pr*x.q,0),cnt=items.reduce((s,x)=>s+x.q,0)
  const v=useMemo(()=>({items,open,setOpen,add,up,rm,sub,cnt}),[items,open,sub,cnt])
  return <CartContext.Provider value={v}>{children}</CartContext.Provider>
}

function WA(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>}

function Header(){const {cnt,setOpen}=useCart();const {l,toggle}=useLang();const home=useLocation().pathname==='/'
  return <header className={`site-header ${home?'over-hero':''}`}><div className="site-bar"><Link to="/" className="brand-logo"><img src={img.logoBlack} alt="TARA"/></Link><nav><a href="#new">New</a><a href="#family">Fragrances</a><a href="#journal">Journal</a><a href="#about">About Us</a></nav><div className="head-actions"><button><Search size={20}/>Search</button><button onClick={toggle}>{l==='ar'?'EN':'AR'}</button><a href={whatsapp} target="_blank" rel="noreferrer"><WA/></a><button onClick={()=>setOpen(true)}>Cart {cnt}</button></div></div></header>}

function Hero(){return <section className="wm-hero"><img className="hero-bg" src={img.heroBg} alt=""/><button className="hero-arrow left">‹</button><button className="hero-arrow right">›</button><div className="hero-content"><img className="hero-bottle" src={img.heroBottle} alt="Aurora Flame"/><h1>TARA<br/>Luxury Scents</h1><Link className="black-btn" to="/product/marash-tara">Buy Now</Link></div><div className="hero-pages"><b>01</b><span>02</span><span>03</span></div></section>}

function ProductCard({p}){const {add}=useCart();return <article className="wm-card"><Link to={`/product/${p.id}`}><h3>{p.full}</h3><img src={p.img} alt={p.full}/><p>{money(p.price)}</p></Link><div className="card-actions"><button onClick={()=>add(p)}>＋</button><button><Heart size={17}/></button></div></article>}
function ProductGrid({title='New In',items=products.slice(0,3),filters=false,cols='three'}){return <section className="wm-section" id={title==='New In'?'new':undefined}><div className="section-title"><h2>{title}</h2>{filters&&<div className="tabs"><button>All</button><button>For Her</button><button>For Him</button></div>}</div><div className={`wm-grid ${cols}`}>{items.map((p)=><ProductCard key={p.id} p={p}/>)}</div></section>}

function Family(){return <section className="wm-section family" id="family"><h2>Shop by Olfactory Family</h2><div className="family-buttons">{familyTiles.map(f=><a key={f} href="#new">{f}</a>)}</div><div className="marquee"><span>Ethereal</span><i>✦</i><span>Sensory</span><i>✦</i><span>Signature</span><i>✦</i><span>Ethereal</span></div><div className="featured-fragrance"><div><h2>Ember Glow</h2><p>Radiant blend of citrus, florals, and warm musks, evoking the magic of a starlit night in Los Angeles. Luminous, sensual, and endlessly captivating.</p></div><ProductCard p={products[5]} i={0}/></div></section>}

function Home(){return <main><Hero/><ProductGrid title="New In"/><Family/><ProductGrid title="Promotional Offers" items={products.slice(0,4)} filters cols="four"/><section className="collections"><article style={{backgroundImage:`url(${img.banner2})`}}><h2>Nocturne Essence</h2><p>A collection of fresh, luminous scents inspired by mystery of nightfall.</p><a>View Collection</a></article><article style={{backgroundImage:`url(${img.banner3})`}}><h2>Étheria</h2><p>Delicate, weightless fragrances that capture the essence of air and light.</p><a>View Collection</a></article></section><Journal/></main>}
function Journal(){return <section className="wm-section journal" id="journal"><h2>TARA Collection</h2><div className="journal-row"><article><span>مرش</span><h3>Luxury mists</h3></article><article><span>دخون</span><h3>Elegant bakhoor</h3></article><article><span>TARA</span><h3>Signature scents</h3></article></div><div className="insta"><h2>Connect to our<br/>Instagram</h2><a href="https://www.instagram.com/by.tara4/">@by.tara4</a></div></section>}

function ProductPage(){const {id}=useParams();const p=getP(id);const {add}=useCart();const [sel,setSel]=useState(0);const [qty,setQty]=useState(1);useEffect(()=>{document.title=`${p.full} - Niche Center`},[p]);const gallery=p.gallery||[p.img]
  return <main className="product-page"><section className="single-product"><div className="gallery-masonry"><img className="main-product-img" src={gallery[0]} alt={p.full}/><div className="sub-gallery"><img src={gallery[1]||gallery[0]} alt=""/><img src={gallery[2]||gallery[0]} alt=""/></div><div className="video-tile"></div></div><aside className="product-summary"><h1>{p.full}</h1><p className="short-desc">{p.desc}</p><div className="size-row"><b>Size :</b>{sizes.map((s,i)=><button key={s.l} className={sel===i?'active':''} onClick={()=>setSel(i)}>{s.l}</button>)}</div><p className="single-price">{money(Math.round(p.price*sizes[sel].m))}</p><div className="purchase-row"><div className="quantity"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={13}/></button><span>{qty}</span><button onClick={()=>setQty(qty+1)}><Plus size={13}/></button></div><button className="black-wide" onClick={()=>add(p,sizes[sel].l,qty)}>Add To Cart</button><button className="outline-wide" onClick={()=>add(p,sizes[sel].l,qty)}>Buy Now</button><button className="heart-only"><Heart size={21}/></button></div><div className="details-table"><p><b>Collection</b><span>{p.collection}</span></p><p><b>Olfactive Family</b><span>{p.family.join(', ')}</span></p><p><b>Perfume</b><span>For Him</span></p></div></aside></section><section className="collection-story"><h2>Étheria Collection</h2><div className="video-hero" style={{backgroundImage:`url(${img.etheria})`}}><span>▷</span></div><p>Aurora Haze is a luminous, ethereal fragrance that captures the serene beauty of dawn. Opening with delicate citrus and dewy florals, it unfolds into a heart of soft amber and blooming jasmine, evoking the first golden rays of sunlight. A warm base of creamy sandalwood and subtle musk lingers on the skin, wrapping you in a gentle, radiant embrace.</p><div className="notes"><div><h3>Top Notes:</h3><p>Bergamot, Pimento Berry, Oregano</p></div><div><h3>Heart Notes:</h3><p>Amber, Citrus, Frankincense, Vanilla</p></div><div><h3>Base Notes:</h3><p>Oud, Leather, Patchouli, Sandalwood</p></div></div></section><section className="wm-section from"><h2>From Collection</h2><div className="wm-grid four">{fromCollection.map((x,i)=><ProductCard key={x.id} p={x} i={i}/>)}</div></section></main>}

function CartDrawer(){const {open,setOpen,items,up,rm,sub}=useCart();const nav=useNavigate();if(!open)return null;return <><div className="drawer-bg" onClick={()=>setOpen(false)}/><aside className="cart-drawer"><div className="drawer-head"><h3>Shopping cart</h3><button onClick={()=>setOpen(false)}><X size={18}/></button></div>{items.length===0?<div className="empty-cart"><ShoppingBag/><h4>No products in the cart.</h4><Link to="/" onClick={()=>setOpen(false)} className="black-wide">Return To Shop</Link></div>:<><div className="drawer-items">{items.map(x=><div className="drawer-item" key={x.id+x.sl}><img src={x.img} alt=""/><div><b>{x.na}</b><small>{x.sl}</small><button onClick={()=>rm(x.id,x.sl)}>Remove</button></div><div><strong>{money(x.pr*x.q)}</strong><span><button onClick={()=>up(x.id,x.sl,x.q-1)}>-</button>{x.q}<button onClick={()=>up(x.id,x.sl,x.q+1)}>+</button></span></div></div>)}</div><div className="drawer-foot"><p><span>Subtotal</span><b>{money(sub)}</b></p><button className="black-wide" onClick={()=>{setOpen(false);nav('/checkout')}}>Checkout</button></div></>}</aside></>}
function Checkout(){const {items,sub}=useCart();return <main className="checkout-page"><div className="steps"><span>Shopping cart</span><b>Checkout</b><span>Order complete</span></div><h1>Checkout</h1>{items.length===0?<div className="empty-check"><h2>Your cart is currently empty.</h2><p>Before proceed to checkout you must add some products to your shopping cart.</p><Link className="black-btn" to="/">Return to shop</Link></div>:<div className="checkout-layout"><form><h2>Billing details</h2><label>First name<input required/></label><label>Last name<input required/></label><label>Country / Region<input defaultValue="United Arab Emirates"/></label><label>Phone<input required/></label><label>Email address<input type="email"/></label><button className="black-wide">Place order</button></form><aside><h2>Your order</h2>{items.map(x=><p key={x.id+x.sl}><span>{x.na} × {x.q}</span><b>{money(x.pr*x.q)}</b></p>)}<strong><span>Total</span><span>{money(sub)}</span></strong></aside></div>}</main>}
function Footer(){return <footer className="wm-footer" id="about"><div><img className="footer-logo" src={img.logoWhite} alt="TARA"/><div><h3>TARA scents for luxury mists and dukhoon in the UAE.</h3></div></div><div className="footer-links"><section><h3>Insider Access</h3><p>Receive exclusive TARA launches and special announcements.</p><div><input placeholder="Your email address"/><button>Sign Up</button></div></section><section><a>About Us</a><a>Contact Us</a><a>F.A.Q.</a><a>Instagram</a></section><section><a>Refund</a><a>Terms of use</a><a>Privacy</a></section></div><p className="copy">TARA © 2026 created for UAE.</p></footer>}
function Shell(){const loc=useLocation();useEffect(()=>scrollTo(0,0),[loc.pathname]);return <><Header/><CartDrawer/><Routes><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes><Footer/></>}
export default function App(){return <LangProvider><CartProvider><Shell/></CartProvider></LangProvider>}
