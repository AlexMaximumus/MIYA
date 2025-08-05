
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TeacherModeState {
    isTeacherMode: boolean;
    isNewTeacher: boolean;
    enableTeacherMode: () => void;
    disableTeacherMode: () => void;
}

export const useTeacherMode = create<TeacherModeState>()(
    persist(
        (set, get) => ({
            isTeacherMode: false,
            isNewTeacher: false,
            enableTeacherMode: () => {
                if (!get().isTeacherMode) {
                    set({ isTeacherMode: true, isNewTeacher: true });
                    // After a short delay, set isNewTeacher to false
                    // so the welcome message doesn't appear every time.
                    setTimeout(() => {
                        set({ isNewTeacher: false });
                    }, 5000); // 5 seconds
                }
            },
            disableTeacherMode: () => set({ isTeacherMode: false, isNewTeacher: false }),
        }),
        {
            name: 'miya-lingo-teacher-mode',
            storage: createJSONStorage(() => localStorage),
            // Only persist isTeacherMode state
            partialize: (state) => ({ isTeacherMode: state.isTeacherMode }),
        }
    )
);
