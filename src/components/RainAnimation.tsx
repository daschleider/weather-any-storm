'use client';

import { useEffect, useRef } from 'react';

interface RainAnimationProps {
  intensity: 'ambient' | 'burst';
}

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

export default function RainAnimation({ intensity }: RainAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const animRef = useRef<number>(0);
  const intensityRef = useRef(intensity);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialise ambient drops
    const createDrop = (x?: number): Drop => ({
      x: x ?? Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      length: Math.random() * 60 + 20,
      speed: Math.random() * 5 + 4,
      opacity: Math.random() * 0.55 + 0.1,
      width: Math.random() < 0.15 ? 1.5 : 1,
    });

    const AMBIENT_COUNT = 80;
    dropsRef.current = Array.from({ length: AMBIENT_COUNT }, () => createDrop());

    let burstDrops: Drop[] = [];

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const allDrops = [...dropsRef.current, ...burstDrops];

      allDrops.forEach((d) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${d.opacity})`;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';

        const grad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.length);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.4, `rgba(255,255,255,${d.opacity})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.strokeStyle = grad;

        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();
        ctx.restore();

        d.y += d.speed;

        if (d.y > canvas.height + d.length) {
          d.y = -d.length - Math.random() * 200;
          d.x = Math.random() * canvas.width;
          d.speed = Math.random() * 5 + 4;
          d.opacity = Math.random() * 0.55 + 0.1;
          d.length = Math.random() * 60 + 20;
        }
      });

      // Burst: add extra drops, fade quickly
      if (intensityRef.current === 'burst' && burstDrops.length < 60) {
        for (let i = 0; i < 8; i++) {
          burstDrops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -100,
            length: Math.random() * 90 + 30,
            speed: Math.random() * 10 + 8,
            opacity: Math.random() * 0.8 + 0.2,
            width: 1,
          });
        }
      }

      // Prune burst drops that left screen
      burstDrops = burstDrops.filter(d => d.y < canvas.height + 200);

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="rain-canvas"
      aria-hidden="true"
    />
  );
}
