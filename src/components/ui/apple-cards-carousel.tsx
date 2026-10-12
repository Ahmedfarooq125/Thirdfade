import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Review } from '@/data/reviews';

// Adapted from Aceternity's Apple Cards Carousel for the existing review layout.
// Native scrolling provides touch, drag and keyboard support.
export function Carousel({ items, initialScroll = 0 }: { items: ReactNode[]; initialScroll?: number }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => { if (track.current) track.current.scrollLeft = initialScroll; }, [initialScroll]);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const el = event.currentTarget;
    const step = (el.firstElementChild?.getBoundingClientRect().width || 300) + 20;
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      el.scrollTo({ left: event.key === 'Home' ? 0 : event.key === 'End' ? el.scrollWidth
        : el.scrollLeft + (event.key === 'ArrowRight' ? step : -step), behavior: reduced ? 'instant' : 'smooth' });
    }
  };
  return <><p className="review-browse-hint" id="review-browse-hint">Swipe or drag to explore</p>
    <div className="review-track apple-review-carousel" ref={track} tabIndex={0} role="region" aria-label="Client reviews carousel" aria-describedby="review-browse-hint" onKeyDown={onKeyDown}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0 || (event.target as HTMLElement).closest('button, dialog')) return;
        drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft };
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = 'true';
      }}
      onPointerMove={event => { if (drag.current) { event.currentTarget.scrollLeft = drag.current.scroll - (event.clientX - drag.current.x); event.preventDefault(); } }}
      onPointerUp={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
      onPointerCancel={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
      onLostPointerCapture={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}>
      {items.map((item, index) => <motion.div className="review-carousel-item" key={index} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .45, delay: Math.min(index * .06, .2) }}>{item}</motion.div>)}
    </div></>;
}

function ReviewAvatar({ review }: { review: Review }) {
  const [sourceWidth] = review.dimensions;
  const [x, y, width] = review.avatar;
  const height = width;
  const style: CSSProperties = { aspectRatio: `${width}/${height}` };
  const imageStyle: CSSProperties = { width: `${sourceWidth / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` };
  return <span className="review-avatar" style={style} aria-hidden="true">
    <img src={review.source} style={imageStyle} alt="" loading="lazy" decoding="async" draggable={false} />
  </span>;
}

export function Card({ review }: { review: Review }) {
  return <article className="review-card">
      <div className="review-person"><ReviewAvatar review={review} /><div><h3>{review.name}</h3><span>{review.date}</span></div><span className="review-quote" aria-hidden="true">“</span></div>
      <div className="review-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} fill="currentColor" aria-hidden="true" />)}</div>
      <p>{review.quote}</p>
      <div className="review-bottom"><span>Google review</span></div>
    </article>;
}
