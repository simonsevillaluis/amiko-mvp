import type { StudentPortalIconName } from "@/components/student-portal-icons";

// ─── Core types ───────────────────────────────────────────────────────────────

export type ChildStudent = {
  id: string;
  name: string;
  initial: string;
  age: number;
  grade: string;
};

export type ChildStep = {
  number: number;
  instruction: string;
  visualSupport: string;
  icon: StudentPortalIconName;
};

// 3 progressive hints: first clue → focused clue → full solution
// missingSlot: which value the student must find.
//   undefined / "answer" → classic column format (a OP b = __)
//   "a"                  → __ OP b = answer  (inline)
//   "b"                  → a OP __ = answer  (inline)
export type MathExercise = {
  id: string;
  a: number;
  b: number;
  operator: "+" | "-";
  answer: number;
  missingSlot?: "a" | "b" | "answer";
  amikoIntro: string;
  hints: [string, string, string];
};

export type ChildTask = {
  id: string;
  title: string;
  subject: string;
  icon: StudentPortalIconName;
  reward: string;
  rewardIcon: StudentPortalIconName;
  steps: ChildStep[];
  taskType?: "math" | "reading" | "science";
  mathExercises?: MathExercise[];
  taskDescription?: string;
  tutorNote?: string;
  visualKeywords?: string[];
  // "assigned_by_tutor" = tutor prepared it → workspace uses Pasos/Amiko/Recursos tabs
  // "created_by_student" = student's own study space → uses Materiales/Amiko/Recursos tabs
  origin?: "assigned_by_tutor" | "created_by_student";
};

export type SupportContact = {
  id: string;
  name: string;
  role: string;
  initial: string;
};

export type EmotionOption = {
  icon: StudentPortalIconName;
  label: string;
  value: string;
};

// ─── Student ──────────────────────────────────────────────────────────────────

