import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Layers, MessageSquare, Home, Grid2X2, Mail, Pause, Play, Globe, ShoppingBag, Palette, Search, Megaphone, Smartphone, Bot } from 'lucide-react';
import { LiquidChrome } from '@/components/hero/LiquidChrome';
import { OrbitCardStack, type OrbitStackItem } from '@/components/ui/orbit-card-stack';
import { MagneticDock } from '@/components/ui/magnetic-dock';
import { FloatingDock } from '@/components/ui/floating-dock';
import { ContactForm } from '@/components/ContactForm';

import DepthText from '@/components/DepthText';
import { Carousel, Card as ReviewCard } from '@/components/ui/apple-cards-carousel';
import { reviews } from '@/data/reviews';
import { portfolio, type PortfolioItem } from '@/data/portfolio';
import './components/hero/liquid-chrome.css';



const firstPortfolioImage = (category: string) => portfolio.find(item => item.type === category)?.image;
const services: OrbitStackItem[] = [
  { name: 'Brand identity', role: '01 / Make your mark', description: 'A clear story. A distinctive identity. A brand that feels like you at every touchpoint.', initials: 'BI', stat: 'Strategy · Identity · Art direction', accent: '#eeeeee', href: '#work', portfolioCategory: 'Branding', image: firstPortfolioImage('Branding') },
  { name: 'Website design', role: '02 / Build your presence', description: 'Thoughtful, responsive websites that turn a first impression into a lasting connection.', initials: 'WD', stat: 'UX · UI · Development', accent: '#eeeeee', href: '#work', portfolioCategory: 'Website', image: firstPortfolioImage('Website') },
  { name: 'Mobile apps', role: '03 / Put ideas in motion', description: 'Intuitive digital products designed around real people and the things they need to do.', initials: 'MA', stat: 'Product · Interface · Prototyping', accent: '#eeeeee', href: '#work', portfolioCategory: 'Apps', image: firstPortfolioImage('Apps') },
  { name: 'E-commerce', role: '04 / Make shopping simple', description: 'Distinctive storefronts with clear product journeys and considered checkout experiences.', initials: 'EC', stat: 'Storefronts · Commerce · Conversion', accent: '#eeeeee', href: '#work', portfolioCategory: 'E-commerce', image: firstPortfolioImage('E-commerce') },
  { name: 'SEO & growth', role: '05 / Be found', description: 'Search-friendly foundations and useful content that help the right people discover you.', initials: 'SG', stat: 'Technical SEO · Content · Analytics', accent: '#eeeeee', href: '#work', portfolioCategory: 'SEO', image: firstPortfolioImage('SEO') },
];
const filters = [{title:'Website',icon:Globe},{title:'E-commerce',icon:ShoppingBag},{title:'Branding',icon:Palette},{title:'SEO',icon:Search},{title:'Meta Ads',icon:Megaphone},{title:'Apps',icon:Smartphone},{title:'AI Automation',icon:Bot}];
function Reveal({children,className=''}:{children:ReactNode;className?:string}) { const reduced=useReducedMotion(); return <motion.div className={className} initial={reduced?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:.6,ease:[.22,1,.36,1]}}>{children}</motion.div>; }
function Concept({shop=false}:{shop?:boolean}) { return <div className={`concept ${shop?'concept-shop':''}`} aria-label={shop?'Placeholder e-commerce website design':'Placeholder studio website design'} role="img"><div className="concept-nav"><span>{shop?'FORM / OBJECTS':'STUDIO / 01'}</span><span>Explore ↗</span></div><div className="concept-main"><span className="concept-label">{shop?'CONSIDERED ESSENTIALS':'AN INDEPENDENT CREATIVE PRACTICE'}</span><strong>{shop?<>Less, but<br/>better.</>:<>Ideas with<br/>a point of view.</>}</strong><span className="concept-pill">{shop?'Explore the collection':'Selected projects'} ↗</span></div><div className="concept-sculpture"><i/><i/><i/></div><div className="concept-bottom">{shop?'Made for the way you live.':'Strategy meets imagination.'}<span>01 — 03</span></div></div>; }

