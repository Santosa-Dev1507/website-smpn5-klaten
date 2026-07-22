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

    const observeNewEls = () => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.visible)').forEach((el) => {
        revealObserver.observe(el);
      });
    };

    observeNewEls();

    const mutObserver = new MutationObserver(() => {
      observeNewEls();
    });

    mutObserver.observe(document.body, { childList: true, subtree: true });

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
      mutObserver.disconnect();
      loopObserver.disconnect();
    };
  }, []);

  return null;
}
