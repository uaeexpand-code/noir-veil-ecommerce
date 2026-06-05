import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, User, ShoppingBag, X, Minus, Plus, Star, ChevronDown, CheckCircle2 } from 'lucide-react'

const products = [
  { id:'missing-person', name:'MISSING PERSON', sub:'50mL Eau de Parfum', type:'Floral Musk', price:99, old:null, badge:'BEST SELLER', quote:'If nude were a perfume, this is it.', color:'#f3a37e', color2:'#ffd3c3', notes:['Skin Musk','Bergamot Nectar','Sheer Jasmine','Neroli Blossom','Blonde Wood','White Musk'], description:'A delicate, addictive floral musk that evokes the lingering warmth of clean skin, sheer jasmine, orange blossom and soft transparent woods.', rating:'4.8', reviews:'1.9K' },
  { id:'father-figure', name:'FATHER FIGURE', sub:'50mL Eau de Parfum', type:'Woody Fresh', price:99, old:null, badge:'BEST SELLER', quote:'Green fig, cashmere woods and quiet confidence.', color:'#90c9a3', color2:'#d4f2dc', notes:['Italian Bergamot','Green Fig','Jasmine Dew','Orris','Sandalwood','Musk Veil'], description:'A clean woody fragrance with leafy fig, creamy woods and a barely-there skin musk finish.', rating:'4.7', reviews:'892' },
  { id:'vanilla-skin', name:'VANILLA SKIN', sub:'50mL Eau de Parfum', type:'Woody Gourmand', price:99, old:null, badge:'BEST SELLER', quote:'A soft vanilla with a polished skin-like drydown.', color:'#d1a176', color2:'#f2d7b8', notes:['Pink Pepper','Sugar Crystals','Cashmere','Vanilla Absolute','Sandalwood','Benzoin'], description:'Creamy vanilla folded into cashmere woods, warm benzoin and a clean musk trail.', rating:'4.9', reviews:'1.2K' },
  { id:'cherry-stem', name:'CHERRY STEM', sub:'50mL Eau de Parfum', type:'Fruity Wood', price:99, old:null, badge:'NEW', quote:'A glossy cherry scent with dark woods.', color:'#8e0815', color2:'#e55a67', notes:['Black Cherry','Red Plum','Saffron','Rose Petal','Cedarwood','Tonka'], description:'A rich fruit-wood perfume with lacquered cherry, saffron and smooth cedar.', rating:'4.6', reviews:'573' },
  { id:'island-swim', name:'ISLAND SWIM', sub:'Full Size Body Mist', type:'Aquatic Citrus', price:39, old:null, badge:'NEW', quote:'Bright blue water, coconut skin and salty air.', color:'#9cdced', color2:'#d8f8ff', notes:['Sea Salt','Mandarin','Coconut Water','Solar Jasmine','Amber Sand','Clean Musk'], description:'Fresh aquatic citrus made for warm weather and easy layering.', rating:'4.7', reviews:'411' },
  { id:'paradise-nectar', name:'PARADISE NECTAR', sub:'Full Size Body Mist', type:'Fruity Floral', price:39, old:null, badge:'NEW', quote:'Juicy tropical fruit with a creamy floral glow.', color:'#df8991', color2:'#ffd1d6', notes:['Guava','Nectarine','Hibiscus','Tiare Flower','Vanilla Milk','Skin Musk'], description:'A bright body mist with fruit nectar, soft florals and a clean-skin base.', rating:'4.5', reviews:'266' },
  { id:'discovery-set', name:'DISCOVERY SET', sub:'8 x 2mL Samples', type:'Sample Collection', price:39, old:null, badge:'$20 CREDIT', quote:'Explore every mood before committing.', color:'#111111', color2:'#777777', set:true, notes:['8 Samples','Fine Fragrance','Travel Ready','Credit Included','Giftable','Layerable'], description:'An eight-piece sample wardrobe with credit toward your next full-size scent.', rating:'4.8', reviews:'3.4K' },
  { id:'island-trio', name:'ISLAND ESCAPE', sub:'Travel Size Body Mist Trio', type:'Mist Trio', price:68, old:78, badge:'NEW', quote:'Three tropical mists for skin, hair and holiday bags.', color:'#9cdced', color2:'#df8991', trio:true, notes:['Island Swim','Beach Skin','Paradise Nectar','Travel Ready','Hair + Body','Giftable'], description:'A trio of travel body mists with aquatic, beachy and fruity floral profiles.', rating:'4.8', reviews:'658' },
]
const mainProduct = products[0]
const fmt = n => `$${Number(n).toLocaleString()}`

