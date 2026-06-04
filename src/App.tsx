import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type Page = 'landing' | 'menu';
type MotionStyle = CSSProperties & Record<string, string | number>;

const HERO_VIDEO_URLS = [
  'https://dropshare.42web.io/1/files/7eY39CTSbg.mp4',
  'https://dropshare.42web.io/1/files/9asN6BXde2.mp4',
  'https://dropshare.42web.io/1/files/fVkU7Q4oSP.mp4',
];
const LOGO_URLS = {
  black: '/assets/logo-black.png',
  red: '/assets/logo-red.png',
  white: '/assets/logo-white.png',
};
const HERO_POSTER_URL = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1600&auto=format&fit=crop';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
let activeScrollFrame: number | null = null;

function smoothScrollToY(targetY: number, duration = 1150) {
  if (activeScrollFrame) {
    window.cancelAnimationFrame(activeScrollFrame);
    activeScrollFrame = null;
  }

  if (prefersReducedMotion()) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutQuint(progress));

    if (progress < 1) {
      activeScrollFrame = window.requestAnimationFrame(tick);
    } else {
      activeScrollFrame = null;
    }
  };

  activeScrollFrame = window.requestAnimationFrame(tick);
}

function smoothScrollToElement(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const offset = id === 'top' ? 0 : 84;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  smoothScrollToY(Math.max(top, 0), 1200);
}

function useSmoothReveals(trigger: unknown) {
  useEffect(() => {
    document.body.classList.add('motion-ready');

    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal-up, .reveal-left, .reveal-right'));
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      items.forEach((item) => item.classList.add('is-visible', 'is-settled'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          window.setTimeout(() => entry.target.classList.add('is-settled'), 1000);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12,
      }
    );

    items.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [trigger]);
}

function useIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), prefersReducedMotion() ? 120 : 1250);
    return () => window.clearTimeout(timer);
  }, []);

  return ready;
}

function useSilkyPageMotion(trigger: unknown) {
  useSmoothReveals(trigger);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let raf = 0;
    const root = document.documentElement;

    const update = () => {
      raf = 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const pageProgress = Math.min(window.scrollY / maxScroll, 1);
      const heroProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      const isPhone = window.matchMedia('(max-width: 767px)').matches;
      root.style.setProperty('--hero-content-y', `${heroProgress * (isPhone ? 14 : 36)}px`);
      root.style.setProperty('--hero-overlay-opacity', `${0.78 + heroProgress * 0.18}`);
      root.style.setProperty('--scroll-progress', `${pageProgress}`);
    };

    const requestUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      root.style.removeProperty('--hero-content-y');
      root.style.removeProperty('--hero-overlay-opacity');
      root.style.removeProperty('--scroll-progress');
    };
  }, [trigger]);
}

function useInteractionRipples(trigger: unknown) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>('.ripple-target'));
    const cleanup = targets.map((target) => {
      const onPointerDown = (event: PointerEvent) => {
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.35;
        const ripple = document.createElement('span');
        ripple.className = 'tap-ripple';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        target.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 760);
      };

      target.addEventListener('pointerdown', onPointerDown);

      return () => target.removeEventListener('pointerdown', onPointerDown);
    });

    return () => cleanup.forEach((dispose) => dispose());
  }, [trigger]);
}

function useMagneticMotion(trigger: unknown) {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>('.magnetic'));
    const cleanup = items.map((item) => {
      const strength = 10;

      const move = (event: MouseEvent) => {
        const rect = item.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
        item.style.setProperty('--magnet-x', `${x}px`);
        item.style.setProperty('--magnet-y', `${y}px`);
      };

      const leave = () => {
        item.style.setProperty('--magnet-x', '0px');
        item.style.setProperty('--magnet-y', '0px');
      };

      item.addEventListener('mousemove', move);
      item.addEventListener('mouseleave', leave);

      return () => {
        item.removeEventListener('mousemove', move);
        item.removeEventListener('mouseleave', leave);
      };
    });

    return () => cleanup.forEach((dispose) => dispose());
  }, [trigger]);
}

function IntroCurtain({ ready }: { ready: boolean }) {
  return (
    <div className={`intro-curtain ${ready ? 'is-ready' : ''}`} aria-hidden="true">
      <div className="intro-logo-wrap">
        <BrandLogo
          tone="white"
          className="h-20 w-auto max-w-[220px] object-contain"
          fallbackClassName="text-[#f3eee9] font-black tracking-widest text-5xl font-display"
        />
      </div>
      <div className="intro-line" />
    </div>
  );
}

function MotionText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`motion-text ${className}`} aria-label={text}>
      {text.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          aria-hidden="true"
          className="motion-char"
          style={{ '--char-index': index } as MotionStyle}
        >
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </span>
  );
}

function CountUp({
  value,
  suffix = '',
  format = (nextValue: number) => String(nextValue),
}: {
  value: number;
  suffix?: string;
  format?: (nextValue: number) => string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(value * easeOutQuint(progress)));
          if (progress < 1) frame = window.requestAnimationFrame(tick);
        };
        frame = window.requestAnimationFrame(tick);
      },
      { threshold: 0.55 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {format(display)}
      {suffix}
    </span>
  );
}

// ============ MENU DATA ============
type MenuItem = {
  name: string;
  price?: string;
  desc?: string;
  composition?: string;
  prices?: { label: string; price: string }[];
};

type MenuSection = {
  id: string;
  label: string;
  tag: string;
  subtitle?: string;
  items: MenuItem[];
};

