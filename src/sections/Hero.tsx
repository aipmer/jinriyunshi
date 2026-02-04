import { useEffect, useRef, useCallback } from 'react';
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

  // Initialize particles once
  useEffect(() => {
    const colors = ['#d4a373', '#e9edc9', '#ccd5ae', '#fefae0'];
    particlesRef.current = [];
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 120 + 60,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, []);

  // Fluid background animation - optimized with frame skipping
  useEffect(() => {
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
        ctx.fillStyle = p.color + '30';
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
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0, rotateX: 15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          delay: 0.3,
          ease: 'expo.out',
        }
      );

      // Button animation
      gsap.fromTo(
        buttonRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.6,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Fluid Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'soft-light' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Decorative Element */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24 animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d4a373] to-[#e9edc9] opacity-30 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center border border-white/60">
              <span className="text-4xl">✨</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-10 leading-tight"
          style={{ perspective: '1000px' }}
        >
          探索你的
          <span className="relative inline-block mx-2">
            <span className="relative z-10 text-[#d4a373]">今日</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-[#e9edc9] -z-0 rounded-full" />
          </span>
          星座运势
        </h1>

        {/* CTA Button */}
        <div ref={buttonRef}>
          <Button
            onClick={scrollToZodiac}
            size="lg"
            className="bg-[#d4a373] hover:bg-[#c49363] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            开始探索
            <ChevronDown className="ml-2 w-5 h-5 animate-bounce" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          {[
            { value: '12', label: '星座' },
            { value: '4', label: '维度' },
            { value: '∞', label: '可能' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center"
              style={{
                opacity: 0,
                animation: `fadeInUp 0.6s ease ${0.8 + index * 0.1}s forwards`,
              }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#d4a373]">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faedcd] to-transparent pointer-events-none" />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
