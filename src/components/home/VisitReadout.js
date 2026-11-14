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
      setVisit({
        width: root.clientWidth,
        height: root.clientHeight,
        progress: Math.min(100, Math.max(0, progress)),
      });
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
    <dl className="terminal-metrics visit-metrics">
      <div>
        <dt>Viewport</dt>
        <dd>{visit ? `${visit.width} × ${visit.height} px` : '—'}</dd>
      </div>
      <div>
        <dt>Page progress</dt>
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