const MENU: MenuSection[] = [
  {
    id: 'morning',
    label: 'MORNING BOOST',
    tag: '01',
    subtitle: 'Breakfast Combos - Start your day the Cosmitto way',
    items: [
      { name: 'Morning Classic', price: '3,9 DT', composition: 'Cafe + Viennoiserie ou Cake + Eau' },
      { name: 'Morning Quick', price: '4,2 DT', composition: 'Cafe + Cookie ou Brownie ou Muffin' },
      { name: 'Morning Sale', price: '5,5 DT', composition: 'Cafe + Croissant sale + Eau' },
      { name: 'Morning Drum', price: '6,9 DT', composition: 'Cafe + 2 Pancakes + Citronnade ou Jus d\'orange' },
      { name: 'Morning Breakfast', price: '7,9 DT', composition: 'Cafe + Egg croq muffin + Citronnade ou Jus d\'orange' },
    ],
  },
  {
    id: 'lunch',
    label: 'LUNCH POWER',
    tag: '02',
    subtitle: 'Fuel up',
    items: [
      { name: 'Tahricha', price: '6,9 DT', composition: 'Feuillete au choix + Citronnade - Cookie offert' },
      { name: 'Tanwicha', price: '7,5 DT', composition: 'Quiche + Bouquet de salade + Citronnade - Espresso offert' },
    ],
  },
  {
    id: 'happy-hour',
    label: 'HAPPY HOUR',
    tag: '03',
    subtitle: 'Every Day - 15:00 - 18:00',
    items: [
      { name: 'Option Cold', desc: '1 Boisson Froide au choix - 1 Cookie offert !' },
      { name: 'Option Sweet', desc: '1 Patisserie au choix - 1 Cafe classique offert !' },
    ],
  },
  {
    id: 'frappe',
    label: 'CRUNCHY FRAPPES',
    tag: '04',
    subtitle: 'La Fikra Jdida',
    items: [
      { name: 'Cookie Frappe Signature', price: '8,0 DT', desc: 'Frappe onctueux blended avec eclats de cookies artisanaux et creme fouettee' },
      { name: 'Brownie Frappe Gourmand', price: '8,0 DT', desc: 'Base intense de chocolat, morceaux fondants de brownie maison' },
      { name: 'Donut Frappe Festif', price: '8,0 DT', desc: 'L\'alliance unique d\'un donut glace mixe au coeur d\'une texture veloutee' },
    ],
  },
  {
    id: 'classic',
    label: 'CLASSIC BENNA',
    tag: '05',
    subtitle: 'Specialty Coffee Matrix',
    items: [
      { name: 'Espresso', prices: [{ label: 'Kicker', price: '2,5 DT' }, { label: 'House', price: '4,0 DT' }, { label: 'Groove', price: '4,0 DT' }] },
      { name: 'Espresso Macchiato', prices: [{ label: 'Kicker', price: '3,0 DT' }, { label: 'House', price: '4,5 DT' }, { label: 'Groove', price: '4,5 DT' }] },
      { name: 'Americano', prices: [{ label: 'Kicker', price: '3,0 DT' }, { label: 'House', price: '4,5 DT' }, { label: 'Groove', price: '4,5 DT' }] },
      { name: 'Cafe Latte', prices: [{ label: 'Kicker', price: '4,0 DT' }, { label: 'House', price: '5,0 DT' }, { label: 'Groove', price: '5,0 DT' }] },
      { name: 'Cappuccino', prices: [{ label: 'Kicker', price: '4,0 DT' }, { label: 'House', price: '5,0 DT' }, { label: 'Groove', price: '5,0 DT' }] },
    ],
  },
  {
    id: 'delight',
    label: 'BENNA DELIGHT',
    tag: '06',
    subtitle: 'Gourmet Coffee',
    items: [
      { name: 'Caramel Macchiato', prices: [{ label: 'Medium', price: '5,0 DT' }, { label: 'Grand', price: '6,0 DT' }] },
      { name: 'Chococookies Latte', prices: [{ label: 'Medium', price: '5,0 DT' }, { label: 'Grand', price: '6,0 DT' }] },
      { name: 'Vanilla Latte', prices: [{ label: 'Medium', price: '5,0 DT' }, { label: 'Grand', price: '6,0 DT' }] },
      { name: 'Spicy Nut Latte', prices: [{ label: 'Medium', price: '5,0 DT' }, { label: 'Grand', price: '6,0 DT' }] },
    ],
  },
  {
    id: 'cold',
    label: '7AJA BERDA',
    tag: '07',
    subtitle: 'Ice Blended & Cold Drinks',
    items: [
      { name: 'Mojitos Premium', price: '6,9 DT', composition: 'Classic / Strawberry / Mango' },
      { name: 'Frozen Granites', price: '6,9 DT', composition: 'Strawberry Chiller / Mango Chiller' },
      { name: 'Frappes Classiques', price: '6,9 DT', composition: 'Caramel / Chocolat / Cappuccino / Cookies Moka' },
    ],
  },
  {
    id: 'smoothie',
    label: 'SMOOTHIES',
    tag: '08',
    subtitle: 'Detox & Fruites',
    items: [
      { name: 'Ginger Glow', price: '6,9 DT', composition: 'Ananas, citron, menthe fraiche, gingembre' },
      { name: 'Green Energy', price: '6,9 DT', composition: 'Pomme verte, citron presse, menthe' },
      { name: 'Fresh Boost', price: '6,9 DT', composition: 'Fraise, banane mure, orange fraiche' },
    ],
  },
  {
    id: 'sweet',
    label: '7AJA 7LOWA',
    tag: '09',
    subtitle: 'Sweet Treats & Pastries',
    items: [
      { name: 'Cake Nature / Cake Marbre', price: '2,5 DT' },
      { name: 'Mille Feuilles', price: '2,5 DT' },
      { name: 'Cookie / Donut / Brownie', price: '4,0 DT' },
      { name: 'Apple Pie', price: '5,0 DT' },
      { name: 'Cheesecake Premium', price: '6,5 DT' },
    ],
  },
  {
    id: 'juice',
    label: 'FARSHEK JAWEK',
    tag: '10',
    subtitle: 'Fresh Refreshments & Juices',
    items: [
      { name: 'Fresh Lemonade', price: '3,5 DT' },
      { name: 'Mint Lemonade', price: '4,0 DT' },
      { name: 'Fresh Orange Juice', price: '4,0 DT' },
      { name: 'Pink Lemonade', price: '4,5 DT' },
      { name: 'Pink Orange Juice', price: '4,5 DT' },
      { name: 'Eau Minerale', price: '1,0 DT' },
    ],
  },
  {
    id: 'hot',
    label: '7AJA HOT',
    tag: '11',
    subtitle: 'Infusions & Cocoa',
    items: [
      { name: 'The Infusion Selection', price: '4,0 DT' },
      { name: 'Chocolat Chaud Onctueux', price: '6,0 DT' },
    ],
  },
  {
    id: 'extras',
    label: 'EXTRAS',
    tag: '12',
    subtitle: 'Pour + De Benna',
    items: [
      { name: 'Nappage / Sirops', price: '+1,0 DT', composition: 'Caramel, Vanille, Chocolat, Cookies' },
      { name: 'Creme Chantilly Royale', price: '+2,0 DT' },
      { name: 'Taille Grand (supplement)', price: '+1,0 DT', composition: 'Sur espresso-based drinks' },
    ],
  },
];