const CartContext = createContext(null)
function CartProvider({ children }){
  const [items,setItems] = useState(()=>{ try { return JSON.parse(localStorage.getItem('noir-veil-cart') || '[]') } catch { return [] } })
  const [open,setOpen] = useState(false)
  useEffect(()=>localStorage.setItem('noir-veil-cart', JSON.stringify(items)),[items])
  const add = (product, qty=1, size='50ML') => { setItems(prev=>{ const hit = prev.find(x=>x.id===product.id && x.size===size); if(hit) return prev.map(x=>x.id===product.id && x.size===size ? {...x, qty:x.qty+qty}:x); return [...prev,{...product,qty,size}] }); setOpen(true) }
  const update = (id,size,qty) => setItems(prev=>prev.map(x=>x.id===id && x.size===size ? {...x, qty:Math.max(1,qty)}:x))
  const remove = (id,size) => setItems(prev=>prev.filter(x=>!(x.id===id && x.size===size)))
  const clear = () => setItems([])
  const subtotal = items.reduce((sum,x)=>sum+x.price*x.qty,0)
  const count = items.reduce((sum,x)=>sum+x.qty,0)
  const value = useMemo(()=>({items,open,setOpen,add,update,remove,clear,subtotal,count}),[items,open,subtotal,count])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
const useCart = () => useContext(CartContext)

function BottleArt({ product, small=false }){
  if(product?.set) return <div className="relative z-10 w-[48%] max-w-[220px] aspect-[.72/1] bg-[#171717] border border-[#333] flex items-center justify-center shadow-xl"><div className="absolute top-5 text-white mono text-[11px]">NOIR VEIL</div><div className="grid grid-cols-2 gap-2 w-[66%]">{products.slice(0,8).map(p=><span key={p.id} className="h-8 rounded-sm" style={{background:`linear-gradient(90deg,${p.color},${p.color2})`}} />)}</div><div className="absolute bottom-5 text-white text-center mono text-[9px]">DISCOVERY<br/>SET</div></div>
  if(product?.trio) return <div className="travel relative z-10 w-full text-center">{[products[4],products[2],products[5]].map(p=><span key={p.id} className="bottle" data-name={p.name.split(' ').join('\n')} style={{'--juice':p.color,'--juice2':p.color2}} />)}</div>
  return <div className={`bottle ${small?'!min-w-[62px]':''}`} data-name={(product?.name || 'NOIR VEIL').split(' ').join('\n')} style={{'--juice':product?.color || '#ddd','--juice2':product?.color2 || '#fff'}} />
}

function ProductCard({ product, i=0 }){
  const { add } = useCart()
  return <motion.article initial={{opacity:1,y:0}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:i*.04}} className="product-card min-w-[270px] md:min-w-0">
    <Link to={`/product/${product.id}`} className="card-img h-[300px] md:h-[360px] block"><span className="label">{product.badge}</span><BottleArt product={product}/></Link>
    <Link to={`/product/${product.id}`} className="block pt-5"><h3 className="text-[17px] md:text-[18px] font-extrabold tracking-[.04em] leading-none">{product.name}</h3><p className="mt-2 text-[15px] leading-none">{product.sub}</p></Link>
    <motion.button whileTap={{scale:.97}} onClick={()=>add(product)} className="outline-btn w-full mt-5">ADD <span>·</span> {fmt(product.price)} {product.old && <span className="text-neutral-400 line-through">{fmt(product.old)}</span>}</motion.button>
  </motion.article>
}