function PortfolioImage({ item }: { item: PortfolioItem }) {
  if (!item.crop) return <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />;
  const { x, y, width, height, imageWidth } = item.crop;
  return <div className="portfolio-crop" style={{ aspectRatio: `${width}/${height}` }}><img src={item.image} alt={item.alt} loading="lazy" decoding="async" style={{ width: `${imageWidth / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} /></div>;
}

export default function App(){
  const reduced=useReducedMotion(); const [paused,setPaused]=useState(false); const [active,setActive]=useState('top');
  const [service,setService]=useState(services[0]); const [filter,setFilter]=useState<string>('Website');
  const [spread,setSpread]=useState(142); const offerStage=useRef<HTMLDivElement>(null);
  useEffect(()=>{const node=offerStage.current;if(!node)return;const observer=new ResizeObserver(([entry])=>setSpread(entry.contentRect.width<700?0:Math.min(156,(entry.contentRect.width-370)/4)));observer.observe(node);return()=>observer.disconnect();},[]);
  useEffect(()=>{const update=()=>{const sections=Array.from(document.querySelectorAll<HTMLElement>('main > section[id]')); let id='top';for(const section of sections){if(section.getBoundingClientRect().top<=window.innerHeight*.4)id=section.id;}setActive(id);};update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
  const navigate=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:reduced?'instant':'smooth'});history.replaceState(null,'',`#${id}`);setActive(id);};
  const dockItems=[{id:'top',label:'Home',icon:<Home/>},{id:'services',label:'Services',icon:<Layers/>},{id:'work',label:'Portfolio',icon:<Grid2X2/>},{id:'reviews',label:'Reviews',icon:<MessageSquare/>},{id:'contact',label:'Get in touch',icon:<Mail/>}].map(item=>({...item,isActive:active===item.id,onClick:()=>navigate(item.id)}));
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="chrome-backdrop" aria-hidden="true"><LiquidChrome paused={paused||!!reduced}/></div>
    <nav className="site-dock" aria-label="Main navigation"><MagneticDock items={dockItems} iconSize={46} maxScale={1.3} magneticDistance={120} variant="glass"/><div className="dock-caption" aria-hidden="true">{dockItems.find(item=>item.id===active)?.label}</div></nav>
    <main id="main">
      <section className="hero chrome-hero" id="top" aria-labelledby="hero-title">
        <div className="hero-meta page-gutter"><a className="brand-logo-link brand-logo-frame" href="#top" aria-label="ThirdFade home"><img className="brand-logo" src="./assets/brand/thirdfade-transparent.png" alt="ThirdFade" width="1672" height="941" decoding="async" /></a><a href="#contact">Let’s talk <ArrowUpRight size={16}/></a></div>
        <div className="chrome-ui"><div className="chrome-content"><p className="chrome-badge">Web &amp; Marketing</p><h1 className="chrome-title" id="hero-title"><span className="chrome-title-line chrome-static-text">Memorable</span><DepthText text="by design" layers={34} depth={2.4} faceColor="#454545" depthColor="#111111" tilt={7.5} pointerTracking smoothing={0.14} perspective={900} autoOrbit orbitSpeed={0.35} fontSize="var(--hero-title-size)" fontWeight={800} shadow className="chrome-depth-text" paused={paused}/></h1><p className="chrome-description">Websites, apps, branding and marketing built on strategy, designed to turn clicks into clients</p><div className="chrome-actions"><a className="chrome-button chrome-button-primary" href="#contact">Start a project <ArrowUpRight size={18}/></a><a className="chrome-button chrome-button-secondary" href="#work">Explore our work <ArrowUpRight size={18}/></a></div></div></div>

      </section>
      <section className="offering section-shell new-section" id="services" aria-labelledby="offer-title"><div className="container"><Reveal className="new-section-head"><div><span className="eyebrow">01 / Services</span><h2 id="offer-title">Whatever you need,<br/><em>we build it.</em></h2></div><p>Creative and digital services for businesses to grow</p></Reveal><div className="offer-stage" ref={offerStage}><OrbitCardStack items={services} defaultActiveIndex={0} spread={spread} lift={38} onActiveChange={setService} onNavigate={item=>{setFilter(item.portfolioCategory || "Website");navigate("work");}} className="offer-stack" cardClassName="offer-card"/></div><div className="offer-selected"><div><span className="eyebrow">Explore the deck</span><p aria-live="polite">{service.name} <span>— {service.stat}</span></p></div><a className="inline-cta" href="#contact">Let’s build it <ArrowUpRight size={20}/></a></div></div></section>
      <section className="portfolio-section section-shell new-section" id="work" aria-labelledby="portfolio-title"><div className="container"><Reveal className="new-section-head"><div><span className="eyebrow">02 / Our portfolio</span><h2 id="portfolio-title">Work that speaks<br/><em>for itself</em></h2></div><p>A selection of websites, apps, brand identities, marketing dashboards and AI automation concepts. Explore the details, ideas and visual systems behind each direction.</p></Reveal><FloatingDock items={filters.map(({title,icon:Icon})=>({title,icon:<Icon size={23}/>,href:"#work"}))} activeTitle={filter} onSelect={setFilter} paused={paused}/><p className="portfolio-category">{filter}</p><p className="sr-only" aria-live="polite">{portfolio.filter(item=>item.type===filter).length} projects shown</p><div className="portfolio-grid">{portfolio.filter(item=>item.type===filter).map((item,index)=><Reveal className="portfolio-card" key={item.title}><div className={`portfolio-art ${item.image ? "portfolio-image-art" : ""}`}>{item.image?<PortfolioImage item={item}/>:<Concept shop={item.mockup==='shop'}/>}<span className="project-index">{String(index+1).padStart(2,'0')}</span></div><div className="portfolio-caption"><div><p>{item.label}</p><h3>{item.title}</h3></div><span>{item.type}</span></div></Reveal>)}</div>{!portfolio.some(item=>item.type===filter)&&<div className="portfolio-empty"><h3>{filter} projects are on the way.</h3><p>We’re preparing this part of our portfolio.</p><a className="inline-cta" href="#contact">Discuss your project <ArrowUpRight size={18}/></a></div>}</div></section>
      <section className="reviews-section section-shell new-section" id="reviews" aria-labelledby="reviews-title"><div className="container"><Reveal className="new-section-head"><div><span className="eyebrow">03 / Reviews</span><h2 id="reviews-title">Built for them.<br/><em>Backed by them.</em></h2></div><p>Client perspectives on working with ThirdFade.</p></Reveal><Carousel items={reviews.map(review => <ReviewCard review={review} key={review.name}/>)}/><a href="#contact" className="inline-cta review-cta">Start a conversation <ArrowUpRight size={20}/></a></div></section>
      <section className="contact-section section-shell new-section" id="contact" aria-labelledby="contact-title"><div className="container"><Reveal className="contact-intro"><span className="eyebrow">04 / Get in touch</span><h2 id="contact-title">Let’s build something<br/><em>great together.</em></h2><p><a className="inline-cta discovery-cta" href="#discovery-form">Book your free discovery call <ArrowRight size={20}/></a></p></Reveal><Reveal><div id="discovery-form"><ContactForm/></div></Reveal></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-top"><p>Strategy. Creativity. Design.<br/>Made to mean more.</p><a href="#top">Back to top ↑</a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} ThirdFade</span><span className="brand-logo-frame brand-logo-footer"><img className="brand-logo" src="./assets/brand/thirdfade-transparent.png" alt="ThirdFade" width="1672" height="941" loading="lazy" decoding="async" /></span></div></footer>
    {!reduced&&<button className="chrome-motion" type="button" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={14}/>:<Pause size={14}/>}<span>{paused?'Resume motion':'Pause motion'}</span></button>}
  </>;
}


