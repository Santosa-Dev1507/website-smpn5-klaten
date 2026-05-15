'use client';

/**
 * ScrollReveal — ui-animation skill
 *
 * Attaches an IntersectionObserver to all `.reveal` elements on mount.
 * When each enters the viewport, `visible` is added — CSS handles the
 * transition (opacity + translateY) following the ui-animation easing table.
 *
 * Also pauses CSS looping animations when off-screen (performance rule).
 */

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    // 1. Scroll-reveal: toggle `.visible` on `.reveal` elements
    const revealEls = document.querySelectorAll<HTMLElement>('.reveal');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once visible, no need to keep observing
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    // 2. Pause looping animations off-screen (ui-animation performance rule)
    const loopingEls = document.querySelectorAll<HTMLElement>('[data-loop]');

    const loopObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    });

    loopingEls.forEach((el) => loopObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      loopObserver.disconnect();
    };
  }, []);

  return null;
}