function Header(){
  const { count,setOpen } = useCart()
  return <>
    <div className="h-9 bg-[#087fa4] text-white flex items-center justify-center mono text-[11px] md:text-[12px]">NEW: ISLAND SWIM & PARADISE NECTAR →</div>
    <header className="sticky top-0 z-40 bg-[#fafafa]/95 backdrop-blur border-b border-black/0">
      <div className="section-shell h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-10"><Link to="/" className="text-[24px] font-extrabold tracking-[.12em]">NOIR VEIL</Link><nav className="hidden md:flex gap-8 text-[15px]"><Link to="/">Shop</Link><a href="#about">About</a><a href="#membership">Membership</a></nav></div>
        <div className="flex items-center gap-5"><Search size={23}/><User size={22} className="hidden sm:block"/><button onClick={()=>setOpen(true)} className="relative" aria-label="cart"><ShoppingBag size={25}/>{count>0 && <span className="absolute -top-2 -right-2 bg-black text-white rounded-full text-[10px] w-5 h-5 grid place-items-center">{count}</span>}</button></div>
      </div>
    </header>
  </>
}

function Hero(){
  return <section className="section-shell pt-0">
    <Link to={`/product/${products[4].id}`} className="relative overflow-hidden h-[64vh] min-h-[480px] bg-black text-white flex items-end">
      <motion.div initial={{scale:1.04, opacity:.7}} animate={{scale:1,opacity:1}} transition={{duration:.8}} className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,#0b90ba_0,#041e28_24%,#000_55%)]" />
      <div className="absolute inset-y-0 right-0 w-[72%] opacity-95 flex items-center justify-center"><div className="scale-[1.6] md:scale-[2.35] flex gap-12"><BottleArt product={products[4]}/><BottleArt product={products[5]}/></div></div>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,delay:.15}} className="relative z-10 p-8 md:p-12 max-w-[520px]"><p className="mono text-[12px] mb-4">NEW</p><h1 className="text-[34px] md:text-[52px] leading-[.95] font-extrabold tracking-[.03em]">A TROPICAL ESCAPE</h1><p className="mt-4 text-[17px] md:text-[18px]">Introducing Island Swim & Paradise Nectar</p><span className="inline-flex outline-btn border-white text-white px-12 mt-8 hover:bg-white hover:text-black">SHOP NOW</span></motion.div>
    </Link>
  </section>
}

function ProductRail({ title, cta, items=products }){
  return <section className="section-shell py-12 md:py-16">
    <div className="flex items-center justify-between mb-7"><h2 className="fade-title text-[22px] md:text-[26px]">{title}</h2><Link to="/product/missing-person" className="text-sm underline underline-offset-4 text-neutral-400 hover:text-black">{cta}</Link></div>
    <div className="grid grid-flow-col auto-cols-[78%] sm:auto-cols-[42%] lg:auto-cols-[24%] gap-4 md:gap-5 overflow-x-auto pb-3 snap-x">{items.map((p,i)=><div key={p.id} className="snap-start"><ProductCard product={p} i={i}/></div>)}</div>
  </section>
}

