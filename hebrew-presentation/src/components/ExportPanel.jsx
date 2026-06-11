import usePresentation from '../store/usePresentation';
import SlideRenderer from './SlideRenderer';
import { createRoot } from 'react-dom/client';

export default function ExportPanel() {
  const { presentation } = usePresentation();

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(presentation, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title || 'presentation'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;

    // Build a printable container with all slides
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1120px;background:#000;';
    document.body.appendChild(container);

    for (const slide of presentation.slides) {
      const slideDiv = document.createElement('div');
      slideDiv.style.cssText = `
        width: 1120px;
        height: 630px;
        page-break-after: always;
        overflow: hidden;
        position: relative;
      `;
      container.appendChild(slideDiv);

      // Render each slide using SlideRenderer via a temporary root
      const root = createRoot(slideDiv);
      await new Promise((res) => {
        root.render(
          <SlideRenderer
            slide={slide}
            templateId={presentation.template}
            scale={1}
          />
        );
        setTimeout(res, 300);
      });
    }

    await html2pdf()
      .set({
        margin: 0,
        filename: `${presentation.title || 'presentation'}.pdf`,
        html2canvas: { scale: 1.5, useCORS: true, logging: false },
        jsPDF: { unit: 'px', format: [1120, 630], orientation: 'landscape' },
        pagebreak: { mode: 'avoid-all' },
      })
      .from(container)
      .save();

    document.body.removeChild(container);
  };

  const importJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        usePresentation.getState().loadPresentation(data);
      } catch {
        alert('קובץ JSON לא תקין');
      }
    };
    input.click();
  };

  const btnStyle = (primary = false) => ({
    background: primary ? 'linear-gradient(135deg, #C9A84C, #E8D5A3)' : '#1a1a1a',
    color: primary ? '#000' : '#ccc',
    border: primary ? 'none' : '1px solid #2e2e2e',
    borderRadius: 8,
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    fontFamily: 'Heebo, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    direction: 'rtl',
    transition: 'opacity 0.2s',
  });

  return (
    <div className="space-y-3 p-4">
      <div className="text-xs font-semibold mb-3" style={{ color: '#888' }}>
        ייצוא ויבוא
      </div>

      <button style={btnStyle(true)} onClick={exportPDF}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <span>📄</span> ייצא PDF
      </button>

      <button style={btnStyle()} onClick={exportJSON}
        onMouseEnter={(e) => e.currentTarget.style.background = '#242424'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
      >
        <span>💾</span> ייצא JSON
      </button>

      <button style={btnStyle()} onClick={importJSON}
        onMouseEnter={(e) => e.currentTarget.style.background = '#242424'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
      >
        <span>📂</span> יבא JSON
      </button>

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1e1e1e' }}>
        <div className="text-xs mb-2" style={{ color: '#555' }}>מידע</div>
        <div className="text-xs space-y-1" style={{ color: '#444' }}>
          <div>שקופיות: {presentation.slides.length}</div>
          <div>תבנית: {presentation.template}</div>
          <div>עדכון אחרון: {new Date(presentation.updatedAt).toLocaleString('he-IL')}</div>
        </div>
      </div>
    </div>
  );
}
