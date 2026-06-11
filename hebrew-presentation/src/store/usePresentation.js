import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPresentation, createSlide } from '../utils/templates';

const usePresentation = create(
  persist(
    (set, get) => ({
      presentation: createPresentation(),
      activeSlideId: null,
      activeSlideIndex: 0,

      initActiveSlide: () => {
        const { presentation } = get();
        if (presentation.slides.length > 0) {
          set({
            activeSlideId: presentation.slides[0].id,
            activeSlideIndex: 0,
          });
        }
      },

      setActiveSlide: (id) => {
        const { presentation } = get();
        const idx = presentation.slides.findIndex((s) => s.id === id);
        set({ activeSlideId: id, activeSlideIndex: idx });
      },

      updatePresentation: (updates) => {
        set((s) => ({
          presentation: {
            ...s.presentation,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      setTemplate: (templateId) => {
        set((s) => ({
          presentation: {
            ...s.presentation,
            template: templateId,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      addSlide: (type = 'content', afterIndex = null) => {
        const newSlide = createSlide(type);
        set((s) => {
          const slides = [...s.presentation.slides];
          const insertAt =
            afterIndex !== null ? afterIndex + 1 : slides.length;
          slides.splice(insertAt, 0, newSlide);
          return {
            presentation: {
              ...s.presentation,
              slides,
              updatedAt: new Date().toISOString(),
            },
            activeSlideId: newSlide.id,
            activeSlideIndex: insertAt,
          };
        });
      },

      deleteSlide: (id) => {
        set((s) => {
          const slides = s.presentation.slides.filter((sl) => sl.id !== id);
          if (slides.length === 0) slides.push(createSlide('title'));
          const newActive = slides[0];
          return {
            presentation: {
              ...s.presentation,
              slides,
              updatedAt: new Date().toISOString(),
            },
            activeSlideId: newActive.id,
            activeSlideIndex: 0,
          };
        });
      },

      duplicateSlide: (id) => {
        set((s) => {
          const idx = s.presentation.slides.findIndex((sl) => sl.id === id);
          if (idx === -1) return s;
          const orig = s.presentation.slides[idx];
          const copy = { ...orig, id: crypto.randomUUID() };
          const slides = [...s.presentation.slides];
          slides.splice(idx + 1, 0, copy);
          return {
            presentation: {
              ...s.presentation,
              slides,
              updatedAt: new Date().toISOString(),
            },
            activeSlideId: copy.id,
            activeSlideIndex: idx + 1,
          };
        });
      },

      updateSlide: (id, updates) => {
        set((s) => ({
          presentation: {
            ...s.presentation,
            slides: s.presentation.slides.map((sl) =>
              sl.id === id ? { ...sl, ...updates } : sl
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      moveSlide: (fromIdx, toIdx) => {
        set((s) => {
          const slides = [...s.presentation.slides];
          const [moved] = slides.splice(fromIdx, 1);
          slides.splice(toIdx, 0, moved);
          return {
            presentation: {
              ...s.presentation,
              slides,
              updatedAt: new Date().toISOString(),
            },
            activeSlideIndex: toIdx,
          };
        });
      },

      loadPresentation: (data) => {
        set({
          presentation: data,
          activeSlideId: data.slides[0]?.id || null,
          activeSlideIndex: 0,
        });
      },

      newPresentation: () => {
        const p = createPresentation();
        set({
          presentation: p,
          activeSlideId: p.slides[0].id,
          activeSlideIndex: 0,
        });
      },

      setSlides: (slides) => {
        set((s) => ({
          presentation: {
            ...s.presentation,
            slides,
            updatedAt: new Date().toISOString(),
          },
          activeSlideId: slides[0]?.id || null,
          activeSlideIndex: 0,
        }));
      },
    }),
    {
      name: 'hebrew-presentation-store',
      partialize: (s) => ({ presentation: s.presentation }),
    }
  )
);

export default usePresentation;
