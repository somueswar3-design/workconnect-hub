import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Video URLs (free stock videos related to IT/tech work)
const slides = [
  {
    id: 1,
    video: 'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4',
    title: 'Connect with IT Professionals',
    subtitle: 'Find skilled developers, designers & tech experts ready to help',
    badge: '🚀 500+ Active Freelancers',
    cta: { primary: 'Become a Freelancer', secondary: 'Need Work Support' },
  },
  {
    id: 2,
    video: 'https://videos.pexels.com/video-files/5473119/5473119-uhd_2560_1440_24fps.mp4',
    title: 'Work From Anywhere',
    subtitle: 'Flexible remote opportunities that fit your schedule',
    badge: '🌐 Remote First Platform',
    cta: { primary: 'Start Freelancing', secondary: 'Hire Talent' },
  },
  {
    id: 3,
    video: 'https://videos.pexels.com/video-files/6804115/6804115-uhd_2732_1440_25fps.mp4',
    title: 'Privacy Protected',
    subtitle: 'Your identity stays hidden until you choose to reveal it',
    badge: '🔒 Secure & Anonymous',
    cta: { primary: 'Join Now', secondary: 'Learn More' },
  },
  {
    id: 4,
    video: 'https://videos.pexels.com/video-files/7988703/7988703-uhd_2732_1440_24fps.mp4',
    title: 'Fair Compensation',
    subtitle: 'Set your own rates and get paid for your expertise',
    badge: '💰 Transparent Pricing',
    cta: { primary: 'Register Today', secondary: 'Browse Projects' },
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: 'easeOut' as const },
  }),
};

const HeroSlider = () => {
  const particles = useMemo(() => 
    [...Array(5)].map(() => ({
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      xMove: Math.random() * 100 - 50,
      yMove: Math.random() * 100 - 50,
      duration: Math.random() * 10 + 10,
    })), []);

  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const paginate = useCallback((newDirection: number) => {
    setSlide(([prev]) => {
      const next = prev + newDirection;
      if (next < 0) return [slides.length - 1, newDirection];
      if (next >= slides.length) return [0, newDirection];
      return [next, newDirection];
    });
    setIsVideoLoaded(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [isPlaying, paginate]);

  const goToSlide = (index: number) => {
    const newDirection = index > currentSlide ? 1 : -1;
    setSlide([index, newDirection]);
    setIsVideoLoaded(false);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={slide.video} type="video/mp4" />
          </video>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </motion.div>
      </AnimatePresence>

      {/* Animated particles/shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container h-full flex items-center">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              <motion.div custom={0} variants={textVariants}>
                <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm text-sm px-4 py-2">
                  {slide.badge}
                </Badge>
              </motion.div>

              <motion.h1
                custom={0.1}
                variants={textVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
              >
                <span className="text-primary">IT</span>
                <span className="text-secondary">Work</span>
                <span className="text-primary">Help</span>
                <br />
                <span className="text-foreground">{slide.title}</span>
              </motion.h1>

              <motion.p
                custom={0.2}
                variants={textVariants}
                className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl"
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                custom={0.3}
                variants={textVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="gap-2 text-lg px-8 py-6 shadow-lg shadow-primary/25">
                    <Link to="/register">
                      {slide.cta.primary}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="gap-2 text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground backdrop-blur-sm"
                  >
                    <Link to="/browse">
                      {slide.cta.secondary}
                      <Users className="h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          className="pointer-events-auto h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-foreground hover:bg-background/40 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(1)}
          className="pointer-events-auto h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-foreground hover:bg-background/40 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Slide Indicators & Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-foreground hover:bg-background/40 transition-colors"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </motion.button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-primary' : 'w-3 bg-foreground/30 hover:bg-foreground/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  layoutId="activeSlide"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Slide counter */}
        <span className="text-sm text-foreground/60 font-medium">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-foreground/50">
          <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-y-8">Scroll</span>
          <div className="w-0.5 h-12 bg-gradient-to-b from-foreground/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSlider;
