import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Free Mixkit stock videos — freelancers coding, remote work, designers
const VIDEO_SLIDES = [
  {
    src: 'https://assets.mixkit.co/videos/4699/4699-720.mp4',
    title: 'Build with world-class freelancers',
    tag: 'TRUSTED BY 10,000+ TEAMS',
  },
  {
    src: 'https://assets.mixkit.co/videos/4434/4434-720.mp4',
    title: 'Remote talent. Real results.',
    tag: 'WORK FROM ANYWHERE',
  },
  {
    src: 'https://assets.mixkit.co/videos/4625/4625-720.mp4',
    title: 'Designers, developers & creators',
    tag: 'VERIFIED PROFESSIONALS',
  },
  {
    src: 'https://assets.mixkit.co/videos/4787/4787-720.mp4',
    title: 'Hire faster. Ship sooner.',
    tag: 'HOURLY · PART-TIME · FULL-TIME',
  },
];

const HeroVideoBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % VIDEO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = VIDEO_SLIDES[index];

  return (
    <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[380px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.src}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <video
            key={slide.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={slide.src} type="video/mp4" />
          </video>
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-orange-900/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.2em] text-orange-300 bg-orange-500/20 backdrop-blur-sm border border-orange-400/40 rounded-full px-3 py-1 mb-3">
              {slide.tag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg">
              {slide.title}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {VIDEO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-8 bg-orange-500' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroVideoBanner;
