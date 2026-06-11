import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import usePresentation from '../store/usePresentation';
import SlideRenderer from './SlideRenderer';

const TYPE_LABELS = { title: 'כותרת', content: 'תוכן', summary: 'סיכום' };

export default function Sidebar() {
  const {
    presentation,
    activeSlideId,
    setActiveSlide,
    addSlide,
    deleteSlide,
    duplicateSlide,
    moveSlide,
  } = usePresentation();

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e, slide, idx) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, slide, idx });
  };

  const closeCtx = () => setContextMenu(null);

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: '#111', borderLeft: '1px solid #2a2a2a', width: 200 }}
      onClick={closeCtx}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{ borderBottom: '1px solid #222', background: '#0d0d0d' }}
      >
        <span className="text-xs font-semibold" style={{ color: '#C9A84C' }}>
          שקופיות ({presentation.slides.length})
        </span>
      </div>

      {/* Add buttons */}
      <div className="flex gap-1 px-2 py-2 shrink-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
        {['title', 'content', 'summary'].map((t) => (
          <button
            key={t}
            onClick={() => {
              const idx = presentation.slides.findIndex((s) => s.id === activeSlideId);
              addSlide(t, idx);
            }}
            className="flex-1 text-xs py-1 rounded transition-all"
            style={{ background: '#1e1e1e', color: '#888', border: '1px solid #2a2a2a' }}
            onMouseEnter={(e) => { e.target.style.background = '#2a2a2a'; e.target.style.color = '#C9A84C'; }}
            onMouseLeave={(e) => { e.target.style.background = '#1e1e1e'; e.target.style.color = '#888'; }}
            title={`הוסף שקופית ${TYPE_LABELS[t]}`}
          >
            {t === 'title' ? 'כ' : t === 'content' ? 'ת' : 'ס'}
          </button>
        ))}
      </div>

      {/* Slide list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-2">
        {presentation.slides.map((slide, idx) => (
          <motion.div
            key={slide.id}
            layoutId={slide.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative cursor-pointer rounded-md overflow-hidden group"
            style={{
              border: slide.id === activeSlideId
                ? '2px solid #C9A84C'
                : '2px solid #2a2a2a',
              boxShadow: slide.id === activeSlideId ? '0 0 10px rgba(201,168,76,0.3)' : 'none',
            }}
            onClick={() => setActiveSlide(slide.id)}
            onContextMenu={(e) => handleContextMenu(e, slide, idx)}
          >
            {/* Thumbnail */}
            <div className="slide-canvas w-full" style={{ pointerEvents: 'none' }}>
              <div style={{ transform: 'scale(0.25)', transformOrigin: 'top right', width: '400%', height: '400%' }}>
                <SlideRenderer
                  slide={slide}
                  templateId={presentation.template}
                  scale={0.35}
                  isPreview
                />
              </div>
            </div>

            {/* Slide number overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1 flex items-center justify-between"
              style={{ background: 'rgba(0,0,0,0.7)' }}
            >
              <span className="text-xs" style={{ color: '#666' }}>{idx + 1}</span>
              <span className="text-xs" style={{ color: '#555' }}>{TYPE_LABELS[slide.type]}</span>
            </div>

            {/* Hover actions */}
            <div
              className="absolute top-1 left-1 gap-1 hidden group-hover:flex"
            >
              <button
                onClick={(e) => { e.stopPropagation(); duplicateSlide(slide.id); }}
                className="w-5 h-5 rounded text-xs flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.8)', color: '#000' }}
                title="שכפל"
              >⧉</button>
              {presentation.slides.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }}
                  className="w-5 h-5 rounded text-xs flex items-center justify-center"
                  style={{ background: 'rgba(220,38,38,0.8)', color: '#fff' }}
                  title="מחק"
                >✕</button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 rounded-lg overflow-hidden shadow-xl"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            background: '#1a1a1a',
            border: '1px solid #333',
            minWidth: 160,
          }}
        >
          {[
            { label: 'שכפל שקופית', action: () => duplicateSlide(contextMenu.slide.id) },
            { label: 'הוסף אחרי', action: () => addSlide('content', contextMenu.idx) },
            { label: '─────────', action: null },
            { label: 'מחק שקופית', action: () => deleteSlide(contextMenu.slide.id), danger: true },
          ].map((item, i) => (
            item.action ? (
              <button
                key={i}
                onClick={() => { item.action(); closeCtx(); }}
                className="w-full text-right px-4 py-2 text-sm block transition-colors"
                style={{ color: item.danger ? '#ef4444' : '#ccc', background: 'transparent' }}
                onMouseEnter={(e) => e.target.style.background = '#2a2a2a'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {item.label}
              </button>
            ) : (
              <div key={i} className="px-4 py-1 text-xs" style={{ color: '#444' }}>{item.label}</div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
