import usePresentation from '../store/usePresentation';

const NAV_HEIGHT = 52;

export default function Toolbar({ onNew, activePanel, onPanel }) {
  const { presentation, updatePresentation } = usePresentation();

  const panels = [
    { id: 'edit', label: 'עריכה', icon: '✏️' },
    { id: 'template', label: 'תבנית', icon: '🎨' },
    { id: 'ai', label: 'AI', icon: '✨' },
    { id: 'export', label: 'ייצוא', icon: '📤' },
  ];

  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        height: NAV_HEIGHT,
        background: '#0d0d0d',
        borderBottom: '1px solid #1e1e1e',
        zIndex: 50,
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div
          className="text-sm font-black"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ✦ Hebrew Slides
        </div>
        <button
          onClick={onNew}
          className="text-xs px-2 py-1 rounded"
          style={{ background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a' }}
          onMouseEnter={(e) => { e.target.style.color = '#C9A84C'; e.target.style.borderColor = '#C9A84C'; }}
          onMouseLeave={(e) => { e.target.style.color = '#666'; e.target.style.borderColor = '#2a2a2a'; }}
        >
          + חדש
        </button>
      </div>

      {/* Center: presentation title */}
      <input
        value={presentation.title || ''}
        onChange={(e) => updatePresentation({ title: e.target.value })}
        className="text-center text-sm font-medium bg-transparent border-b outline-none transition-colors"
        style={{
          color: '#ddd',
          borderColor: 'transparent',
          width: 280,
          fontFamily: 'Heebo, sans-serif',
          direction: 'rtl',
        }}
        onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
        onBlur={(e) => e.target.style.borderColor = 'transparent'}
        placeholder="שם המצגת"
      />

      {/* Right: Panel tabs */}
      <div className="flex items-center gap-1">
        {panels.map((p) => (
          <button
            key={p.id}
            onClick={() => onPanel(p.id === activePanel ? null : p.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: activePanel === p.id ? '#1e1a0e' : 'transparent',
              color: activePanel === p.id ? '#C9A84C' : '#666',
              border: activePanel === p.id ? '1px solid #C9A84C40' : '1px solid transparent',
            }}
          >
            <span>{p.icon}</span>
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
