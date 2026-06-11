import { motion, AnimatePresence } from 'framer-motion';

const inputStyle = {
  background: '#111',
  border: '1px solid #2e2e2e',
  borderRadius: 6,
  color: '#f0f0f0',
  padding: '10px 14px',
  fontSize: 14,
  width: '100%',
  direction: 'ltr',
  outline: 'none',
  fontFamily: 'Heebo, sans-serif',
};

export default function SettingsModal({ open, onClose, unsplashKey, onUnsplashKey, apiKey, onApiKey }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="rounded-xl p-6 w-full max-w-md"
          style={{ background: '#141414', border: '1px solid #2a2a2a' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: '#C9A84C' }}>⚙️ הגדרות</h2>
            <button onClick={onClose} style={{ color: '#555' }}>✕</button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-2" style={{ color: '#888' }}>
                מפתח Unsplash API
              </label>
              <input
                style={inputStyle}
                type="password"
                value={unsplashKey}
                onChange={(e) => onUnsplashKey(e.target.value)}
                placeholder="הכנס Access Key מ-Unsplash..."
                onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
                onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
              />
              <p className="text-xs mt-1" style={{ color: '#444' }}>
                קבל מפתח בחינם באתר unsplash.com/developers
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#888' }}>
                מפתח Anthropic API (Claude)
              </label>
              <input
                style={inputStyle}
                type="password"
                value={apiKey}
                onChange={(e) => onApiKey(e.target.value)}
                placeholder="sk-ant-..."
                onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
                onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
              />
              <p className="text-xs mt-1" style={{ color: '#444' }}>
                קבל מפתח מ-console.anthropic.com
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 rounded-lg font-semibold text-sm"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            שמור וסגור
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
