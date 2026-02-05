import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
  }> | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const lastFrameTime = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  // Check visibility on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Initialize particles once
  useEffect(() => {
    // Skip canvas animation on mobile for better performance
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    const colors = ['#d4a373', '#e9edc9', '#ccd5ae', '#fefae0'];
    particlesRef.current = [];
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 100 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, []);

  // Fluid background animation - optimized with frame skipping
  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return; // Skip animation on mobile

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = (timestamp: number) => {
      // Skip frames for 30fps to reduce load
      if (timestamp - lastFrameTime.current < 33) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      const particles = particlesRef.current;
      if (!particles || !ctx || !canvas) return;

      ctx.fillStyle = '#faedcd';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move towards mouse slightly (simplified)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        p.vx += dx * 0.00002;
        p.vy += dy * 0.00002;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap around
        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;

        // Draw with simplified gradient
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '25';
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!isVisible) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'expo.out',
        }
      );

      // Button animation
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          delay: 0.5,
          ease: 'back.out(1.7)',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isVisible]);

  const scrollToZodiac = useCallback(() => {
    const element = document.querySelector('#zodiac');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#faedcd]"
    >
      {/* Fluid Background Canvas - hidden on mobile */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full hidden md:block"
        style={{ mixBlendMode: 'soft-light' }}
      />

      {/* Static background for mobile */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-br from-[#faedcd] via-[#fefae0] to-[#faedcd]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Decorative Element */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d4a373] to-[#e9edc9] opacity-30 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center border border-white/60">
              <span className="text-3xl sm:text-4xl">✨</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 sm:mb-10 leading-tight"
          style={{ opacity: isVisible ? undefined : 0 }}
        >
          探索你的
          <span className="relative inline-block mx-1 sm:mx-2">
            <span className="relative z-10 text-[#d4a373]">今日</span>
            <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 bg-[#e9edc9] -z-0 rounded-full" />
          </span>
          星座运势
        </h1>

        {/* CTA Button */}
        <div ref={buttonRef} style={{ opacity: isVisible ? undefined : 0 }}>
          <Button
            onClick={scrollToZodiac}
            size="lg"
            className="bg-[#d4a373] hover:bg-[#c49363] text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            开始探索
            <ChevronDown className="ml-2 w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-xs sm:max-w-md mx-auto">
          {[
            { value: '12', label: '星座' },
            { value: '4', label: '维度' },
            { value: '∞', label: '可能' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${0.6 + index * 0.1}s`,
              }}
            >
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#d4a373]">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-[#faedcd] to-transparent pointer-events-none" />
    </section>
  );
}
