// MVP: stored in localStorage.
// Future: student_profiles.sound_enabled_by_tutor + sound_enabled_by_student in Supabase.
const TUTOR_KEY = "amiko_sound_tutor";
const STUDENT_KEY = "amiko_sound_student";

function get(key: string): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(key) !== "0";
}

function set(key: string, v: boolean): void {
  if (typeof window !== "undefined") localStorage.setItem(key, v ? "1" : "0");
}

export const soundSettings = {
  getTutorEnabled:   () => get(TUTOR_KEY),
  setTutorEnabled:   (v: boolean) => set(TUTOR_KEY, v),
  getStudentEnabled: () => get(STUDENT_KEY),
  setStudentEnabled: (v: boolean) => set(STUDENT_KEY, v),
  // canPlay = tutor_enabled AND student_enabled
  canPlay: () => get(TUTOR_KEY) && get(STUDENT_KEY),
};
