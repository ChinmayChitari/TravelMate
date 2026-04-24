import { create } from 'zustand';

const useStore = create((set) => ({
  user: { name: 'Traveler', avatar: '✈️' },
  tours: [],
  recommendations: [],
  setTours: (tours) => set({ tours }),
  setRecommendations: (recommendations) => set({ recommendations }),
}));

export default useStore;
