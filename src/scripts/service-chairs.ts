import { addScene, clamp, easeOut, range } from './motion';

const section = document.querySelector<HTMLElement>('[data-service-chairs]');
if (section) {
  const stage = section.querySelector<HTMLElement>('[data-service-stage]')!;
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-service-card]'));
  const chairs = cards.map((card) => card.querySelector<HTMLElement>('[data-service-chair]')!);
  const copies = cards.map((card) => card.querySelector<HTMLElement>('[data-service-copy]')!);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set<Animation>();
  const revealed = new Set<number>();
  let observer: IntersectionObserver | undefined;
  let firstStarted = false;
  let firstAnimation: Animation | undefined;
  let firstObserver: IntersectionObserver | undefined;
  let travel = 1;
  let stickyTop = 0;
  let nextArrival = 0;
  const enterDistances = cards.map(() => 0);

  const finalChair = (i: number) => {
    chairs[i].style.setProperty('--chair-x', '0px');
    chairs[i].style.setProperty('--chair-opacity', '1');
  };
  const finalCopy = (i: number) => {
    copies[i].style.setProperty('--copy-y', '0px');
    copies[i].style.setProperty('--copy-opacity', '1');
  };
  const animate = (el: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = el.animate(frames, options);
    animations.add(animation);
    animation.finished.then(() => {
      animations.delete(animation);
      // The final CSS variables are already set; release the animation's overrides.
      animation.cancel();
    }).catch(() => animations.delete(animation));
    return animation;
  };

  const rollFirst = () => {
    if (firstStarted || reduced.matches) return;
    firstStarted = true;
    firstObserver?.disconnect();
    const rect = cards[0].getBoundingClientRect();
    const distance = rect.left + (rect.width + chairs[0].offsetWidth) / 2 + 48;
    const heroCue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--t-chair')) || 1;
    const delay = Math.max(0, heroCue * 1000 - performance.now());
    finalChair(0);
    firstAnimation = animate(chairs[0], [
      { opacity: 1, transform: `translate3d(${-distance}px, 0, 0)`, offset: 0 },
      { opacity: 1, transform: 'translate3d(5px, 0, 0)', offset: 0.82 },
      { opacity: 1, transform: 'translate3d(0, 0, 0)', offset: 1 },
    ], { duration: 1450, delay, easing: 'cubic-bezier(.16,.74,.22,1)', fill: 'both' });
  };

  const revealCard = (i: number) => {
    if (revealed.has(i) || reduced.matches) return;
    revealed.add(i);
    const now = performance.now();
    const delay = Math.max(0, nextArrival - now);
    nextArrival = now + delay + 200;
    if (i === 0) rollFirst();
    else {
      const distance = window.innerWidth - cards[i].getBoundingClientRect().left + 48;
      finalChair(i);
      animate(chairs[i], [
        { opacity: 0, transform: `translate3d(${distance}px, 0, 0)` },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], { duration: 1050, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
    }
    finalCopy(i);
    animate(copies[i], [
      { opacity: 0, transform: 'translate3d(0, 16px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    ], { duration: 700, delay: delay + (i === 0 ? 100 : 350), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
  };

  section.classList.add('is-motion-ready');
  firstObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) rollFirst();
  });
  // Observe the untransformed card, so the off-screen chair cannot prevent its entrance.
  firstObserver.observe(cards[0]);

  addScene({
    el: section,
    media: '(min-width: 1024px) and (min-height: 680px)',
    measure(active) {
      observer?.disconnect();
      animations.forEach((animation) => {
        if (animation !== firstAnimation || reduced.matches) animation.cancel();
      });
      // Let the hero arrival continue through the initial font/layout refresh.
      if (firstStarted) finalChair(0);
      section.classList.toggle('has-chair-motion', !reduced.matches);
      section.classList.toggle('is-sequence', active);
      stickyTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 32;
      travel = clamp(window.innerHeight * 1.05, 760, 1200);
      section.style.setProperty('--service-stage-h', `${stage.offsetHeight}px`);
      section.style.setProperty('--service-travel', `${travel}px`);
      cards.forEach((card, i) => {
        enterDistances[i] = window.innerWidth - card.getBoundingClientRect().left + 48;
      });
      if (reduced.matches) {
        firstObserver?.disconnect();
        cards.forEach((_, i) => { finalChair(i); finalCopy(i); });
      } else if (!active) {
        nextArrival = 0;
        revealed.forEach((i) => { finalChair(i); finalCopy(i); });
        observer = new IntersectionObserver((entries) => {
          entries.filter((entry) => entry.isIntersecting)
            .sort((a, b) => cards.indexOf(a.target as HTMLElement) - cards.indexOf(b.target as HTMLElement))
            .forEach((entry) => {
              revealCard(cards.indexOf(entry.target as HTMLElement));
              observer?.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -20% 0px' });
        cards.forEach((card) => observer?.observe(card));
      }
    },
    progress: (rect) => (stickyTop - rect.top) / travel,
    render(p) {
      if (!section.classList.contains('is-sequence')) return;
      if (!firstStarted && cards[0].getBoundingClientRect().top < window.innerHeight) rollFirst();
      const firstCopy = easeOut(range(p, 0, 0.09));
      copies[0].style.setProperty('--copy-opacity', String(firstCopy));
      copies[0].style.setProperty('--copy-y', `${(1 - firstCopy) * 16}px`);
      for (let i = 1; i < cards.length; i++) {
        const start = 0.035 + (i - 1) * 0.21;
        const local = range(p, start, start + 0.2);
        const eased = easeOut(local);
        chairs[i].style.setProperty('--chair-x', `${(1 - eased) * enterDistances[i]}px`);
        chairs[i].style.setProperty('--chair-opacity', String(range(local, 0, 0.18)));
        const copy = easeOut(range(local, 0.35, 1));
        copies[i].style.setProperty('--copy-opacity', String(copy));
        copies[i].style.setProperty('--copy-y', `${(1 - copy) * 16}px`);
      }
    },
  });
}