export const childStudent: ChildStudent = {
  id: "student-1",
  name: "Angel",
  initial: "A",
  age: 9,
  grade: "4to grado",
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const childTasks: ChildTask[] = [
  {
    id: "task-1",
    title: "Sumas y restas",
    subject: "Matemáticas",
    icon: "math",
    reward: "Pausa corta",
    rewardIcon: "calm",
    taskType: "math",
    taskDescription: "Practica sumas y restas de dos cifras. Resuelve cada ejercicio de a uno. Puedes pedir pistas si lo necesitas.",
    tutorNote: "Empieza siempre por las unidades (los números de la derecha). Puedes usar los dedos para contar.",
    visualKeywords: ["número", "decenas", "unidades"],
    mathExercises: [
      {
        id: "ex-1",
        a: 20, b: 71, operator: "+", answer: 91,
        amikoIntro: "¡Empezamos! Primer ejercicio: 20 + 71",
        hints: [
          "Mira primero los números de la derecha (las unidades).",
          "Unidades: 0 + 1 = 1. Ahora las decenas: 2 + 7.",
          "2 + 7 = 9. Entonces 20 + 71 = 91. ¡Así se hace!",
        ],
      },
      {
        id: "ex-2",
        a: 45, b: 12, operator: "-", answer: 33,
        amikoIntro: "¡Muy bien! Ahora: 45 − 12",
        hints: [
          "Empieza por los números de la derecha (las unidades).",
          "Unidades: 5 − 2 = 3. Ahora las decenas: 4 − 1.",
          "4 − 1 = 3. Entonces 45 − 12 = 33. ¡Excelente!",
        ],
      },
      {
        id: "ex-3",
        a: 33, b: 26, operator: "+", answer: 59,
        amikoIntro: "¡Genial! Siguiente: 33 + 26",
        hints: [
          "Suma primero las unidades (los de la derecha).",
          "Unidades: 3 + 6 = 9. Ahora las decenas: 3 + 2.",
          "3 + 2 = 5. Entonces 33 + 26 = 59. ¡Lo lograste!",
        ],
      },
      {
        id: "ex-4",
        a: 80, b: 35, operator: "-", answer: 45,
        amikoIntro: "¡Vamos! Ahora: 80 − 35",
        hints: [
          "Empieza por las unidades: 0 − 5. Como 0 es menor que 5, pedimos prestado.",
          "Pedimos 1 decena: ahora las unidades son 10 − 5 = 5.",
          "Decenas: 7 − 3 = 4. Entonces 80 − 35 = 45. ¡Muy bien!",
        ],
      },
      {
        id: "ex-5",
        a: 14, b: 9, operator: "+", answer: 23,
        amikoIntro: "¡Último ejercicio! 14 + 9",
        hints: [
          "Suma las unidades: 4 + 9. ¿Pasamos de 10?",
          "4 + 9 = 13. Escribís el 3 y llevás 1 a las decenas.",
          "Decenas: 1 + 1 = 2. Entonces 14 + 9 = 23. ¡Terminaste!",
        ],
      },
    ],
    // Generic steps kept for fallback (non-math render)
    steps: [
      { number: 1, instruction: "Abre el libro en la pagina 24", visualSupport: "Libro abierto", icon: "reading" },
      { number: 2, instruction: "Lee el primer problema despacio", visualSupport: "Ojos leyendo", icon: "look" },
      { number: 3, instruction: "Marca los numeros importantes", visualSupport: "Lapiz marcando", icon: "write" },
      { number: 4, instruction: "Haz la suma o la resta", visualSupport: "Cuaderno y lapiz", icon: "math" },
      { number: 5, instruction: "Escribe una respuesta corta", visualSupport: "Respuesta escrita", icon: "check" },
    ],
  },
  {
    id: "task-2",
    title: "Leer un cuento",
    subject: "Lectura",
    icon: "reading",
    reward: "Dibujar un momento",
    rewardIcon: "draw",
    taskType: "reading",
    taskDescription: "Lee el cuento de tu libro paso a paso. Tómate tu tiempo con cada párrafo.",
    steps: [
      { number: 1, instruction: "Busca el cuento en tu libro", visualSupport: "Buscar la pagina", icon: "look" },
      { number: 2, instruction: "Lee el titulo", visualSupport: "Titulo grande", icon: "reading" },
      { number: 3, instruction: "Lee un parrafo a la vez", visualSupport: "Un parrafo", icon: "task" },
      { number: 4, instruction: "Piensa de que trata", visualSupport: "Idea principal", icon: "think" },
    ],
  },
  {
    id: "task-3",
    title: "Animales y habitats",
    subject: "Ciencias",
    icon: "science",
    reward: "Respirar tranquilo",
    rewardIcon: "calm",
    taskType: "science",
    taskDescription: "Aprende sobre los animales y los lugares donde viven.",
    steps: [
      { number: 1, instruction: "Mira las imagenes", visualSupport: "Fotos de animales", icon: "look" },
      { number: 2, instruction: "Busca donde vive cada animal", visualSupport: "Casa o habitat", icon: "home" },
      { number: 3, instruction: "Une cada animal con su lugar", visualSupport: "Linea conectando", icon: "write" },
    ],
  },
  {
    id: "task-4",
    title: "Número que falta",
    subject: "Matemáticas",
    icon: "math",
    reward: "Pausa corta",
    rewardIcon: "calm",
    taskType: "math",
    taskDescription: "Descubre qué número falta en cada ecuación. Piensa: ¿qué número sumado al otro da ese resultado?",
    tutorNote: "Podés restar el número que ves al resultado para encontrar el que falta.",
    visualKeywords: ["número", "suma", "ecuación"],
    mathExercises: [
      {
        id: "miss-1",
        a: 20, b: 71, operator: "+", answer: 91,
        missingSlot: "b",
        amikoIntro: "20 + __ = 91. ¿Qué número falta?",
        hints: [
          "Piensa: 20 más algo es 91.",
          "91 − 20 = ¿cuánto?",
          "91 − 20 = 71. ¡El número que falta es 71!",
        ],
      },
      {
        id: "miss-2",
        a: 8, b: 2, operator: "+", answer: 10,
        missingSlot: "b",
        amikoIntro: "8 + __ = 10. ¿Qué número falta?",
        hints: [
          "Piensa: 8 más algo llega a 10.",
          "¿Cuántos dedos le faltan a 8 para llegar a 10?",
          "10 − 8 = 2. ¡El número que falta es 2!",
        ],
      },
      {
        id: "miss-3",
        a: 45, b: 12, operator: "-", answer: 33,
        missingSlot: "b",
        amikoIntro: "45 − __ = 33. ¿Qué número falta?",
        hints: [
          "Piensa: a 45 le resto algo y queda 33.",
          "33 + __ = 45. ¿Cuánto le falta a 33 para llegar a 45?",
          "45 − 33 = 12. ¡El número que falta es 12!",
        ],
      },
      {
        id: "miss-4",
        a: 30, b: 25, operator: "+", answer: 55,
        missingSlot: "a",
        amikoIntro: "__ + 25 = 55. ¿Qué número falta?",
        hints: [
          "Piensa: algo más 25 da 55.",
          "55 − 25 = ¿cuánto?",
          "55 − 25 = 30. ¡El número que falta es 30!",
        ],
      },
      {
        id: "miss-5",
        a: 7, b: 3, operator: "+", answer: 10,
        missingSlot: "a",
        amikoIntro: "__ + 3 = 10. ¿Qué número falta?",
        hints: [
          "Piensa: algo más 3 da 10.",
          "Cuenta desde 3 hasta 10: ¿cuántos pasos?",
          "10 − 3 = 7. ¡El número que falta es 7!",
        ],
      },
    ],
    steps: [],
  },
];

// ─── Support contacts ─────────────────────────────────────────────────────────

export const supportContacts: SupportContact[] = [
  { id: "contact-1", name: "Mama", role: "Madre", initial: "M" },
  { id: "contact-2", name: "Papa", role: "Padre", initial: "P" },
  { id: "contact-3", name: "Abuela Rosa", role: "Abuela", initial: "R" },
  { id: "contact-4", name: "Profe Maria", role: "Docente", initial: "D" },
];

// ─── Emotion options ──────────────────────────────────────────────────────────

export const emotionOptions: EmotionOption[] = [
  { icon: "smile", label: "Muy bien", value: "muy_bien" },
  { icon: "check", label: "Bien", value: "bien" },
  { icon: "steady", label: "Regular", value: "regular" },
  { icon: "tired", label: "Cansado", value: "cansado" },
  { icon: "sad", label: "Triste", value: "triste" },
];

// ─── Break activities ─────────────────────────────────────────────────────────

export const breakActivities: Array<{
  icon: StudentPortalIconName;
  label: string;
}> = [
  { icon: "water",   label: "Tomar agua"   },
  { icon: "stretch", label: "Estirarme"    },
  { icon: "draw",    label: "Dibujar"      },
  { icon: "eyes",    label: "Cerrar ojos"  },
  { icon: "calm",    label: "Respirar"     },
  { icon: "music",   label: "Musica suave" },
];

// ─── Greeting ─────────────────────────────────────────────────────────────────

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

// ─── Aliases ──────────────────────────────────────────────────────────────────

export const studentPortalStudent = childStudent;
export const studentPortalTasks   = childTasks;
export type StudentPortalStudent  = ChildStudent;
export type StudentPortalTask     = ChildTask;
export type StudentPortalStep     = ChildStep;