function Home(){
  return <main>
    <Hero/>
    <ProductRail title="BEST SELLERS" cta="Shop All" items={[products[7],products[6],products[0],products[1],products[2],products[3]]}/>
    <section id="about" className="section-shell py-8 md:py-12"><motion.h2 initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="max-w-[850px] text-[25px] md:text-[34px] leading-[1.22] fade-title">Modern fragrances inspired by memories and feelings — those intimately personal and universally shared.</motion.h2><Link to="/product/missing-person" className="outline-btn w-[170px] mt-8 text-neutral-300 border-neutral-200">ABOUT US</Link></section>
    <section id="membership" className="section-shell py-10"><div className="relative h-[520px] overflow-hidden bg-[#d8d1cb] flex items-end"><div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_48%,#b78372_0,#d8d1cb_34%,#eee_72%)]"/><div className="absolute right-[10%] bottom-12 scale-[2.8] opacity-90"><BottleArt product={products[2]}/></div><div className="relative z-10 p-8 md:p-12 text-white"><h2 className="text-[30px] md:text-[36px] font-extrabold tracking-[.04em]">MEMBERS GET MORE</h2><p className="mt-3 text-[17px]">Over $200 worth of gifts and savings</p><Link to="/checkout" className="outline-btn border-white text-white w-[150px] mt-8 hover:bg-white hover:text-black">JOIN NOW</Link></div></div></section>
    <ProductRail title="WEAR WHAT'S TRUE" cta="Shop Perfume" items={[products[0],products[1],products[2],products[3],products[5],products[4]]}/>
    <section className="section-shell py-16 md:py-24"><h2 className="fade-title text-[24px] mb-8">FEATURED COLLECTIONS</h2><div className="grid md:grid-cols-3 gap-5"><CollectionCard title="MODERN FINE FRAGRANCE" product={products[0]}/><CollectionCard title="BODY & HAIR MISTS" product={products[4]}/><CollectionCard title="DISCOVERY SETS" product={products[6]}/></div></section>
  </main>
}
function CollectionCard({title,product}){ return <Link to={`/product/${product.id}`} className="relative h-[430px] bg-[#f3f3f3] overflow-hidden flex items-center justify-center group"><div className="absolute inset-x-0 bottom-0 h-[20%] bg-[#ddd]"/><BottleArt product={product}/><div className="absolute inset-0 bg-black/0 group-hover:bg-black/10"/><h3 className="absolute bottom-7 left-7 text-white mono text-[15px] drop-shadow-md">{title}</h3></Link> }

