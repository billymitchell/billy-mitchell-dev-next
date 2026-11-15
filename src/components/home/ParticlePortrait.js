'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const WIDTH = 480;
const HEIGHT = 390;
const SHADES = 48;
const EDGE_DRIFT_DURATION = 9000;

function samplePortrait(image) {
  const sampler = document.createElement('canvas');
  sampler.width = 144;
  sampler.height = 117;
  const context = sampler.getContext('2d');
  if (!context) return [];

  context.drawImage(image, 0, 0, sampler.width, sampler.height);
  const { data } = context.getImageData(0, 0, sampler.width, sampler.height);
  const groups = Array.from({ length: SHADES }, () => []);

  for (let row = 0; row < sampler.height; row++) {
    for (let column = 0; column < sampler.width; column++) {
      const index = (row * sampler.width + column) * 4;
      const light = (data[index] * .2126 + data[index + 1] * .7152 + data[index + 2] * .0722) / 255;
      if (light < .075) continue;

      const x = (column + .5) * WIDTH / sampler.width;
      const y = (row + .5) * HEIGHT / sampler.height;
      const edgeDistance = Math.min(x, WIDTH - x, y, HEIGHT - y);
      const edgeStrength = Math.max(0, 1 - edgeDistance / 60) ** 2;
      const edgeReach = (4 + Math.random() ** 7 * 36) * edgeStrength;
      const edgeAngle = Math.atan2(
        (y - HEIGHT / 2) / HEIGHT,
        (x - WIDTH / 2) / WIDTH,
      ) + (Math.random() - .5) * .8;
      const burstAngle = Math.random() * Math.PI * 2;
      const particle = {
        x,
        y,
        delay: Math.random() * 550,
        radius: (.72 + light * .84) * (1 - Math.min(.7, edgeStrength * .28 + edgeReach / 180)),
        edgeStrength,
        edgeX: Math.cos(edgeAngle) * edgeReach,
        edgeY: Math.sin(edgeAngle) * edgeReach,
        edgePhase: edgeAngle + Math.random() * Math.PI * 2,
        burstSpread: Math.sqrt(Math.random()),
        burstDirectionX: Math.cos(burstAngle),
        burstDirectionY: Math.sin(burstAngle),
        offsetX: 0,
        offsetY: 0,
        velocityX: 0,
        velocityY: 0,
      };
      groups[Math.round(light * (SHADES - 1))].push(particle);

      // Sparse, dimmer particles carry the portrait's edge out into the page.
      if (edgeStrength > .35 && Math.random() < edgeStrength * .65) {
        const haloReach = 28 + Math.random() ** 2 * 190;
        const haloShade = Math.round(light * (SHADES - 1) * (1 - haloReach / 290));
        groups[haloShade].push({
          ...particle,
          radius: particle.radius * (.4 + Math.random() * .35),
          edgeX: Math.cos(edgeAngle) * haloReach,
          edgeY: Math.sin(edgeAngle) * haloReach,
          driftRadius: 3 + Math.random() * 4,
        });
      }
    }
  }

  return groups;
}

