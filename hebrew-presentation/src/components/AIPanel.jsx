import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import usePresentation from '../store/usePresentation';
import { createSlide } from '../utils/templates';

const inputStyle = {
  background: '#1a1a1a',
  border: '1px solid #2e2e2e',
  borderRadius: 6,
  color: '#f0f0f0',
  padding: '8px 12px',
  fontSize: 13,
  width: '100%',
  direction: 'rtl',
  outline: 'none',
  fontFamily: 'Heebo, sans-serif',
};

const AGE_GROUPS = [
  'ילדים (6-10)',
  'ילדים מבוגרים (10-14)',
  'נוער (14-18)',
  'מבוגרים',
  'מקצועי / עסקי',
];

export default function AIPanel({ apiKey, onApiKeyChange }) {
  const { setSlides, updatePresentation } = usePresentation();
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState(AGE_GROUPS[3]);
  const [slideCount, setSlideCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!apiKey) { setError('נדרש מפתח Anthropic API'); return; }
    if (!topic.trim()) { setError('נא להזין נושא'); return; }
    setLoading(true);
    setError('');
    setProgress('מחשב תוכן...');

    const prompt = `צור תוכן למצגת בעברית על הנושא: "${topic}"
קהל יעד: ${ageGroup}
מספר שקופיות: ${slideCount} (כולל שקופית כותרת ושקופית סיכום)

החזר JSON בלבד, ללא הסברים נוספים, בפורמט הבא:
{
  "title": "כותרת המצגת",
  "slides": [
    {
      "type": "title",
      "title": "כותרת ראשית מרשימה",
      "subtitle": "כותרת משנה",
      "bullets": []
    },
    {
      "type": "content",
      "title": "כותרת פרק",
      "subtitle": "",
      "bullets": ["נקודה ראשונה", "נקודה שנייה", "נקודה שלישית"]
    },
    {
      "type": "summary",
      "title": "סיכום",
      "subtitle": "תודה!",
      "bullets": ["מסקנה ראשונה", "מסקנה שנייה"]
    }
  ]
}

חשוב: כל הטקסט חייב להיות בעברית. צור בדיוק ${slideCount} שקופיות.
השקופית הראשונה חייבת להיות type "title" והאחרונה type "summary".
שאר השקופיות הן type "content" עם 3-4 bullets כל אחת.`;

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      setProgress('מייצר תוכן בעברית...');

      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      setProgress('מעבד תשובה...');
      const raw = message.content[0].text.trim();
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('תשובה לא תקינה מהמודל');
      const data = JSON.parse(jsonMatch[0]);

      const slides = data.slides.map((s) =>
        createSlide(s.type || 'content', {
          title: s.title || '',
          subtitle: s.subtitle || '',
          bullets: s.bullets || [],
        })
      );

      setSlides(slides);
      updatePresentation({ title: data.title || topic });
      setProgress('');
    } catch (e) {
      setError(e.message || 'שגיאה בייצור תוכן');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-xs font-semibold" style={{ color: '#888' }}>
        יצירת תוכן בינה מלאכותית
      </div>

      {/* API Key */}
      <div>
        <label className="text-xs block mb-1.5" style={{ color: '#666' }}>
          מפתח Anthropic API
        </label>
        <input
          style={inputStyle}
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="sk-ant-..."
          onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
          onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
        />
      </div>

      {/* Topic */}
      <div>
        <label className="text-xs block mb-1.5" style={{ color: '#666' }}>נושא המצגת</label>
        <input
          style={inputStyle}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="לדוגמה: מהפכת הבינה המלאכותית"
          onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
          onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
        />
      </div>

      {/* Age Group */}
      <div>
        <label className="text-xs block mb-1.5" style={{ color: '#666' }}>קהל יעד</label>
        <select
          style={inputStyle}
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
          onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
        >
          {AGE_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Slide count */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs" style={{ color: '#666' }}>מספר שקופיות</label>
          <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>{slideCount}</span>
        </div>
        <input
          type="range"
          min="3"
          max="12"
          value={slideCount}
          onChange={(e) => setSlideCount(parseInt(e.target.value))}
          className="w-full"
          style={{ accentColor: '#C9A84C' }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: '#444' }}>
          <span>3</span><span>12</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs p-2 rounded" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      {/* Progress */}
      {progress && (
        <p className="text-xs" style={{ color: '#C9A84C' }}>⏳ {progress}</p>
      )}

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={loading}
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all"
        style={{
          background: loading
            ? '#1a1a1a'
            : 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
          color: loading ? '#555' : '#000',
          border: loading ? '1px solid #2a2a2a' : 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '⏳ מייצר...' : '✨ צור מצגת'}
      </button>

      <p className="text-xs text-center" style={{ color: '#444' }}>
        ישתמש במודל Claude Haiku
      </p>
    </div>
  );
}
