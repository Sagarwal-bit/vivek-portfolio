import React, { useRef } from 'react';
import DragonScene from './DragonScene';
import './HeroSection.css';

export default function HeroSection() {
  const mouseRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    mouseRef.current.x = nx;
    mouseRef.current.y = ny;
  };

  const handlePointerLeave = () => {
    mouseRef.current.x = 0;
    mouseRef.current.y = 0;
  };

  return (
    <section
      className="cinematic-hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="Cinematic dragon portfolio hero"
    >
      <div className="scene-layer" aria-hidden="true">
        <DragonScene mouse={mouseRef} />
      </div>

      <div className="ui-layer">
        <div className="hero-content">
          <h1>Vivek Sagarwal - Full Stack Developer</h1>
          <p>Building intelligent web experiences</p>

          <div className="hero-actions">
            <a href="#projects" className="hero-btn hero-btn-solid">View Projects</a>
            <a href="#contact" className="hero-btn hero-btn-ghost">Contact Me</a>
          </div>
        </div>
      </div>
    </section>
  );
}