export default function ParticlePortrait({ src }) {
  const imageRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [mounted, setMounted] = useState(false);
  const portraitRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const image = imageRef.current;
    if (!canvas) return;
    const portrait = portraitRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const context = canvas.getContext('2d');
    if (!context) return;
    const styles = getComputedStyle(canvas);
    const gradientStart = styles.getPropertyValue('--brand-gradient-start').trim();
    const gradientEnd = styles.getPropertyValue('--brand-gradient-end').trim();

    let groups;
    let visible = false;
    let frame = 0;
    let started = null;
    let previous = null;
    let edgeDriftTime = 0;
    let lastScroll = window.scrollY;
    let scrollImpulse = 0;
    let pointer = null;
    let hoverStart = 0;
    let touchRelease = 0;
    let touchOrigin = null;
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    function schedule() {
      if (!frame && visible && groups && !motion.matches && !document.hidden) {
        frame = requestAnimationFrame(draw);
      }
    }

    function draw(now) {
      frame = 0;
      started ??= now;
      const elapsed = now - started;
      const delta = previous === null ? 16.67 : Math.min(now - previous, 33.34);
      const step = delta / 16.67;
      previous = now;
      scrollImpulse *= Math.pow(.86, step);
      const assembly = Math.min(1, elapsed / 1800);
      edgeDriftTime = (edgeDriftTime + delta) % EDGE_DRIFT_DURATION;
      const edgePhase = edgeDriftTime / EDGE_DRIFT_DURATION * Math.PI * 2;

      const burstAge = now - hoverStart;
      const bounds = portrait.getBoundingClientRect();
      const viewport = canvas.getBoundingClientRect();
      const viewportWidth = viewport.width;
      const viewportHeight = viewport.height;
      if (!bounds.width || !bounds.height || !viewportWidth || !viewportHeight) {
        schedule();
        return;
      }
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(6e6 / (viewportWidth * viewportHeight)));
      const canvasWidth = Math.round(viewportWidth * pixelRatio);
      const canvasHeight = Math.round(viewportHeight * pixelRatio);
      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
      const scaleX = bounds.width / WIDTH;
      const scaleY = bounds.height / HEIGHT;
      const friction = Math.pow(.76, step);

      context.resetTransform();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(
        pixelRatio * scaleX, 0, 0, pixelRatio * scaleY,
        pixelRatio * (bounds.left - viewport.left), pixelRatio * (bounds.top - viewport.top),
      );
      groups.forEach((particles, shade) => {
        const gray = Math.round(shade * 255 / (SHADES - 1));
        context.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        context.beginPath();

        for (const particle of particles) {
          const { x, y, radius, delay, edgeStrength } = particle;
          let targetX = 0;
          let targetY = scrollImpulse * (.25 + y / HEIGHT);

          if (edgeStrength > 0) {
            const drift = edgePhase + particle.edgePhase;
            const driftRadius = particle.driftRadius ?? 5 * edgeStrength;
            targetX += (particle.edgeX + Math.cos(drift) * driftRadius) * assembly;
            targetY += (particle.edgeY + Math.sin(drift) * driftRadius) * assembly;
          }

          if (pointer) {
            const distance = Math.hypot(x * scaleX + bounds.left - pointer.x, y * scaleY + bounds.top - pointer.y);
            const burstProgress = Math.min(1, Math.max(0, (burstAge - distance * .17 - delay * .045) / 125));
            const { burstDirectionX: directionX, burstDirectionY: directionY } = particle;
            // End each ray at the viewport edge, then spread particles along it.
            const reachX = ((directionX > 0 ? viewport.right : viewport.left) - pointer.x) / directionX;
            const reachY = ((directionY > 0 ? viewport.bottom : viewport.top) - pointer.y) / directionY;
            const reach = Math.min(reachX, reachY) * particle.burstSpread;
            const screenX = pointer.x + directionX * reach;
            const screenY = pointer.y + directionY * reach;
            const touchFade = touchRelease ? Math.max(0, 1 - (now - touchRelease) / 400) : 1;
            targetX += ((screenX - bounds.left) / scaleX - x) * burstProgress * touchFade;
            targetY += ((screenY - bounds.top) / scaleY - y) * burstProgress * touchFade;
          }

          const stiffness = (pointer ? .19 : .075) + (1 - delay / 550) * .06;
          particle.velocityX = (particle.velocityX + (targetX - particle.offsetX) * stiffness * step) * friction;
          particle.velocityY = (particle.velocityY + (targetY - particle.offsetY) * stiffness * step) * friction;
          particle.offsetX += particle.velocityX * step;
          particle.offsetY += particle.velocityY * step;

          const drawX = x + particle.offsetX;
          const drawY = y + particle.offsetY;
          context.moveTo(drawX + radius, drawY);
          context.arc(drawX, drawY, radius, 0, Math.PI * 2);
        }

        context.fill();
      });

      if (gradientStart && gradientEnd) {
        context.save();
        context.resetTransform();
        // Draw the overlay in canvas pixels and anchor its colors to the portrait.
        const portraitLeft = (bounds.left - viewport.left) * pixelRatio;
        const portraitRight = (bounds.right - viewport.left) * pixelRatio;
        const tint = context.createLinearGradient(portraitLeft, 0, portraitRight, 0);
        tint.addColorStop(0, gradientStart);
        tint.addColorStop(1, gradientEnd);
        context.globalCompositeOperation = 'source-atop';
        context.globalAlpha = .45;
        context.fillStyle = tint;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
      }

      portrait.dataset.animated = 'true';
      canvas.dataset.animated = 'true';
      schedule();
    }

    function prepare() {
      if (!image.naturalWidth || motion.matches) return;
      if (!groups) {
        try {
          groups = samplePortrait(image);
        } catch {
          return;
        }
      }
      if (groups.length) schedule();
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = null;
      scrollImpulse = 0;
      pointer = null;
      touchRelease = 0;
      touchOrigin = null;
    }

    function onMotionChange() {
      if (motion.matches) {
        stop();
        delete portrait.dataset.animated;
        delete canvas.dataset.animated;
        started = null;
      } else {
        prepare();
      }
    }

    function onPointer(event) {
      if (event.pointerType === 'touch' || motion.matches) return;
      if (!pointer) hoverStart = performance.now();
      pointer = {
        x: Math.max(0, Math.min(document.documentElement.clientWidth, event.clientX)),
        y: Math.max(0, Math.min(document.documentElement.clientHeight, event.clientY)),
      };
      schedule();
    }

    function onPointerLeave(event) {
      if (event.pointerType === 'touch') return;
      pointer = null;
      schedule();
    }

    function onTouchPointerDown(event) {
      if (event.pointerType !== 'touch' || motion.matches) return;
      hoverStart = performance.now();
      touchRelease = 0;
      touchOrigin = { x: event.clientX, y: event.clientY, id: event.pointerId };
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    }

    function onTouchPointerMove(event) {
      if (event.pointerType !== 'touch' || !touchOrigin || touchOrigin.id !== event.pointerId) return;
      // Allow vertical page scrolling without dragging the particle burst along.
      if (Math.hypot(event.clientX - touchOrigin.x, event.clientY - touchOrigin.y) > 12) {
        touchRelease = performance.now();
        touchOrigin = null;
      }
    }

    function onTouchPointerEnd(event) {
      if (event.pointerType !== 'touch' || !touchOrigin || touchOrigin.id !== event.pointerId) return;
      touchOrigin = null;
      touchRelease = performance.now();
      schedule();
    }

    function preventImageMenu(event) {
      event.preventDefault();
    }

    function onScroll() {
      const next = window.scrollY;
      const delta = next - lastScroll;
      lastScroll = next;
      if (!visible || motion.matches) return;
      // Touch scrolling must not impart momentum to the portrait.
      if (!isTouchDevice) scrollImpulse = Math.max(-48, Math.min(48, scrollImpulse + delta * .65));
      schedule();
    }

    function onVisibility() {
      if (document.hidden) stop();
      else schedule();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) prepare();
      else stop();
    });
    observer.observe(portrait);
    image.addEventListener('load', prepare);
    if (image.complete) prepare();
    portrait.addEventListener('pointerdown', onTouchPointerDown);
    portrait.addEventListener('pointermove', onTouchPointerMove);
    portrait.addEventListener('pointerup', onTouchPointerEnd);
    portrait.addEventListener('pointercancel', onTouchPointerEnd);
    portrait.addEventListener('contextmenu', preventImageMenu);
    image.addEventListener('dragstart', preventImageMenu);
    portrait.addEventListener('pointerenter', onPointer);
    portrait.addEventListener('pointermove', onPointer);
    portrait.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotionChange);

    return () => {
      stop();
      observer.disconnect();
      delete portrait.dataset.animated;
      delete canvas.dataset.animated;
      image.removeEventListener('load', prepare);
      portrait.removeEventListener('pointerdown', onTouchPointerDown);
      portrait.removeEventListener('pointermove', onTouchPointerMove);
      portrait.removeEventListener('pointerup', onTouchPointerEnd);
      portrait.removeEventListener('pointercancel', onTouchPointerEnd);
      portrait.removeEventListener('contextmenu', preventImageMenu);
      image.removeEventListener('dragstart', preventImageMenu);
      portrait.removeEventListener('pointerenter', onPointer);
      portrait.removeEventListener('pointermove', onPointer);
      portrait.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotionChange);
    };
  }, [canvas, src]);

  return (
    <div className="hero-portrait" ref={portraitRef}>
      <img
        ref={imageRef}
        src={src}
        alt="Portrait of Billy Mitchell"
        width={1000}
        height={812}
        fetchPriority="high"
        draggable={false}
      />
      {mounted && createPortal(
        <canvas className="hero-portrait-canvas" ref={setCanvas} aria-hidden="true" />,
        document.body,
      )}
    </div>
  );
}