function ProductPage(){
  const { id } = useParams(); const product = products.find(p=>p.id===id) || mainProduct
  const { add } = useCart(); const [size,setSize] = useState(product.sub.includes('Mist')?'FULL':'50ML'); const [open,setOpen] = useState('Description')
  useEffect(()=>{ document.title = `${product.name} — Noir Veil` },[product])
  return <main>
    <section className="section-shell py-8 md:py-10"><nav className="text-[14px] text-neutral-500 flex gap-3 mb-8"><Link to="/">Shop All</Link><span>›</span><Link to="/">Perfume</Link><span>›</span><span>{product.name.replaceAll(' ',' ')}</span></nav>
      <div className="grid lg:grid-cols-[1.08fr_.92fr] gap-8 md:gap-12 items-start">
        <div><div className="card-img min-h-[520px] md:min-h-[720px]"><span className="label">{product.badge}</span><BottleArt product={product}/><div className="absolute bottom-8 left-8 z-10 flex gap-2">{[0,1,2,3,4].map((_,i)=><span key={i} className={`w-1.5 h-1.5 ${i===0?'bg-black':'bg-black/25'}`}/>)}</div></div></div>
        <aside className="lg:sticky lg:top-28">
          <div className="flex justify-between items-start gap-6"><div><h1 className="text-[28px] md:text-[31px] leading-none font-extrabold tracking-[.04em]">{product.name}</h1><p className="mt-3 text-[15px]">{product.sub}</p></div><button className="font-bold whitespace-nowrap flex items-center gap-2"><Star size={15} fill="black"/> {product.rating} <span className="text-neutral-500">({product.reviews})</span></button></div>
          <p className="mt-7 border-l border-[#d9a08b] pl-3 text-[15px]">{product.quote}</p>
          <div className="mt-8"><p className="mb-3">Size</p><div className="flex flex-wrap gap-2">{['100ML','50ML','9.5ML','DUET'].map(s=><button key={s} onClick={()=>setSize(s)} className={`h-10 px-5 border mono text-[11px] ${size===s?'border-black bg-white':'border-neutral-300'}`}>{s}</button>)}</div></div>
          <div className="mt-7"><div className="flex justify-between"><p>Scent</p><div className="flex gap-5 text-neutral-500"><span>‹</span><span>›</span></div></div><div className="grid grid-cols-5 gap-2 mt-3">{products.slice(0,5).map(p=><Link key={p.id} to={`/product/${p.id}`} className={`card-img !min-h-[94px] h-[94px] ${p.id===product.id?'ring-1 ring-black':''}`}><BottleArt product={p} small/></Link>)}</div><p className="mt-3 text-[13px]">{product.name} <span className="text-neutral-400">{product.type}</span></p></div>
          <button className="mt-7 bg-[#eee] rounded-full px-5 py-3 text-[14px]">Get 10% cashback with Membership ›</button>
          <motion.button whileTap={{scale:.97}} onClick={()=>add(product,1,size)} className="black-btn w-full mt-6">ADD TO BAG <span>·</span> {fmt(product.price)}</motion.button>
          <div className="mt-7 border-t border-neutral-300">{['Description','Notes','Ingredients'].map(name=><Accordion key={name} name={name} open={open} setOpen={setOpen}>{name==='Description'?product.description:name==='Notes'?product.notes.join(' / '):'Alcohol Denat., Fragrance, Water, Benzyl Salicylate, Linalool. Demo ingredient list.'}</Accordion>)}</div>
          <div className="mt-8"><p className="mb-4">Layer It With</p><div className="grid grid-cols-2 gap-5">{[products[6],products[7]].map((p,i)=><ProductCard key={p.id} product={p} i={i}/>)}</div></div>
        </aside>
      </div>
    </section>
    <ScentNotes product={product}/>
    <ProductRail title="MODERN FINE FRAGRANCE" cta="Shop Perfume" items={products.slice(0,6)}/>
    <Reviews/>
    <ProductRail title="YOU MAY ALSO LIKE" cta="Shop All" items={[products[4],products[7],products[5],products[6],products[1]]}/>
  </main>
}
function Accordion({name,open,setOpen,children}){ const active=open===name; return <div className="border-b border-neutral-300"><button onClick={()=>setOpen(active?'':name)} className="w-full py-5 flex justify-between text-left"><span>{name}</span>{active?<Minus/>:<Plus/>}</button><AnimatePresence>{active && <motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden pb-5 text-[15px] leading-7">{children}</motion.p>}</AnimatePresence></div> }
function ScentNotes({product}){ return <section className="section-shell py-24 md:py-32 relative overflow-hidden"><h2 className="fade-title text-[24px] mb-12">SCENT NOTES</h2><div className="grid md:grid-cols-3 gap-10 max-w-[850px]">{['TOP','HEART','BASE'].map((t,i)=><div key={t}><h4 className="mono text-[11px] text-neutral-300 mb-5">{t}</h4><div className="text-[20px] md:text-[24px] leading-10 text-neutral-200">{product.notes.slice(i*2,i*2+2).map(n=><p key={n}>{n}</p>)}</div></div>)}</div><div className="absolute right-[12%] top-[22%] opacity-[.06] scale-[4]"><BottleArt product={product}/></div></section> }
function Reviews(){ const reviews=['I get so many compliments on this perfume. I layer it with the oil ❤️','Smells so good. A clean scent to layer with other perfumes.','This is a great fragrance. I will buy this scent again.','It became my favorite perfume.']; return <section className="bg-[#f3f3f3] py-20 md:py-28"><div className="max-w-[820px] mx-auto px-5"><div className="flex items-center justify-between"><div><p className="text-[34px] font-bold flex items-center gap-3"><Star fill="black"/>4.8</p><p className="mt-7">Reviews Summary ✨</p><p className="mt-4 leading-7">Customers say these perfumes are soft, warm and comforting with a clean modern finish. Many describe the collection as easy to layer and compliment-worthy.</p></div><button className="outline-btn px-8 hidden md:flex">WRITE A REVIEW</button></div><div className="mt-10 border-t border-neutral-300">{reviews.map((r,i)=><div key={r} className="py-8 border-b border-neutral-300"><div className="flex justify-between"><span>★★★★★</span><span className="text-sm text-neutral-500">{i+3} days ago</span></div><p className="mt-5">{r}</p><p className="mt-5 font-medium">{['Angela','Stephanie A.','Jamie','Hilary'][i]}</p><p className="text-sm text-neutral-500">Verified Buyer</p></div>)}</div><button className="outline-btn px-10 mx-auto mt-10">SHOW MORE</button></div></section> }

function CartDrawer(){
  const { open,setOpen,items,update,remove,subtotal } = useCart(); const navigate=useNavigate(); const left=Math.max(0,100-subtotal)
  return <AnimatePresence>{open && <><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} className="fixed inset-0 bg-black/30 z-50"/><motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:260}} className="fixed right-0 top-0 bottom-0 z-50 bg-[#fafafa] w-full max-w-[460px] flex flex-col"><div className="h-16 px-6 flex items-center justify-between border-b"><h2 className="text-xl font-extrabold tracking-[.05em]">CART</h2><button onClick={()=>setOpen(false)}><X/></button></div>{items.length===0?<div className="flex-1 grid place-items-center text-center px-8"><div><ShoppingBag className="mx-auto mb-4"/><p>Your bag is empty.</p><Link onClick={()=>setOpen(false)} to="/" className="outline-btn px-10 mt-7">KEEP SHOPPING</Link></div></div>:<><div className="p-5"><div className="bg-white border p-4"><p className="mono text-[11px]">{left>0?`ADD ${fmt(left)} FOR FREE DELIVERY`:'FREE DELIVERY UNLOCKED'}</p><div className="h-1 bg-neutral-200 mt-3"><div className="h-full bg-black" style={{width:`${Math.min(100,subtotal)}%`}} /></div></div></div><div className="flex-1 overflow-auto px-5 space-y-5">{items.map(item=><div key={item.id+item.size} className="grid grid-cols-[96px_1fr] gap-4 border-b pb-5"><div className="card-img !min-h-[110px] h-[110px]"><BottleArt product={item} small/></div><div><div className="flex justify-between gap-3"><div><h3 className="font-extrabold tracking-[.04em]">{item.name}</h3><p className="text-sm text-neutral-500">{item.size} · {item.sub}</p></div><button onClick={()=>remove(item.id,item.size)}><X size={16}/></button></div><div className="flex items-center justify-between mt-5"><div className="flex border h-9"><button onClick={()=>update(item.id,item.size,item.qty-1)} className="w-9 grid place-items-center"><Minus size={14}/></button><span className="w-9 grid place-items-center text-sm">{item.qty}</span><button onClick={()=>update(item.id,item.size,item.qty+1)} className="w-9 grid place-items-center"><Plus size={14}/></button></div><b>{fmt(item.price*item.qty)}</b></div></div></div>)}</div><div className="border-t p-5"><div className="flex justify-between font-bold mb-4"><span>Subtotal</span><span>{fmt(subtotal)}</span></div><button onClick={()=>{setOpen(false);navigate('/checkout')}} className="black-btn w-full">CHECKOUT</button><button onClick={()=>setOpen(false)} className="outline-btn w-full mt-3">CONTINUE SHOPPING</button></div></>}</motion.aside></>}</AnimatePresence>
}

