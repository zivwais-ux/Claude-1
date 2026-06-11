export const TEMPLATES = {
  modern: {
    id: 'modern',
    name: 'מודרני',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    titleColor: '#e8d5a3',
    textColor: '#c8d6e5',
    accentColor: '#e94560',
    subtitleColor: '#a8b8c8',
    bulletBg: 'rgba(233,69,96,0.15)',
    bulletBorder: '#e94560',
    fontClass: 'tpl-modern',
    overlay: 'rgba(0,0,0,0.3)',
  },
  playful: {
    id: 'playful',
    name: 'שובב',
    bg: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
    titleColor: '#2d3436',
    textColor: '#2d3436',
    accentColor: '#6c5ce7',
    subtitleColor: '#2d3436',
    bulletBg: 'rgba(255,255,255,0.5)',
    bulletBorder: '#6c5ce7',
    fontClass: 'tpl-playful',
    overlay: 'rgba(255,255,255,0.1)',
  },
  professional: {
    id: 'professional',
    name: 'מקצועי',
    bg: 'linear-gradient(160deg, #f8f9fa 0%, #e9ecef 100%)',
    titleColor: '#1a1a2e',
    textColor: '#343a40',
    accentColor: '#c9a84c',
    subtitleColor: '#495057',
    bulletBg: 'rgba(201,168,76,0.1)',
    bulletBorder: '#c9a84c',
    fontClass: 'tpl-pro',
    overlay: 'rgba(0,0,0,0.03)',
  },
  nature: {
    id: 'nature',
    name: 'טבע',
    bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    titleColor: '#f0fff4',
    textColor: '#e8f5e9',
    accentColor: '#a8e6cf',
    subtitleColor: '#c8e6c9',
    bulletBg: 'rgba(168,230,207,0.2)',
    bulletBorder: '#a8e6cf',
    fontClass: 'tpl-nature',
    overlay: 'rgba(0,0,0,0.2)',
  },
  tech: {
    id: 'tech',
    name: 'טכנולוגי',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
    titleColor: '#00ff88',
    textColor: '#e0e0e0',
    accentColor: '#00bcd4',
    subtitleColor: '#9e9e9e',
    bulletBg: 'rgba(0,255,136,0.08)',
    bulletBorder: '#00ff88',
    fontClass: 'tpl-tech',
    overlay: 'rgba(0,188,212,0.05)',
  },
};

export const SLIDE_TYPES = {
  title: 'title',
  content: 'content',
  summary: 'summary',
};

export function createSlide(type = 'content', overrides = {}) {
  const base = {
    id: crypto.randomUUID(),
    type,
    title: '',
    subtitle: '',
    bullets: [],
    image: null,
    imagePosition: { x: 50, y: 50 },
    imageOpacity: 1,
  };

  if (type === 'title') {
    base.title = 'כותרת ראשית';
    base.subtitle = 'כותרת משנה';
  } else if (type === 'content') {
    base.title = 'כותרת שקופית';
    base.bullets = ['נקודה ראשונה', 'נקודה שנייה', 'נקודה שלישית'];
  } else if (type === 'summary') {
    base.title = 'סיכום';
    base.bullets = ['נקודה מרכזית ראשונה', 'נקודה מרכזית שנייה'];
    base.subtitle = 'תודה רבה!';
  }

  return { ...base, ...overrides };
}

export function createPresentation(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: 'מצגת חדשה',
    template: 'modern',
    slides: [createSlide('title')],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}