export { HERO_VIDEO_URLS, LOGO_URLS, MENU };

function BrandLogo({
  tone,
  className,
  fallbackClassName,
}: {
  tone: keyof typeof LOGO_URLS;
  className: string;
  fallbackClassName: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={fallbackClassName}>COSMITTO</span>;
  }

  return (
    <img
      src={LOGO_URLS[tone]}
      alt="Cosmitto"
      className={`logo-pop ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

// ============ NAVBAR ============
function Navbar({ onNav }: { onNav: (page: Page, anchor?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'STORY', anchor: 'story' },
    { label: 'HAPPY HOUR', anchor: 'happy' },
    { label: 'VISIT', anchor: 'visit' },
    { label: 'CONTACT', anchor: 'contact' },
  ];

  return (
    <nav className={`site-nav fixed top-0 left-0 right-0 z-50 ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-stage">
        <div className="nav-panel">
          <div className="scroll-progress-bar" aria-hidden="true" />
          <button onClick={() => onNav('landing')} className="nav-brand mobile-tap" aria-label="Cosmitto home">
            <BrandLogo
              tone="white"
              className="h-9 md:h-11 w-auto max-w-[178px] object-contain"
              fallbackClassName="text-[#f3eee9] font-black tracking-widest text-xl md:text-2xl font-display"
            />
          </button>
          <div className="nav-links">
            {links.map((l) => (
              <button key={l.anchor} onClick={() => onNav('landing', l.anchor)} className="mobile-tap nav-link">
                {l.label}
              </button>
            ))}
            <button onClick={() => onNav('menu')} className="mobile-tap nav-link">
              MENU
            </button>
          </div>
          <button onClick={() => onNav('menu')} className="ripple-target magnetic motion-card nav-cta">
            VIEW MENU
          </button>
          <button className="nav-icon-button mobile-tap" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
              {open ? (<><path d="M6 6l12 12" /><path d="M6 18L18 6" /></>)
                   : (<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>)}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-nav-stage">
          <div className="mobile-menu-panel">
            {links.map((l) => (
              <button key={l.anchor} onClick={() => { setOpen(false); onNav('landing', l.anchor); }} className="ripple-target mobile-tap mobile-menu-link">
                {l.label}
              </button>
            ))}
            <button onClick={() => { setOpen(false); onNav('menu'); }} className="ripple-target mobile-tap mobile-menu-link">
              MENU
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============ HERO (VIDEO) ============
function Hero({ onNav }: { onNav: (page: Page, anchor?: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [, setFailedVideos] = useState<number[]>([]);
  const [soundOn, setSoundOn] = useState(false);
  const [warmupStarted, setWarmupStarted] = useState(false);
  const [videoArmed, setVideoArmed] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const currentVideoUrl = HERO_VIDEO_URLS[activeVideo];
  const currentVideoSrc = `${currentVideoUrl}?cosmitto=landing-bg-${activeVideo}`;

  useEffect(() => {
    const startWarmup = () => setWarmupStarted(true);
    const warmupTimer = window.setTimeout(startWarmup, 600);

    if (document.readyState === 'complete') {
      startWarmup();
    } else {
      window.addEventListener('load', startWarmup, { once: true });
    }

    return () => {
      window.clearTimeout(warmupTimer);
      window.removeEventListener('load', startWarmup);
    };
  }, []);

  useEffect(() => {
    if (!warmupStarted) return;
    const videoTimer = window.setTimeout(() => setVideoArmed(true), 1200);
    return () => window.clearTimeout(videoTimer);
  }, [warmupStarted]);

  useEffect(() => {
    setVideoLoaded(false);
    setVideoProgress(0);
  }, [activeVideo]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !soundOn;
    videoRef.current.volume = soundOn ? 0.72 : 0;
  }, [soundOn, activeVideo]);

  const goToNextVideo = () => {
    setActiveVideo((index) => (index + 1) % HERO_VIDEO_URLS.length);
  };

  const handleVideoError = () => {
    setFailedVideos((failed) => {
      const nextFailed = failed.includes(activeVideo) ? failed : [...failed, activeVideo];
      if (nextFailed.length >= HERO_VIDEO_URLS.length) {
        setVideoError(true);
      } else {
        goToNextVideo();
      }
      return nextFailed;
    });
  };

  const toggleSound = async () => {
    const nextSoundOn = !soundOn;
    setSoundOn(nextSoundOn);

    if (videoRef.current) {
      videoRef.current.muted = !nextSoundOn;
      videoRef.current.volume = nextSoundOn ? 0.72 : 0;

      try {
        await videoRef.current.play();
      } catch {
        setSoundOn(false);
      }
    }
  };

  const updateVideoProgress = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    setVideoProgress(video.currentTime / video.duration);
  };

  return (
    <section id="top" className="relative w-full h-screen min-h-[650px] overflow-hidden bg-[#120d0e]">
      {warmupStarted && (
        HERO_VIDEO_URLS.map((url) => (
          <iframe
            key={url}
            src={url}
            title="Cosmitto video warmup"
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            aria-hidden="true"
            loading="lazy"
            tabIndex={-1}
            onLoad={() => window.setTimeout(() => setVideoArmed(true), 250)}
          />
        ))
      )}

      {/* Video layer */}
      {videoArmed && !videoError ? (
        <video
          ref={videoRef}
          key={currentVideoSrc}
          className={`hero-media absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          muted={!soundOn}
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          onPlaying={() => setVideoLoaded(true)}
          onTimeUpdate={updateVideoProgress}
          onEnded={goToNextVideo}
          onError={handleVideoError}
          poster={HERO_POSTER_URL}
        >
          <source src={currentVideoSrc} type="video/mp4" />
        </video>
      ) : (
        <img
          src={HERO_POSTER_URL}
          alt="Cosmitto coffee"
          className="hero-media absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Poster fallback image layer (always rendered underlay) */}
      <img
        src={HERO_POSTER_URL}
        alt=""
        className={`hero-media absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      />

      <div className="absolute inset-0 hero-overlay" />

      {videoArmed && !videoError && (
        <button
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute video sound' : 'Unmute video sound'}
          title={soundOn ? 'Mute' : 'Unmute'}
          className="mobile-tap absolute bottom-8 right-4 md:right-12 z-20 h-12 w-12 bg-[#120d0e]/85 text-[#f3eee9] hover:bg-[#e61a23] border-2 border-[#f3eee9] font-black flex items-center justify-center transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            {soundOn ? (
              <>
                <path d="M16 8c1.2 1.1 1.8 2.4 1.8 4s-.6 2.9-1.8 4" />
                <path d="M18.8 5.5A9 9 0 0 1 21 12a9 9 0 0 1-2.2 6.5" />
              </>
            ) : (
              <>
                <path d="M17 9l4 4" />
                <path d="M21 9l-4 4" />
              </>
            )}
          </svg>
        </button>
      )}

      <div className="video-playlist-indicator" aria-hidden="true">
        {HERO_VIDEO_URLS.map((_, index) => (
          <button
            key={index}
            className={`video-dot ${index === activeVideo ? 'is-active' : ''}`}
            onClick={() => setActiveVideo(index)}
            tabIndex={-1}
          >
            <span
              style={{ '--dot-progress': index === activeVideo ? videoProgress : index < activeVideo ? 1 : 0 } as MotionStyle}
            />
          </button>
        ))}
      </div>

      {/* Top sticker badges */}
      <div className="absolute top-28 left-4 md:left-12 hidden md:block">
        <div className="hero-enter hero-enter-delay-2 bg-[#e61a23] text-[#f3eee9] px-4 py-2 border-2 border-[#120d0e] font-black tracking-widest text-sm sticker rotate-[-8deg]">
          * OPEN DAILY 08:00 - 23:00
        </div>
      </div>
      <div className="absolute top-28 right-4 md:right-12 hidden md:block">
        <div className="hero-enter hero-enter-delay-2 bg-[#f3eee9] text-[#120d0e] px-4 py-2 border-2 border-[#120d0e] font-black tracking-widest text-sm sticker rotate-[6deg]">
          + LAC - TUNIS +
        </div>
      </div>

      <div className="hero-content relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <div className="hero-enter mb-4 flex items-center gap-3 text-[#f3eee9] text-xs md:text-sm tracking-[0.4em] font-bold">
          <span className="line-reveal h-px w-12 bg-[#e61a23]" />
          <span>EST. TUNIS</span>
          <span className="line-reveal h-px w-12 bg-[#e61a23]" />
        </div>
        <h1 className="hero-enter hero-enter-delay-1 font-display text-[#f3eee9] text-6xl sm:text-8xl md:text-[11rem] leading-[0.85] tracking-tight">
          <MotionText text="COS" />
          <MotionText text="MIT" className="text-[#e61a23]" />
          <MotionText text="TO" />
        </h1>
        <p className="hero-enter hero-enter-delay-2 text-[#f3eee9]/90 mt-6 max-w-2xl text-base md:text-xl font-medium leading-relaxed">
          Coffee - Culture - Cosmic Vibes. A specialty coffee house brewed bold, served loud.
        </p>
        <div className="hero-enter hero-enter-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
          <button onClick={() => onNav('menu')} className="ripple-target mobile-tap magnetic motion-card bg-[#e61a23] text-[#f3eee9] hover:bg-[#f3eee9] hover:text-[#120d0e] px-8 py-4 font-black tracking-widest border-2 border-[#f3eee9] transition-colors">
            VIEW FULL MENU →
          </button>
          <button onClick={() => onNav('landing', 'story')} className="ripple-target mobile-tap magnetic motion-card bg-transparent text-[#f3eee9] hover:bg-[#120d0e] px-8 py-4 font-black tracking-widest border-2 border-[#f3eee9] transition-colors">
            OUR STORY
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#f3eee9] flex flex-col items-center gap-2 animate-pulse">
          <span className="text-xs tracking-[0.4em] font-bold">SCROLL</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ============ MARQUEE ============
function Marquee() {
  const text = '* COSMITTO * COFFEE HOUSE * TUNIS - LAC * OPEN DAILY * SPECIALTY ROASTS * COSMIC VIBES * ';
  return (
    <div className="bg-[#120d0e] text-[#f3eee9] border-y-4 border-[#e61a23] overflow-hidden py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="font-display text-3xl md:text-5xl tracking-widest mx-8">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============ STORY ============
function Story() {
  return (
    <section id="story" className="relative bg-[#f3eee9] py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid md:grid-cols-12 gap-8 items-center">
        <div className="reveal-left md:col-span-6 relative">
          <div className="motion-card sticker bg-[#120d0e] text-[#f3eee9] p-2 rotate-[-2deg]">
            <img src="https://dropshare.42web.io/1/files/ZiNfkClFQp.png" alt="Coffee beans" className="w-full h-[420px] object-cover transition-transform duration-700 hover:scale-[1.03]" />
          </div>
          <div className="reveal-up delay-2 absolute -bottom-6 -right-6 bg-[#e61a23] text-[#f3eee9] p-4 border-2 border-[#120d0e] font-black tracking-widest sticker rotate-[6deg] hidden md:block">
            <div className="text-5xl md:text-6xl font-display">31.9K</div>
            <div className="text-xs">COSMIC FRIENDS</div>
          </div>
        </div>
        <div className="reveal-right md:col-span-6">
          <BrandLogo
            tone="red"
            className="mb-8 h-12 md:h-16 w-auto max-w-[260px] object-contain"
            fallbackClassName="block text-[#e61a23] font-black tracking-widest text-3xl md:text-5xl font-display mb-8"
          />
          <div className="flex items-center gap-3 text-[#e61a23] text-sm tracking-[0.3em] font-black mb-6">
            <span className="h-px w-12 bg-[#e61a23]" />
            <span>OUR STORY</span>
          </div>
          <h2 className="font-display text-[#120d0e] text-5xl md:text-7xl leading-[0.9] mb-6">
            BREWED<br />
            <span className="text-[#e61a23]">LOUD.</span><br />
            SERVED BOLD.
          </h2>
          <p className="text-[#120d0e] text-lg md:text-xl leading-relaxed mb-6">
            Cosmitto is not just coffee - it is a universe. We roast our beans slow,
            steam our milk thick, and play our music loud. Born in the heart of Tunis,
            rebuilt after a cosmic renovation to serve specialty coffee, signature frappes
            and pastries that defy gravity.
          </p>
          <p className="text-[#120d0e] text-lg leading-relaxed mb-8">
            Rated 3.8 / 5 across 354+ reviews, Cosmitto is the study-friendly, work-ready,
            hang-out spot in Lac. Come for the Caramel Macchiato, stay for the vibe.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { n: <CountUp value={160} suffix="+" />, l: 'POSTS' },
              { n: '08H', l: '- 23H' },
              { n: <CountUp value={38} suffix="*" format={(nextValue) => (nextValue / 10).toFixed(1)} />, l: 'REVIEWS' },
            ].map((s) => (
              <div key={s.l} className="motion-card border-t-4 border-[#120d0e] pt-4">
                <div className="font-display text-4xl text-[#e61a23]">{s.n}</div>
                <div className="text-xs font-bold tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ CATEGORY GRID ============
function CategoryGrid({ onNav }: { onNav: (page: Page, anchor?: string) => void }) {
  const cats = [
    { title: 'MORNING BOOST', num: '01', img: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=600&auto=format&fit=crop', tag: 'BREAKFAST', id: 'morning' },
    { title: 'CRUNCHY FRAPPES', num: '02', img: 'https://dropshare.42web.io/1/files/4kDfInxvLF.png?q=80&w=600&auto=format&fit=crop', tag: 'SIGNATURE', id: 'frappe' },
    { title: 'CLASSIC BENNA', num: '03', img: 'https://dropshare.42web.io/1/files/qCFS25og6A.png?q=80&w=600&auto=format&fit=crop', tag: 'ESPRESSO', id: 'classic' },
    { title: '7AJA BERDA', num: '04', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop', tag: 'COLD', id: 'cold' },
  ];
  return (
    <section className="bg-[#120d0e] py-20 md:py-28 text-[#f3eee9]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="reveal-up flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 text-[#e61a23] text-sm tracking-[0.3em] font-black mb-4">
              <span className="h-px w-12 bg-[#e61a23]" />
              <span>COSMIC CATEGORIES</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-none">
              CHOOSE YOUR<br />
              <span className="text-[#e61a23]">VIBE.</span>
            </h2>
          </div>
          <button onClick={() => onNav('menu')} className="ripple-target mobile-tap motion-card text-[#f3eee9] hover:text-[#e61a23] font-black tracking-widest text-sm md:text-base border-b-2 border-current pb-1">
            SEE FULL MENU →
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cats.map((c) => (
            <button key={c.id} onClick={() => onNav('menu')} className="ripple-target mobile-tap reveal-up motion-card group relative overflow-hidden border-4 border-[#f3eee9] text-left">
              <img src={c.img} alt={c.title} className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120d0e]/90 via-[#120d0e]/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-[#e61a23] text-[#f3eee9] px-3 py-1 text-xs font-black tracking-widest border border-[#120d0e]">{c.num}</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs tracking-[0.3em] font-black text-[#e61a23]">{c.tag}</div>
                <div className="font-display text-2xl md:text-3xl leading-tight">{c.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ HAPPY HOUR ============
function HappyHour({ onNav }: { onNav: (page: Page, anchor?: string) => void }) {
  return (
    <section id="happy" className="relative bg-[#e61a23] py-20 md:py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#120d0e]/20 blur-3xl" />
      <div className="reveal-up relative max-w-[1400px] mx-auto px-4 md:px-8 text-center">
        <div className="inline-block bg-[#120d0e] text-[#f3eee9] px-4 py-2 border-2 border-[#f3eee9] font-black tracking-widest text-sm rotate-[-2deg] mb-8">
          ! EVERY DAY - 15H - 18H
        </div>
        <h2 className="font-display text-[#f3eee9] text-6xl md:text-[10rem] leading-[0.85]">
          HAPPY<br />
          <span className="text-[#120d0e] -mt-4 inline-block">HOUR.</span>
        </h2>
        <p className="text-[#f3eee9] text-xl md:text-2xl max-w-3xl mx-auto mt-8 font-medium">
          Two options. One cosmic deal. Pick your poison.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="ripple-target motion-card bg-[#f3eee9] text-[#120d0e] p-8 md:p-12 border-4 border-[#120d0e] text-left">
            <div className="text-[#e61a23] font-display text-7xl mb-4">01</div>
            <h3 className="font-display text-4xl md:text-5xl mb-4">OPTION COLD</h3>
            <p className="text-lg">1 Boisson Froide au choix</p>
            <div className="mt-6 pt-6 border-t-4 border-dashed border-[#120d0e]">
              <span className="bg-[#e61a23] text-[#f3eee9] px-4 py-2 font-black tracking-widest inline-block rotate-[-3deg] border-2 border-[#120d0e]">
                → 1 COOKIE OFFERT !
              </span>
            </div>
          </div>
          <div className="ripple-target motion-card bg-[#120d0e] text-[#f3eee9] p-8 md:p-12 border-4 border-[#f3eee9] text-left">
            <div className="text-[#e61a23] font-display text-7xl mb-4">02</div>
            <h3 className="font-display text-4xl md:text-5xl mb-4">OPTION SWEET</h3>
            <p className="text-lg">1 Patisserie au choix</p>
            <div className="mt-6 pt-6 border-t-4 border-dashed border-[#f3eee9]">
              <span className="bg-[#e61a23] text-[#f3eee9] px-4 py-2 font-black tracking-widest inline-block rotate-[3deg] border-2 border-[#f3eee9]">
                → 1 CAFE OFFERT !
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => onNav('menu')} className="ripple-target mobile-tap motion-card mt-12 bg-[#120d0e] text-[#f3eee9] hover:bg-[#f3eee9] hover:text-[#120d0e] px-8 py-4 font-black tracking-widest border-2 border-[#120d0e] transition-colors">
          EXPLORE FULL MENU →
        </button>
      </div>
    </section>
  );
}

// ============ REVIEWS ============
function Reviews() {
  const reviews = [
    { name: 'Jassim Alsaady', rating: 5, text: 'The atmosphere is fresh, clean, and inviting - perfect for working or relaxing. The best part? No smoking indoors.', when: '10 months ago' },
    { name: 'Syrine Baccouch', rating: 5, text: 'Good coffee and croissant, calm atmosphere and welcoming staff.', when: '8 months ago' },
    { name: 'Faiza Lubma', rating: 4, text: 'Nice place to study and chill, good iced coffee and cold drinks. Affordable prices.', when: '11 months ago' },
    { name: 'Rana Bouallegue', rating: 5, text: 'A very cosy place - love their Caramel Macchiato!', when: '6 years ago' },
    { name: 'Wiem Haha', rating: 4, text: "J'adore le nouveau look!", when: '4 months ago' },
    { name: 'Rishabh Gupta', rating: 5, text: 'A very cosy place with good coffee. Nice ambiance, calm place to relax and read.', when: '6 years ago' },
  ];
  return (
    <section className="bg-[#f3eee9] py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="reveal-up text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-[#e61a23] text-sm tracking-[0.3em] font-black mb-4">
            <span className="h-px w-12 bg-[#e61a23]" />
            <span>COSMIC VOICES</span>
            <span className="h-px w-12 bg-[#e61a23]" />
          </div>
          <h2 className="font-display text-5xl md:text-7xl">
            WHAT THE<br />
            <span className="text-[#e61a23]">HUMANS SAY.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className={`ripple-target reveal-up motion-card text-[#f3eee9] p-8 border-4 border-[#120d0e] ${i % 2 ? 'bg-[#e61a23]' : 'bg-[#120d0e]'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-2xl">{r.name}</span>
                <span className="bg-[#f3eee9] text-[#120d0e] px-3 py-1 text-xs font-black border-2 border-[#120d0e]">
                  {'*'.repeat(r.rating)}{'o'.repeat(5 - r.rating)}
                </span>
              </div>
              <p className="text-base leading-relaxed mb-4">{r.text}</p>
              <div className="text-xs tracking-widest font-bold opacity-80">-- {r.when}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ VISIT ============
function Visit() {
  const rows = [
    { k: 'LOCATION', v: ['R6MP+4GC, Rue du Lac Biwa', 'Tunis, Tunisia'] },
    { k: 'HOURS', v: ['Open daily - 08:00 - 23:00'] },
    { k: 'CONTACT', v: ['71 862 842'] },
    { k: 'VIBE', v: ['Calm - Study-friendly - Loud music'] },
  ];
  return (
    <section id="visit" className="bg-[#120d0e] text-[#f3eee9] py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid md:grid-cols-12 gap-8">
        <div className="reveal-left md:col-span-5">
          <div className="flex items-center gap-3 text-[#e61a23] text-sm tracking-[0.3em] font-black mb-4">
            <span className="h-px w-12 bg-[#e61a23]" />
            <span>VISIT US</span>
          </div>
          <h2 className="font-display text-6xl md:text-8xl leading-[0.9] mb-8">
            DROP BY.<br />
            <span className="text-[#e61a23]">STAY A WHILE.</span>
          </h2>
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.k} className="border-l-4 border-[#e61a23] pl-4">
                <div className="text-xs font-black tracking-[0.3em] text-[#e61a23]">{row.k}</div>
                {row.v.map((l, j) => <div key={j} className="text-xl">{l}</div>)}
              </div>
            ))}
          </div>
        </div>
        <div className="reveal-right md:col-span-7">
          <div className="motion-card border-4 border-[#f3eee9] bg-[#e61a23] text-[#f3eee9] p-4 rotate-[-2deg] min-h-[500px]">
            <div className="bg-[#120d0e] w-full h-full min-h-[470px] flex flex-col">
              <img src="https://images.unsplash.com/photo-1554118811-1e0d593a69a8?q=80&w=900&auto=format&fit=crop" alt="interior" className="w-full h-64 object-cover" />
              <div className="p-6 flex-1">
                <div className="font-display text-3xl mb-4">COSMITTO COFFEE LAC I</div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="border-t-2 border-[#f3eee9] pt-3">
                    <div className="text-xs tracking-widest font-bold">RATING</div>
                    <div className="font-display text-3xl text-[#e61a23]">3.8 *</div>
                  </div>
                  <div className="border-t-2 border-[#f3eee9] pt-3">
                    <div className="text-xs tracking-widest font-bold">PRICE</div>
                    <div className="font-display text-3xl">10-20 DT</div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['musique', 'service', 'prix', 'atmosphere', 'cheesecake', 'brownies', 'donuts'].map((t) => (
                    <span key={t} className="text-xs font-black tracking-wider border-2 border-[#f3eee9] px-3 py-1">#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer({ onNav }: { onNav: (page: Page, anchor?: string) => void }) {
  return (
    <footer id="contact" className="bg-[#e61a23] text-[#f3eee9] border-t-8 border-[#120d0e]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="reveal-up grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <button onClick={() => { onNav('landing'); window.scrollTo({ top: 0 }); }} className="text-left">
              <BrandLogo
                tone="black"
                className="mb-6 h-16 md:h-24 w-auto max-w-[320px] object-contain"
                fallbackClassName="block font-display text-6xl md:text-8xl leading-none mb-6 text-[#120d0e]"
              />
            </button>
            <p className="text-lg leading-relaxed max-w-md">
              Coffee, culture, and cosmic vibes in the heart of Tunis. Brewed loud. Served bold.
            </p>
            <div className="flex gap-3 mt-8">
              {['IG', 'FB', 'YT'].map((t) => (
                <a key={t} href="#" aria-label={t} className="w-12 h-12 bg-[#120d0e] border-2 border-[#f3eee9] flex items-center justify-center font-black text-lg hover:bg-[#f3eee9] hover:text-[#120d0e] transition-colors">
                  {t}
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="text-xs font-black tracking-[0.3em] text-[#120d0e] mb-4">EXPLORE</div>
            <ul className="space-y-2 text-lg">
              <li><button onClick={() => onNav('menu')} className="hover:text-[#120d0e] text-left">Full Menu</button></li>
              <li><button onClick={() => onNav('landing', 'story')} className="hover:text-[#120d0e] text-left">Our Story</button></li>
              <li><button onClick={() => onNav('landing', 'happy')} className="hover:text-[#120d0e] text-left">Happy Hour</button></li>
              <li><button onClick={() => onNav('landing', 'visit')} className="hover:text-[#120d0e] text-left">Visit Us</button></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <div className="text-xs font-black tracking-[0.3em] text-[#120d0e] mb-4">CONTACT</div>
            <p className="text-lg">R6MP+4GC, Rue du Lac Biwa<br />Tunis, Tunisia</p>
            <p className="text-lg mt-4">71 862 842</p>
            <p className="text-lg">hello@cosmitto.tn</p>
          </div>
        </div>
      </div>
      <div className="bg-[#120d0e] text-[#f3eee9] py-6 border-t-4 border-[#e61a23]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between flex-wrap gap-4 text-xs md:text-sm font-bold tracking-widest">
          <div>{new Date().getFullYear()} COSMITTO COFFEE - ALL RIGHTS RESERVED</div>
          <div className="text-[#e61a23]">BREWED LOUD - SERVED BOLD - COSMIC VIBES +</div>
        </div>
      </div>
    </footer>
  );
}

// ============ MENU PAGE ============
function MenuPage({ onNav }: { onNav: (page: Page, anchor?: string) => void }) {
  const [active, setActive] = useState('morning');
  const menuTabListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ids = MENU.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeTab = menuTabListRef.current?.querySelector<HTMLAnchorElement>(`[data-menu-tab="${active}"]`);
    if (!activeTab) return;

    activeTab.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [active]);

  return (
    <div className="min-h-screen bg-[#f3eee9] text-[#120d0e] pt-24">
      {/* Menu hero */}
      <section className="relative bg-[#120d0e] text-[#f3eee9] py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#e61a23]/30 blur-3xl" />
        <div className="hero-enter relative max-w-[1400px] mx-auto px-4 md:px-8 text-center">
          <button onClick={() => onNav('landing')} className="text-[#e61a23] hover:text-[#f3eee9] font-black tracking-widest text-sm mb-6 border-b-2 border-[#e61a23] pb-1">
            ← BACK TO HOME
          </button>
          <div className="mb-8 flex justify-center">
            <BrandLogo
              tone="white"
              className="h-14 md:h-20 w-auto max-w-[300px] object-contain"
              fallbackClassName="text-[#f3eee9] font-black tracking-widest text-3xl md:text-5xl font-display"
            />
          </div>
          <div className="flex items-center justify-center gap-3 text-[#e61a23] text-sm tracking-[0.3em] font-black mb-4">
            <span className="h-px w-12 bg-[#e61a23]" />
            <span>THE FULL MENU</span>
            <span className="h-px w-12 bg-[#e61a23]" />
          </div>
          <h1 className="font-display text-6xl md:text-9xl leading-none">
            EAT - DRINK - <span className="text-[#e61a23]">REPEAT.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mt-6 text-[#f3eee9]/80">
            Specialty coffee, signature frappes, breakfast combos and cosmic desserts.
            All prices in Tunisian Dinars (DT).
          </p>
        </div>
      </section>

      {/* Sticky nav + items */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="sticky top-20 z-30 mb-12">
            <div className="menu-tab-shell -mx-4 px-4 pb-4 md:mx-0 md:px-0">
              <div ref={menuTabListRef} className="menu-tab-list">
                {MENU.map((s) => (
                  <a
                    key={s.id}
                    data-menu-tab={s.id}
                    href={`#${s.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      setActive(s.id);
                      smoothScrollToElement(s.id);
                    }}
                    className={`menu-tab ripple-target mobile-tap ${
                      active === s.id ? 'is-active' : ''
                    }`}
                    aria-current={active === s.id ? 'true' : undefined}
                  >
                    <span className="menu-tab-number">{s.tag}</span>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-24">
            {MENU.map((section) => (
              <div id={section.id} key={section.id} className="reveal-up scroll-mt-32">
                <div className="border-b-4 border-t-4 border-[#120d0e] py-6 mb-10 flex items-end justify-between flex-wrap gap-4">
                  <div>
                    <span className="font-display text-[#e61a23] text-2xl">N {section.tag}</span>
                    <h3 className="font-display text-5xl md:text-7xl leading-none">{section.label}</h3>
                    {section.subtitle && (
                      <p className="text-sm md:text-base mt-2 text-[#120d0e]/70 font-medium">{section.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {section.items.map((item, i) => (
                    <div key={i} className="motion-card border-b-2 border-dashed border-[#120d0e] pb-6">
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <h4 className="font-display text-2xl md:text-3xl text-[#120d0e]">{item.name}</h4>
                        {item.price && (
                          <span className="text-[#e61a23] font-display text-2xl font-black whitespace-nowrap">{item.price}</span>
                        )}
                      </div>
                      {item.composition && (
                        <p className="text-[#120d0e]/75 text-sm md:text-base italic">{item.composition}</p>
                      )}
                      {item.desc && (
                        <p className="text-[#120d0e]/75 text-sm md:text-base">{item.desc}</p>
                      )}
                      {item.prices && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.prices.map((p) => (
                            <span key={p.label} className="text-xs md:text-sm font-bold tracking-wider bg-[#120d0e] text-[#f3eee9] px-3 py-1 border border-[#120d0e]">
                              {p.label} - {p.price}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="reveal-up motion-card mt-20 bg-[#120d0e] text-[#f3eee9] p-8 md:p-12 border-4 border-[#e61a23]">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="font-display text-3xl md:text-4xl">
                <span className="text-[#e61a23]">*</span> SIZE MATTERS
              </div>
              <p className="md:col-span-2 text-sm md:text-lg">
                <span className="font-black">GRAND SIZE:</span> +1,0 TND supplement on all espresso-based drinks.
                <br />
                <span className="font-black">EXTRAS:</span> Nappage / Sirops (Caramel, Vanille, Chocolat, Cookies) +1,0 DT - Creme Chantilly Royale +2,0 DT.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <button onClick={() => { onNav('landing'); window.scrollTo({ top: 0 }); }} className="ripple-target mobile-tap motion-card bg-[#e61a23] text-[#f3eee9] hover:bg-[#120d0e] px-8 py-4 font-black tracking-widest border-2 border-[#120d0e] transition-colors">
              ← BACK TO HOME
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ LANDING PAGE ============
function LandingPage({ onNav }: { onNav: (page: Page, anchor?: string) => void }) {
  return (
    <>
      <Hero onNav={onNav} />
      <Marquee />
      <Story />
      <CategoryGrid onNav={onNav} />
      <HappyHour onNav={onNav} />
      <Reviews />
      <Visit />
      <Footer onNav={onNav} />
    </>
  );
}

// ============ APP ============
function App() {
  const [page, setPage] = useState<Page>('landing');
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);
  const introReady = useIntroReady();

  useSilkyPageMotion(page);
  useMagneticMotion(page);
  useInteractionRipples(page);

  const handleNav = (p: Page, anchor?: string) => {
    setPage(p);
    setPendingAnchor(anchor ?? null);
    if (!anchor) {
      smoothScrollToY(0);
    }
  };

  useEffect(() => {
    if (!pendingAnchor) return;
    const frame = window.requestAnimationFrame(() => {
      smoothScrollToElement(pendingAnchor);
      setPendingAnchor(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page, pendingAnchor]);

  return (
    <div className="min-h-screen bg-[#f3eee9] text-[#120d0e]">
      <IntroCurtain ready={introReady} />
      <Navbar onNav={handleNav} />
      <main key={page} className="page-shell">
        {page === 'landing' ? <LandingPage onNav={handleNav} /> : <MenuPage onNav={handleNav} />}
      </main>
    </div>
  );
}

export default App;
