import React, { useEffect, useRef } from 'react';

export default function FloatingDragon() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const updateFromScroll = () => {
      const scroll = window.scrollY || window.pageYOffset;
      const drift = Math.min(28, scroll * 0.045);
      layer.style.setProperty('--dragon-scroll', `${drift.toFixed(2)}px`);
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    updateFromScroll();

    return () => {
      window.removeEventListener('scroll', updateFromScroll);
    };
  }, []);

  return (
    <div ref={layerRef} className="page-dragon-layer" aria-hidden="true">
      <div className="page-dragon-track">
        <img src={`${process.env.PUBLIC_URL}/original-coiled-water-dragon.svg`} alt="" className="page-dragon-image" />
      </div>
      <div className="page-dragon-aura" />
    </div>
  );
}
