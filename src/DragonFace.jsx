import React from 'react';

export default function DragonFace() {
  return (
    <div className="dragon-face-wrap" aria-label="3D style Chinese dragon face">
      <svg viewBox="0 0 900 420" className="dragon-face-svg" role="img" aria-label="Wild Chinese dragon face">
        <defs>
          <linearGradient id="hornGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8f0d4" />
            <stop offset="100%" stopColor="#bfa36c" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ff2bf" />
            <stop offset="50%" stopColor="#11a8c8" />
            <stop offset="100%" stopColor="#2466db" />
          </linearGradient>
          <linearGradient id="jawGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f8fa5" />
            <stop offset="100%" stopColor="#19499d" />
          </linearGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe1a8" />
            <stop offset="55%" stopColor="#ff5948" />
            <stop offset="100%" stopColor="#2a0f1d" />
          </radialGradient>
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000" floodOpacity="0.45" />
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#softShadow)">
          <path className="horn horn-left" d="M266 126 C206 78,184 48,166 28 C220 38,270 66,308 118 Z" fill="url(#hornGrad)" />
          <path className="horn horn-right" d="M634 126 C694 78,716 48,734 28 C680 38,630 66,592 118 Z" fill="url(#hornGrad)" />

          <path
            className="dragon-main"
            d="M210 260 C222 170,302 118,450 118 C598 118,678 170,690 260 C672 314,614 352,450 354 C286 352,228 314,210 260 Z"
            fill="url(#skinGrad)"
          />

          <path
            className="dragon-jaw"
            d="M250 278 C312 318,372 340,450 342 C528 340,588 318,650 278 C638 336,560 388,450 392 C340 388,262 336,250 278 Z"
            fill="url(#jawGrad)"
          />

          <path className="dragon-snarl" d="M276 228 C334 186,566 186,624 228" stroke="#d4ecff" strokeWidth="7" strokeLinecap="round" fill="none" />

          <ellipse className="eye eye-left" cx="352" cy="236" rx="40" ry="26" fill="url(#eyeGlow)" filter="url(#glow)" />
          <ellipse className="eye eye-right" cx="548" cy="236" rx="40" ry="26" fill="url(#eyeGlow)" filter="url(#glow)" />
          <circle cx="352" cy="236" r="9" fill="#05050c" />
          <circle cx="548" cy="236" r="9" fill="#05050c" />

          <path className="brow" d="M302 208 C332 182,372 176,402 196" stroke="#fff6d7" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path className="brow" d="M598 208 C568 182,528 176,498 196" stroke="#fff6d7" strokeWidth="8" strokeLinecap="round" fill="none" />

          <path className="whisker whisker-left" d="M250 264 C184 256,142 240,102 214" stroke="#d8fff0" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path className="whisker whisker-right" d="M650 264 C716 256,758 240,798 214" stroke="#d8fff0" strokeWidth="7" fill="none" strokeLinecap="round" />

          <g className="teeth-row">
            <path d="M362 304 l12 24 l12-24 Z" fill="#fefefe" />
            <path d="M400 314 l10 20 l10-20 Z" fill="#fefefe" />
            <path d="M438 318 l12 22 l12-22 Z" fill="#fefefe" />
            <path d="M476 314 l10 20 l10-20 Z" fill="#fefefe" />
            <path d="M514 304 l12 24 l12-24 Z" fill="#fefefe" />
          </g>

          <path className="nose-flare" d="M424 272 C434 286,466 286,476 272" stroke="#0a2144" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="434" cy="276" r="6" fill="#061531" />
          <circle cx="466" cy="276" r="6" fill="#061531" />

          <path className="mane" d="M216 244 C176 236,148 218,120 190" stroke="#8c7eff" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path className="mane" d="M684 244 C724 236,752 218,780 190" stroke="#8c7eff" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path className="mane" d="M450 114 C450 86,462 66,482 48" stroke="#8c7eff" strokeWidth="10" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}
