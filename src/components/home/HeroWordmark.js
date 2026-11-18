'use client';

import { useEffect, useRef } from 'react';
import { wordmark } from '../utilities/site';

const SAMPLES = 24;

export default function HeroWordmark() {
  const titleRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    const logo = document.querySelector('.home .logo');
    if (!logo) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Scroll-linked animations run in step with native scrolling (off the main thread where supported),
    // which keeps the wordmark smooth during touch momentum scrolling.
    const scrollLinked = typeof window.ScrollTimeline === 'function';
    let frame = 0;
    let animation = null;
    let geometry = null;

    function measure() {
      // The wrapper stays in flow so measuring it is independent of the animation.
      const start = title.parentElement.getBoundingClientRect();
      const end = logo.getBoundingClientRect();
      const startTop = start.top + window.scrollY;
      return {
        start, end, startTop,
        travel: Math.max(1, startTop - end.bottom),
        compactScale: Math.max(.12, Math.min(.4, end.width / start.width, end.height / start.height)),
      };
    }

    // Wordmark state at a given scroll position, in the wrapper's own coordinates.
    function stateAt(scroll, { start, end, startTop, travel, compactScale }) {
      const progress = Math.max(0, Math.min(1, scroll / travel));
      const reveal = Math.max(0, (progress - .7) / .3);
      const x = (end.left - start.left) * progress;
      const y = (end.bottom - (startTop - scroll)) * progress;
      return { progress, reveal, x, y, scale: 1 + (compactScale - 1) * progress };
    }

    function updateLogo() {
      frame = 0;
      if (!geometry) return;
      const { reveal } = stateAt(window.scrollY, geometry);
      logo.style.setProperty('--wordmark-opacity', motion.matches ? '1' : String(reveal));
    }

    function updateTitle() {
      if (motion.matches || !geometry) {
        title.style.opacity = '';
        title.style.transform = '';
        return;
      }
      const { progress, reveal, x, y, scale } = stateAt(window.scrollY, geometry);
      title.style.opacity = String(1 - reveal);
      title.style.transform = progress === 1 ? '' : `translate(${x}px, ${y}px) scale(${scale})`;
    }

    function buildAnimation() {
      animation?.cancel();
      animation = null;
      if (motion.matches || !geometry) return;
      const root = document.documentElement;
      const maxScroll = root.scrollHeight - root.clientHeight;
      if (maxScroll <= 0) return;
      const end = Math.min(geometry.travel, maxScroll);
      const keyframes = [];
      for (let index = 0; index <= SAMPLES; index++) {
        const scroll = end * index / SAMPLES;
        const { reveal, x, y, scale } = stateAt(scroll, geometry);
        keyframes.push({
          offset: scroll / maxScroll,
          opacity: 1 - reveal,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
        });
      }
      if (keyframes.at(-1).offset < 1) keyframes.push({ ...keyframes.at(-1), offset: 1 });
      title.style.opacity = '';
      title.style.transform = '';
      animation = title.animate(keyframes, {
        fill: 'both',
        easing: 'linear',
        timeline: new window.ScrollTimeline({ source: root, axis: 'block' }),
      });
    }

    function refresh() {
      animation?.cancel();
      animation = null;
      title.style.transform = '';
      geometry = measure();
      if (scrollLinked) buildAnimation();
      else updateTitle();
      updateLogo();
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (!scrollLinked) updateTitle();
        updateLogo();
      });
    }

    let refreshFrame = 0;
    function scheduleRefresh() {
      if (!refreshFrame) refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0;
        refresh();
      });
    }

    const resize = new ResizeObserver(scheduleRefresh);
    resize.observe(title.parentElement);
    resize.observe(logo);
    // Page height changes shift where the scroll timeline maps the animation.
    resize.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleRefresh);
    motion.addEventListener('change', scheduleRefresh);
    refresh();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(refreshFrame);
      animation?.cancel();
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleRefresh);
      motion.removeEventListener('change', scheduleRefresh);
      logo.style.removeProperty('--wordmark-opacity');
    };
  }, []);

  return (
    <div className="hero-wordmark">
      <h1 ref={titleRef}>{wordmark}</h1>
    </div>
  );
}
