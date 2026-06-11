import { AnimatePresence, motion } from 'framer-motion';
import SlideEditor from './SlideEditor';
import TemplatePanel from './TemplatePanel';
import AIPanel from './AIPanel';
import ExportPanel from './ExportPanel';

const PANEL_WIDTH = 300;

export default function RightPanel({ activePanel, unsplashKey, apiKey, onApiKeyChange }) {
  const panels = { edit: SlideEditor, template: TemplatePanel, ai: AIPanel, export: ExportPanel };
  const ActiveComponent = panels[activePanel];

  return (
    <AnimatePresence mode="wait">
      {activePanel && ActiveComponent && (
        <motion.div
          key={activePanel}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: PANEL_WIDTH, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="h-full overflow-hidden shrink-0"
          style={{ borderLeft: '1px solid #1e1e1e', background: '#0d0d0d' }}
        >
          <div style={{ width: PANEL_WIDTH }} className="h-full overflow-y-auto">
            {activePanel === 'edit' && <SlideEditor unsplashKey={unsplashKey} />}
            {activePanel === 'template' && <TemplatePanel />}
            {activePanel === 'ai' && (
              <AIPanel apiKey={apiKey} onApiKeyChange={onApiKeyChange} />
            )}
            {activePanel === 'export' && <ExportPanel />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
