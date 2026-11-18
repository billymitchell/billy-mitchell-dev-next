'use client';

import { useEffect, useState } from 'react';

export default function VisitReadout() {
  const [visit, setVisit] = useState(null);

  useEffect(() => {
    let frame = 0;
    const root = document.documentElement;

    function update() {
      frame = 0;
      const height = root.scrollHeight - root.clientHeight;
      const progress = height > 0 ? Math.round(window.scrollY / height * 100) : 0;
      const next = {
        width: root.clientWidth,
        height: root.clientHeight,
        progress: Math.min(100, Math.max(0, progress)),
      };
      // Skip re-rendering on scroll frames where nothing visible changed.
      setVisit((current) => (current
        && current.width === next.width
        && current.height === next.height
        && current.progress === next.progress ? current : next));
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
    };
  }, []);

  return (
    <dl className="visit-metrics" title="Measured locally for this visit">
      <div>
        <dt>Viewport</dt>
        <dd>{visit ? `${visit.width}×${visit.height}` : '—'}</dd>
      </div>
      <div>
        <dt>Read</dt>
        <dd>
          {visit ? (
            <>
              <progress aria-label="Page scroll progress" value={visit.progress} max={100} />
              <span>{visit.progress}%</span>
            </>
          ) : '—'}
        </dd>
      </div>
    </dl>
  );
}
