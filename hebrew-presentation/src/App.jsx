import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import usePresentation from './store/usePresentation';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import SlideRenderer from './components/SlideRenderer';
import RightPanel from './components/RightPanel';
import PresentationView from './components/PresentationView';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const {
    presentation,
    activeSlideId,
    activeSlideIndex,
    initActiveSlide,
    updateSlide,
    newPresentation,
  } = usePresentation();

  const [activePanel, setActivePanel] = useState('edit');
  const [presenting, setPresenting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [unsplashKey, setUnsplashKey] = useState(
    () => localStorage.getItem('unsplash_key') || ''
  );
  const [anthropicKey, setAnthropicKey] = useState(
    () => localStorage.getItem('anthropic_key') || ''
  );

  const saveUnsplash = (v) => {
    setUnsplashKey(v);
    localStorage.setItem('unsplash_key', v);
  };

  const saveAnthropic = (v) => {
    setAnthropicKey(v);
    localStorage.setItem('anthropic_key', v);
  };

  useEffect(() => {
    initActiveSlide();
  }, []);

  const activeSlide = presentation.slides.find((s) => s.id === activeSlideId);

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0a0a0a', direction: 'rtl' }}>
      <Toolbar
        activePanel={activePanel}
        onPanel={setActivePanel}
        onNew={newPresentation}
        onSettings={() => setSettingsOpen(true)}
        onPresent={() => setPresenting(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas area */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden"
          style={{ background: '#0f0f0f' }}
        >
          <div className="w-full max-w-5xl">
            {/* Actions row */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs" style={{ color: '#444' }}>
                שקופית {activeSlideIndex + 1} מתוך {presentation.slides.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="text-xs px-3 py-1.5 rounded transition-all"
                  style={{ background: '#141414', color: '#666', border: '1px solid #2a2a2a' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C9A84C';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#666';
                    e.currentTarget.style.borderColor = '#2a2a2a';
                  }}
                >
                  ⚙ מפתחות API
                </button>
                <button
                  onClick={() => setPresenting(true)}
                  className="text-xs px-4 py-1.5 rounded font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  ▶ הצג מצגת
                </button>
              </div>
            </div>

            {/* Slide canvas */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlideId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="slide-canvas w-full rounded-xl overflow-hidden"
                style={{
                  boxShadow:
                    '0 25px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,168,76,0.15)',
                }}
              >
                {activeSlide ? (
                  <SlideRenderer
                    slide={activeSlide}
                    templateId={presentation.template}
                    scale={1}
                    interactive
                    onImageDrag={(pos) =>
                      updateSlide(activeSlide.id, { imagePosition: pos })
                    }
                  />
                ) : (
                  <div
                    className="flex items-center justify-center w-full h-full"
                    style={{ background: '#111', color: '#333', minHeight: 400 }}
                  >
                    בחר שקופית מהסרגל הצדדי
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Auto-save badge */}
            <div className="flex items-center justify-end mt-2 gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#22c55e', boxShadow: '0 0 4px #22c55e' }}
              />
              <span className="text-xs" style={{ color: '#2d4a2d' }}>
                נשמר אוטומטית ב-localStorage
              </span>
            </div>
          </div>
        </div>

        {/* Right panel (editor / template / AI / export) */}
        <RightPanel
          activePanel={activePanel}
          unsplashKey={unsplashKey}
          apiKey={anthropicKey}
          onApiKeyChange={saveAnthropic}
        />
      </div>

      {/* Full-screen presentation view */}
      <AnimatePresence>
        {presenting && (
          <PresentationView onExit={() => setPresenting(false)} />
        )}
      </AnimatePresence>

      {/* Settings / API keys modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        unsplashKey={unsplashKey}
        onUnsplashKey={saveUnsplash}
        apiKey={anthropicKey}
        onApiKey={saveAnthropic}
      />
    </div>
  );
}
