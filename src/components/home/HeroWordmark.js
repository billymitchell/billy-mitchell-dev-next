'use client';

import { useEffect, useRef } from 'react';
import { wordmark } from '../utilities/site';

export default function HeroWordmark() {
  const titleRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    const logo = document.querySelector('.home .logo');
    if (!logo) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    function update() {
      frame = 0;
      // The wrapper stays in flow so measuring it is independent of the animation.
      const start = title.parentElement.getBoundingClientRect();
      const end = logo.getBoundingClientRect();
      const travel = Math.max(1, start.top + window.scrollY - end.bottom);
      const progress = Math.max(0, Math.min(1, window.scrollY / travel));
      const reveal = Math.max(0, (progress - .7) / .3);

      logo.style.setProperty('--wordmark-opacity', motion.matches ? '1' : String(reveal));
      title.style.opacity = motion.matches ? '' : String(1 - reveal);
      if (motion.matches || progress === 1) {
        title.style.transform = '';
        return;
      }

      const compactScale = Math.max(.12, Math.min(.4, end.width / start.width, end.height / start.height));
      const scale = 1 + (compactScale - 1) * progress;
      const x = (end.left - start.left) * progress;
      const y = (end.bottom - start.top) * progress;
      title.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const resize = new ResizeObserver(schedule);
    resize.observe(title.parentElement);
    resize.observe(logo);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    update();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
      logo.style.removeProperty('--wordmark-opacity');
    };
  }, []);

  return (
    <div className="hero-wordmark">
      <h1 ref={titleRef}>{wordmark}</h1>
    </div>
  );
}
