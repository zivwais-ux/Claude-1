import { TEMPLATES } from '../utils/templates';
import usePresentation from '../store/usePresentation';

export default function TemplatePanel() {
  const { presentation, setTemplate } = usePresentation();

  return (
    <div className="space-y-2 p-4">
      <div className="text-xs font-semibold mb-3" style={{ color: '#888' }}>
        עיצוב תבנית
      </div>
      <div className="space-y-2">
        {Object.values(TEMPLATES).map((tpl) => {
          const active = presentation.template === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-right transition-all"
              style={{
                background: active ? '#1e1a0e' : '#141414',
                border: `1px solid ${active ? '#C9A84C' : '#2a2a2a'}`,
                boxShadow: active ? '0 0 8px rgba(201,168,76,0.2)' : 'none',
              }}
            >
              {/* Swatch */}
              <div
                className="w-10 h-6 rounded shrink-0"
                style={{
                  background: tpl.bg,
                  border: `2px solid ${tpl.accentColor}`,
                  minWidth: 40,
                }}
              />
              <div>
                <div
                  className="text-sm font-medium"
                  style={{ color: active ? '#C9A84C' : '#ccc' }}
                >
                  {tpl.name}
                </div>
                <div className="text-xs" style={{ color: '#555' }}>
                  {tpl.id}
                </div>
              </div>
              {active && (
                <span className="mr-auto text-xs" style={{ color: '#C9A84C' }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
