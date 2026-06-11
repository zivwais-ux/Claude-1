import { useRef, useState } from 'react';
import { TEMPLATES } from '../utils/templates';

function BulletPoint({ text, tpl }) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg px-4 py-2 mb-2"
      style={{
        background: tpl.bulletBg,
        borderRight: `3px solid ${tpl.bulletBorder}`,
      }}
    >
      <span style={{ color: tpl.accentColor, fontWeight: 700, marginTop: 2 }}>◆</span>
      <span style={{ color: tpl.textColor, fontSize: 'inherit' }}>{text}</span>
    </div>
  );
}

export default function SlideRenderer({
  slide,
  templateId,
  scale = 1,
  onImageDrag,
  interactive = false,
  isPreview = false,
}) {
  const tpl = TEMPLATES[templateId] || TEMPLATES.modern;
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);

  const handleMouseDown = (e) => {
    if (!interactive || !slide.image) return;
    e.preventDefault();
    setDragging(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: slide.imagePosition?.x ?? 50,
      posY: slide.imagePosition?.y ?? 50,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.current.mouseX) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.current.mouseY) / rect.height) * 100;
    const newX = Math.max(0, Math.min(100, dragStart.current.posX + dx));
    const newY = Math.max(0, Math.min(100, dragStart.current.posY + dy));
    onImageDrag?.({ x: newX, y: newY });
  };

  const handleMouseUp = () => setDragging(false);

  const fontSize = (base) => `${base * scale}px`;
  const px = slide.imagePosition?.x ?? 50;
  const py = slide.imagePosition?.y ?? 50;
  const opacity = slide.imageOpacity ?? 1;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: tpl.bg, fontFamily: 'Heebo, sans-serif', direction: 'rtl' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background overlay */}
      <div className="absolute inset-0" style={{ background: tpl.overlay }} />

      {/* Background image */}
      {slide.image && (
        <img
          ref={imgRef}
          src={slide.image}
          alt=""
          className="absolute"
          style={{
            opacity,
            width: '60%',
            height: '60%',
            objectFit: 'cover',
            left: `${px}%`,
            top: `${py}%`,
            transform: 'translate(-50%, -50%)',
            cursor: interactive ? (dragging ? 'grabbing' : 'grab') : 'default',
            borderRadius: '8px',
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
      )}

      {/* Decorative elements based on template */}
      {templateId === 'tech' && (
        <>
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #00ff88, transparent)' }} />
          <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #00bcd4, transparent)' }} />
          <div className="absolute top-8 left-8 w-16 h-16 rounded-full" style={{ border: '1px solid rgba(0,255,136,0.2)' }} />
          <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full" style={{ border: '1px solid rgba(0,188,212,0.15)' }} />
        </>
      )}
      {templateId === 'modern' && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'rgba(233,69,96,0.1)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: 'rgba(233,69,96,0.08)' }} />
        </>
      )}
      {templateId === 'playful' && (
        <>
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
          <div className="absolute top-12 left-16 w-4 h-4 rounded-full" style={{ background: 'rgba(108,92,231,0.5)' }} />
          <div className="absolute bottom-6 right-8 w-6 h-6 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
        </>
      )}
      {templateId === 'nature' && (
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(168,230,207,0.15) 0%, transparent 60%)' }} />
      )}
      {templateId === 'professional' && (
        <>
          <div className="absolute top-0 right-0 w-2 h-full" style={{ background: tpl.accentColor }} />
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: tpl.accentColor }} />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-12 py-8">
        {slide.type === 'title' && (
          <div className="flex flex-col items-end text-right">
            {templateId === 'professional' && (
              <div className="w-16 h-1 mb-6" style={{ background: tpl.accentColor }} />
            )}
            <h1
              className="font-black leading-tight mb-4"
              style={{
                color: tpl.titleColor,
                fontSize: fontSize(isPreview ? 18 : 48),
                textShadow: ['modern','nature','tech'].includes(templateId) ? '0 2px 20px rgba(0,0,0,0.5)' : 'none',
                fontFamily: templateId === 'professional' ? 'Frank Ruhl Libre, serif' : 'Heebo, sans-serif',
              }}
            >
              {slide.title || 'כותרת המצגת'}
            </h1>
            {slide.subtitle && (
              <p
                className="font-light"
                style={{
                  color: tpl.subtitleColor,
                  fontSize: fontSize(isPreview ? 10 : 24),
                  fontFamily: templateId === 'professional' ? 'Frank Ruhl Libre, serif' : 'Heebo, sans-serif',
                }}
              >
                {slide.subtitle}
              </p>
            )}
            {templateId === 'tech' && (
              <div className="mt-4" style={{ color: tpl.accentColor, fontSize: fontSize(isPreview ? 7 : 14), fontFamily: 'monospace' }}>
                {'>>> ' + (slide.subtitle || 'מוכן להתחיל')}
              </div>
            )}
          </div>
        )}

        {slide.type === 'content' && (
          <div className="flex flex-col w-full">
            <h2
              className="font-bold mb-4 pb-2 text-right"
              style={{
                color: tpl.titleColor,
                fontSize: fontSize(isPreview ? 13 : 32),
                borderBottom: `2px solid ${tpl.accentColor}`,
                fontFamily: templateId === 'professional' ? 'Frank Ruhl Libre, serif' : 'Heebo, sans-serif',
              }}
            >
              {slide.title || 'כותרת שקופית'}
            </h2>
            <div style={{ fontSize: fontSize(isPreview ? 9 : 20) }}>
              {(slide.bullets || []).map((b, i) => (
                <BulletPoint key={i} text={b} tpl={tpl} />
              ))}
            </div>
          </div>
        )}

        {slide.type === 'summary' && (
          <div className="flex flex-col items-end text-right w-full">
            <h2
              className="font-bold mb-6"
              style={{
                color: tpl.titleColor,
                fontSize: fontSize(isPreview ? 14 : 36),
                fontFamily: templateId === 'professional' ? 'Frank Ruhl Libre, serif' : 'Heebo, sans-serif',
              }}
            >
              {slide.title || 'סיכום'}
            </h2>
            <div className="w-full mb-6" style={{ fontSize: fontSize(isPreview ? 8 : 18) }}>
              {(slide.bullets || []).map((b, i) => (
                <BulletPoint key={i} text={b} tpl={tpl} />
              ))}
            </div>
            {slide.subtitle && (
              <p
                className="font-bold mt-4"
                style={{
                  color: tpl.accentColor,
                  fontSize: fontSize(isPreview ? 11 : 28),
                  fontFamily: templateId === 'professional' ? 'Frank Ruhl Libre, serif' : 'Heebo, sans-serif',
                }}
              >
                {slide.subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Slide number */}
      {!isPreview && (
        <div
          className="absolute bottom-4 left-6 text-sm opacity-50"
          style={{ color: tpl.textColor }}
        />
      )}
    </div>
  );
}
