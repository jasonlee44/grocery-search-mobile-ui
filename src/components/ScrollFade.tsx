import { useRef, useState, useEffect, useCallback } from 'react';

export default function ScrollFade({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 2);
    setAtEnd(el.scrollWidth - el.scrollLeft - el.clientWidth < 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  return (
    <div className="relative">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {children}
      </div>
      {!atStart && (
        <div className="absolute top-0 left-0 w-12 h-full bg-linear-to-l from-transparent to-white pointer-events-none" />
      )}
      {!atEnd && (
        <div className="absolute top-0 right-0 w-12 h-full bg-linear-to-r from-transparent to-white pointer-events-none" />
      )}
    </div>
  );
}
