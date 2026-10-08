"use client";

// Adapted from Aceternity UI Floating Dock (official registry).
// Uses this project's Framer Motion/Lucide dependencies and filter buttons.
import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WavyBackground } from './wavy-background';

export type FloatingDockItem = { title: string; icon: ReactNode; href: string };
type Props = { items: FloatingDockItem[]; activeTitle?: string; onSelect?: (title: string) => void; desktopClassName?: string; mobileClassName?: string; paused?: boolean };
export function FloatingDock({ items, activeTitle, onSelect, desktopClassName, mobileClassName, paused }: Props) {
  const mouseX = useMotionValue(Infinity);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  return <div className="portfolio-floating-dock">
    <motion.div className={cn('floating-dock-desktop', desktopClassName)} onMouseMove={e => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(Infinity)} role="group" aria-label="Filter portfolio">
      <WavyBackground paused={paused} />
      {items.map(item => <IconContainer key={item.title} item={item} mouseX={mouseX} active={activeTitle === item.title} onSelect={onSelect} />)}
    </motion.div>
    <div className={cn('floating-dock-mobile', mobileClassName)}>
      <button ref={toggle} type="button" className="floating-dock-toggle" aria-expanded={open} aria-controls="portfolio-category-menu" onClick={() => setOpen(v => !v)}><WavyBackground paused={paused} /><span>{activeTitle || 'Portfolio categories'}</span> <ChevronDown size={18} style={{transform:open?'rotate(180deg)':undefined}} /></button>
      <AnimatePresence>{open && <motion.div id="portfolio-category-menu" className="floating-dock-menu" role="group" aria-label="Filter portfolio" initial={reduced?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}>
        {items.map(item => <button type="button" key={item.title} aria-pressed={activeTitle===item.title} onClick={() => {onSelect?.(item.title);setOpen(false);toggle.current?.focus();}}>{item.icon}<span>{item.title}</span></button>)}
      </motion.div>}</AnimatePresence>
    </div>
  </div>;
}

function IconContainer({item,mouseX,active,onSelect}:{item:FloatingDockItem;mouseX:MotionValue<number>;active:boolean;onSelect?:Props['onSelect']}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const [focused,setFocused] = useState(false);
  const distance = useTransform(mouseX, value => {const bounds=ref.current?.getBoundingClientRect();return bounds?value-bounds.x-bounds.width/2:Infinity;});
  const dimension = useTransform(distance, [-150,0,150], [46,68,46]);
  const size = useSpring(dimension,{mass:.1,stiffness:150,damping:12});
  return <div className="floating-dock-item">
    <motion.button ref={ref} type="button" aria-label={item.title} aria-pressed={active} style={{width:reduced?46:size,height:reduced?46:size}} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onClick={()=>onSelect?onSelect(item.title):window.location.assign(item.href)} className={cn('floating-dock-icon', focused && 'is-focused')}>{item.icon}</motion.button>
    <span className="floating-dock-label" aria-hidden="true">{item.title}</span>
  </div>;
}