function Checkout(){
  const { items,subtotal,clear } = useCart(); const [done,setDone]=useState(false); const shipping=subtotal>100||subtotal===0?0:8
  if(done) return <main className="section-shell min-h-[70vh] py-20 grid place-items-center text-center"><div><CheckCircle2 size={60} className="mx-auto mb-5"/><h1 className="text-3xl font-extrabold tracking-[.05em]">ORDER CONFIRMED</h1><p className="mt-4 text-neutral-600">Demo checkout complete. Your Noir Veil confirmation is ready.</p><Link to="/" onClick={clear} className="black-btn px-12 mt-8">BACK TO SHOP</Link></div></main>
  return <main className="section-shell py-10 md:py-16"><h1 className="fade-title text-[26px] mb-8">CHECKOUT</h1><div className="grid lg:grid-cols-[1fr_420px] gap-10"><form onSubmit={(e)=>{e.preventDefault();setDone(true)}} className="space-y-8"><CheckoutBlock title="Contact"><div className="grid md:grid-cols-2 gap-4"><Input label="First name" required/><Input label="Last name" required/><Input label="Email" type="email" required/><Input label="Phone" required/></div></CheckoutBlock><CheckoutBlock title="Delivery"><div className="grid gap-4"><Input label="Address" required/><div className="grid md:grid-cols-3 gap-4"><Input label="City" required/><Input label="State"/><Input label="Zip code" required/></div></div></CheckoutBlock><CheckoutBlock title="Payment"><div className="grid gap-3">{['Credit Card','Pay in 4','Apple Pay','Cash on Delivery'].map((p,i)=><label key={p} className="border p-4 flex items-center gap-3 bg-white"><input type="radio" name="pay" defaultChecked={i===0}/><span>{p}</span></label>)}</div></CheckoutBlock><button className="black-btn w-full md:w-[320px]">PLACE ORDER · {fmt(subtotal+shipping)}</button></form><aside className="bg-white border p-5 h-fit lg:sticky lg:top-28"><h2 className="font-extrabold tracking-[.05em] mb-5">ORDER SUMMARY</h2>{items.length===0?<p className="text-neutral-500">Your cart is empty. Add a perfume to preview totals.</p>:items.map(item=><div key={item.id+item.size} className="flex gap-4 border-b py-4"><div className="card-img !min-h-[86px] h-[86px] w-[76px]"><BottleArt product={item} small/></div><div className="flex-1"><p className="font-bold">{item.name}</p><p className="text-sm text-neutral-500">Qty {item.qty} · {item.size}</p></div><b>{fmt(item.price*item.qty)}</b></div>)}<div className="space-y-3 mt-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{shipping?fmt(shipping):'Free'}</span></div><div className="flex justify-between text-lg font-bold border-t pt-4"><span>Total</span><span>{fmt(subtotal+shipping)}</span></div></div></aside></div></main>
}
function CheckoutBlock({title,children}){ return <section><h2 className="text-xl font-extrabold tracking-[.05em] mb-4">{title}</h2>{children}</section> }
function Input({label,type='text',required=false}){ return <label className="block"><span className="text-sm text-neutral-600">{label}</span><input type={type} required={required} className="mt-2 w-full h-12 px-4 bg-white border border-neutral-300 outline-none focus:border-black"/></label> }

