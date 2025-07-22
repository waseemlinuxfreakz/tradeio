import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FollowState {
  following: number[];
  toggleFollow: (userId: number) => void;
  isFollowing: (userId: number) => boolean;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      following: [],
      toggleFollow: (userId) => set((state) => ({
        following: state.following.includes(userId)
          ? state.following.filter(id => id !== userId)
          : [...state.following, userId]
      })),
      isFollowing: (userId) => get().following.includes(userId)
    }),
    {
      name: 'follow-storage'
    }
  )
);