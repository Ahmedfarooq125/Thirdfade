import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import type { Review } from '@/data/reviews';

// Adapted from Aceternity's Apple Cards Carousel for the existing review layout.
// Native scrolling and dialogs provide touch, keyboard and focus support.
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
  return <><p className="review-browse-hint" id="review-browse-hint">Swipe or drag to explore · Select a review to view its screenshot</p>
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

function ScreenshotCrop({ review, avatar = false }: { review: Review; avatar?: boolean }) {
  const [sourceWidth, sourceHeight] = review.dimensions;
  const [x, y, width] = avatar ? review.avatar : [review.card[0], 0, review.card[1]];
  const height = avatar ? width : sourceHeight;
  const style: CSSProperties = { aspectRatio: `${width}/${height}` };
  const imageStyle: CSSProperties = { width: `${sourceWidth / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` };
  return <span className={avatar ? 'review-avatar' : 'review-source-image'} style={style} aria-hidden={avatar || undefined}>
    <img src={review.source} style={imageStyle} alt={avatar ? '' : `Supplied review screenshot from ${review.name}`} loading="lazy" decoding="async" draggable={false} />
  </span>;
}

export function Card({ review }: { review: Review }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const backdropPress = useRef(false);
  const bodyOverflow = useRef('');
  useEffect(() => () => { if (dialog.current?.open) document.body.style.overflow = bodyOverflow.current; }, []);
  const open = () => { backdropPress.current = false; bodyOverflow.current = document.body.style.overflow; dialog.current?.showModal(); document.body.style.overflow = 'hidden'; };
  const close = () => dialog.current?.close();
  return <>
    <article className="review-card">
      <div className="review-person"><ScreenshotCrop review={review} avatar /><div><h3>{review.name}</h3><span>{review.date}</span></div><span className="review-quote" aria-hidden="true">“</span></div>
      <div className="review-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} fill="currentColor" aria-hidden="true" />)}</div>
      <p>{review.quote}</p>
      <div className="review-bottom"><span>Google review</span><button ref={trigger} type="button" onClick={open} aria-haspopup="dialog" aria-label={`View review from ${review.name}`}>View review <span aria-hidden="true">+</span></button></div>
    </article>
    <dialog ref={dialog} className="review-dialog" aria-labelledby={`review-${review.name.replaceAll(' ', '-').toLowerCase()}`} onClose={() => { document.body.style.overflow = bodyOverflow.current; trigger.current?.focus({ preventScroll: true }); }}
      onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
      onPointerUp={event => { if (backdropPress.current && event.target === event.currentTarget) close(); backdropPress.current = false; }}
      onPointerCancel={() => { backdropPress.current = false; }}>
      <div className="review-dialog-content"><button className="review-dialog-close" type="button" onClick={close} aria-label="Close review" autoFocus><X size={20} /></button>
        <span className="eyebrow">Client review</span><h3 id={`review-${review.name.replaceAll(' ', '-').toLowerCase()}`}>{review.name}</h3><p className="review-dialog-date">{review.date} · Google review</p>
        <p className="review-dialog-quote">{review.quote}</p><ScreenshotCrop review={review} />
        <p className="review-source-note">Original screenshot supplied by ThirdFade. Text is shown as captured.</p>
      </div>
    </dialog>
  </>;
}