function Footer(){ return <footer className="section-shell py-12 bg-[#f5f5f5] text-neutral-500"><div className="grid md:grid-cols-4 gap-8"><div><h3 className="text-black font-extrabold tracking-[.12em] text-xl">NOIR VEIL</h3><p className="mt-4 max-w-xs">Modern fine fragrance with clean lines, intimate scent stories and polished ecommerce flow.</p></div><div><p className="text-black mb-3">Shop</p><p>Perfume</p><p>Body Mist</p><p>Discovery Sets</p></div><div><p className="text-black mb-3">Support</p><p>Shipping</p><p>Returns</p><p>Membership</p></div><div><p className="text-black mb-3">Newsletter</p><div className="flex mt-3"><input placeholder="Email" className="h-11 px-3 bg-white border flex-1"/><button className="outline-btn px-4 h-11">JOIN</button></div></div></div><div className="mt-12 flex justify-between text-xs"><span>©2026 Noir Veil</span><span>United States · USD $ · English</span></div></footer> }
function Shell(){ const location=useLocation(); useEffect(()=>window.scrollTo(0,0),[location.pathname]); return <><Header/><CartDrawer/><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.28,ease:'easeOut'}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes></motion.div></AnimatePresence><Footer/></> }
export default function App(){ return <CartProvider><Shell/></CartProvider> }
