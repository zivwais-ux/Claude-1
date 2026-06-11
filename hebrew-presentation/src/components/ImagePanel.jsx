import { useState } from 'react';

const inputStyle = {
  background: '#1a1a1a',
  border: '1px solid #2e2e2e',
  borderRadius: 6,
  color: '#f0f0f0',
  padding: '6px 10px',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'Heebo, sans-serif',
  direction: 'rtl',
};

export default function ImagePanel({ slide, onUpdate, unsplashKey }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchUnsplash = async () => {
    if (!unsplashKey) {
      setError('נדרש מפתח Unsplash');
      return;
    }
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${unsplashKey}` } }
      );
      if (!res.ok) throw new Error('שגיאה בחיפוש');
      const data = await res.json();
      setResults(data.results || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectImage = (url) => {
    onUpdate({
      image: url,
      imagePosition: { x: 50, y: 50 },
      imageOpacity: 0.4,
    });
    setResults([]);
  };

  const removeImage = () => {
    onUpdate({ image: null });
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold" style={{ color: '#888' }}>תמונה</div>

      {/* Current image */}
      {slide.image && (
        <div className="relative rounded-lg overflow-hidden" style={{ border: '1px solid #2e2e2e' }}>
          <img
            src={slide.image}
            alt=""
            className="w-full h-24 object-cover"
            style={{ opacity: slide.imageOpacity ?? 1 }}
          />
          <button
            onClick={removeImage}
            className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: 'rgba(220,38,38,0.9)', color: '#fff' }}
          >✕</button>
        </div>
      )}

      {/* Opacity slider */}
      {slide.image && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: '#888' }}>שקיפות תמונה</span>
            <span className="text-xs" style={{ color: '#C9A84C' }}>
              {Math.round((slide.imageOpacity ?? 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={slide.imageOpacity ?? 1}
            onChange={(e) => onUpdate({ imageOpacity: parseFloat(e.target.value) })}
            className="w-full accent-yellow-500"
            style={{ accentColor: '#C9A84C' }}
          />
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <input
          style={{ ...inputStyle, flex: 1 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חפש תמונה..."
          onKeyDown={(e) => e.key === 'Enter' && searchUnsplash()}
          onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
          onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
        />
        <button
          onClick={searchUnsplash}
          disabled={loading}
          className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          style={{
            background: loading ? '#1a1a1a' : '#C9A84C',
            color: loading ? '#555' : '#000',
            border: 'none',
          }}
        >
          {loading ? '...' : 'חפש'}
        </button>
      </div>

      {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-1">
          {results.map((img) => (
            <img
              key={img.id}
              src={img.urls.small}
              alt={img.alt_description || ''}
              className="w-full h-16 object-cover rounded cursor-pointer transition-all"
              style={{ border: '2px solid transparent' }}
              onClick={() => selectImage(img.urls.regular)}
              onMouseEnter={(e) => e.target.style.borderColor = '#C9A84C'}
              onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
