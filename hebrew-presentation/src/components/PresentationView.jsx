import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import usePresentation from '../store/usePresentation';
import SlideRenderer from './SlideRenderer';

const VARIANTS = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

export default function PresentationView({ onExit }) {
  const { presentation, activeSlideIndex, setActiveSlide } = usePresentation();
  const slides = presentation.slides;
  const [idx, setIdx] = useState(activeSlideIndex || 0);
  const [dir, setDir] = useState(0);

  const go = useCallback((newIdx) => {
    if (newIdx < 0 || newIdx >= slides.length) return;
    setDir(newIdx > idx ? 1 : -1);
    setIdx(newIdx);
    setActiveSlide(slides[newIdx].id);
  }, [idx, slides, setActiveSlide]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') go(idx + 1);
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') go(idx - 1);
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [idx, go, onExit]);

  const slide = slides[idx];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#000' }}
    >
      {/* Exit */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-10 text-sm px-3 py-1.5 rounded"
        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        ✕ יציאה (Esc)
      </button>

      {/* Slide counter */}
      <div
        className="absolute top-4 right-4 text-sm"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {idx + 1} / {slides.length}
      </div>

      {/* Slide */}
      <div className="w-full max-w-6xl px-8">
        <div className="slide-canvas w-full relative rounded-xl overflow-hidden shadow-2xl">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={slide?.id}
              custom={dir}
              variants={VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              {slide && (
                <SlideRenderer
                  slide={slide}
                  templateId={presentation.template}
                  scale={1}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={() => go(idx - 1)}
          disabled={idx === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: idx === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.2)',
            color: idx === 0 ? '#333' : '#C9A84C',
            border: `1px solid ${idx === 0 ? '#1a1a1a' : '#C9A84C40'}`,
          }}
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                background: i === idx ? '#C9A84C' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(idx + 1)}
          disabled={idx === slides.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: idx === slides.length - 1 ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.2)',
            color: idx === slides.length - 1 ? '#333' : '#C9A84C',
            border: `1px solid ${idx === slides.length - 1 ? '#1a1a1a' : '#C9A84C40'}`,
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
