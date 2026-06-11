import { useState, useEffect } from 'react';
import usePresentation from '../store/usePresentation';
import ImagePanel from './ImagePanel';

const inputStyle = {
  background: '#1a1a1a',
  border: '1px solid #2e2e2e',
  borderRadius: 6,
  color: '#f0f0f0',
  padding: '8px 12px',
  fontSize: 14,
  width: '100%',
  direction: 'rtl',
  outline: 'none',
  fontFamily: 'Heebo, sans-serif',
};

const labelStyle = {
  color: '#888',
  fontSize: 12,
  marginBottom: 4,
  display: 'block',
  fontFamily: 'Heebo, sans-serif',
};

export default function SlideEditor({ unsplashKey }) {
  const { presentation, activeSlideId, updateSlide } = usePresentation();
  const slide = presentation.slides.find((s) => s.id === activeSlideId);

  const [bullets, setBullets] = useState([]);

  useEffect(() => {
    if (slide) setBullets(slide.bullets || []);
  }, [slide?.id]);

  if (!slide) return (
    <div className="flex items-center justify-center h-full" style={{ color: '#444' }}>
      <span>אין שקופית נבחרת</span>
    </div>
  );

  const save = (updates) => updateSlide(slide.id, updates);

  const updateBullets = (newBullets) => {
    setBullets(newBullets);
    save({ bullets: newBullets });
  };

  const addBullet = () => {
    const nb = [...bullets, ''];
    updateBullets(nb);
  };

  const updateBullet = (i, val) => {
    const nb = [...bullets];
    nb[i] = val;
    updateBullets(nb);
  };

  const deleteBullet = (i) => {
    const nb = bullets.filter((_, idx) => idx !== i);
    updateBullets(nb);
  };

  const moveBullet = (i, dir) => {
    const nb = [...bullets];
    const j = i + dir;
    if (j < 0 || j >= nb.length) return;
    [nb[i], nb[j]] = [nb[j], nb[i]];
    updateBullets(nb);
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4" style={{ background: '#0d0d0d' }}>
      <div
        className="text-xs font-semibold px-2 py-1 rounded inline-block"
        style={{ background: '#1e1e1e', color: '#C9A84C', border: '1px solid #2a2a2a' }}
      >
        {slide.type === 'title' ? 'שקופית כותרת' : slide.type === 'content' ? 'שקופית תוכן' : 'שקופית סיכום'}
      </div>

      {/* Title */}
      <div>
        <label style={labelStyle}>כותרת</label>
        <input
          style={inputStyle}
          value={slide.title || ''}
          onChange={(e) => save({ title: e.target.value })}
          placeholder="הכנס כותרת..."
          onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
          onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
        />
      </div>

      {/* Subtitle (title & summary slides) */}
      {(slide.type === 'title' || slide.type === 'summary') && (
        <div>
          <label style={labelStyle}>כותרת משנה / סיסמה</label>
          <input
            style={inputStyle}
            value={slide.subtitle || ''}
            onChange={(e) => save({ subtitle: e.target.value })}
            placeholder="הכנס כותרת משנה..."
            onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
            onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
          />
        </div>
      )}

      {/* Bullets (content & summary) */}
      {(slide.type === 'content' || slide.type === 'summary') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label style={{ ...labelStyle, marginBottom: 0 }}>נקודות עיקריות</label>
            <button
              onClick={addBullet}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ background: '#1e1e1e', color: '#C9A84C', border: '1px solid #2a2a2a' }}
              onMouseEnter={(e) => e.target.style.background = '#2a2a2a'}
              onMouseLeave={(e) => e.target.style.background = '#1e1e1e'}
            >
              + הוסף
            </button>
          </div>
          <div className="space-y-2">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveBullet(i, -1)}
                    disabled={i === 0}
                    className="text-xs w-5 h-4 flex items-center justify-center rounded"
                    style={{ background: '#1a1a1a', color: i === 0 ? '#333' : '#888' }}
                  >▲</button>
                  <button
                    onClick={() => moveBullet(i, 1)}
                    disabled={i === bullets.length - 1}
                    className="text-xs w-5 h-4 flex items-center justify-center rounded"
                    style={{ background: '#1a1a1a', color: i === bullets.length - 1 ? '#333' : '#888' }}
                  >▼</button>
                </div>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={b}
                  onChange={(e) => updateBullet(i, e.target.value)}
                  placeholder={`נקודה ${i + 1}...`}
                  onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
                  onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
                />
                <button
                  onClick={() => deleteBullet(i)}
                  className="text-sm w-6 h-6 flex items-center justify-center rounded shrink-0"
                  style={{ background: '#1a1a1a', color: '#555' }}
                  onMouseEnter={(e) => { e.target.style.color = '#ef4444'; }}
                  onMouseLeave={(e) => { e.target.style.color = '#555'; }}
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image section */}
      <ImagePanel
        slide={slide}
        onUpdate={(updates) => save(updates)}
        unsplashKey={unsplashKey}
      />
    </div>
  );
}
