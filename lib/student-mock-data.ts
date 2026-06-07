import type { StudentPortalIconName } from "@/components/student-portal-icons";

export type ChildStudent = {
  id: string;
  name: string;
  initial: string;
  age: number;
  grade: string;
};

export type ChildTask = {
  id: string;
  title: string;
  subject: string;
  icon: StudentPortalIconName;
  reward: string;
  rewardIcon: StudentPortalIconName;
  steps: ChildStep[];
};

export type ChildStep = {
  number: number;
  instruction: string;
  visualSupport: string;
  icon: StudentPortalIconName;
};

export type SupportContact = {
  id: string;
  name: string;
  role: string;
  initial: string;
};

export type EmotionOption = {
  icon: StudentPortalIconName;
  emoji: string;
  label: string;
  value: string;
};

export const childStudent: ChildStudent = {
  id: "student-1",
  name: "Angel",
  initial: "A",
  age: 9,
  grade: "4to grado",
};

export const childTasks: ChildTask[] = [
  {
    id: "task-1",
    title: "Sumas y restas",
    subject: "Matematicas",
    icon: "math",
    reward: "Pausa corta",
    rewardIcon: "calm",
    steps: [
      {
        number: 1,
        instruction: "Abre el libro en la pagina 24",
        visualSupport: "Libro abierto",
        icon: "reading",
      },
      {
        number: 2,
        instruction: "Lee el primer problema despacio",
        visualSupport: "Ojos leyendo",
        icon: "look",
      },
      {
        number: 3,
        instruction: "Marca los numeros importantes",
        visualSupport: "Lapiz marcando",
        icon: "write",
      },
      {
        number: 4,
        instruction: "Haz la suma o la resta",
        visualSupport: "Cuaderno y lapiz",
        icon: "math",
      },
      {
        number: 5,
        instruction: "Escribe una respuesta corta",
        visualSupport: "Respuesta escrita",
        icon: "check",
      },
    ],
  },
  {
    id: "task-2",
    title: "Leer un cuento",
    subject: "Lectura",
    icon: "reading",
    reward: "Dibujar un momento",
    rewardIcon: "draw",
    steps: [
      {
        number: 1,
        instruction: "Busca el cuento en tu libro",
        visualSupport: "Buscar la pagina",
        icon: "look",
      },
      {
        number: 2,
        instruction: "Lee el titulo",
        visualSupport: "Titulo grande",
        icon: "reading",
      },
      {
        number: 3,
        instruction: "Lee un parrafo a la vez",
        visualSupport: "Un parrafo",
        icon: "task",
      },
      {
        number: 4,
        instruction: "Piensa de que trata",
        visualSupport: "Idea principal",
        icon: "think",
      },
    ],
  },
  {
    id: "task-3",
    title: "Animales y habitats",
    subject: "Ciencias",
    icon: "science",
    reward: "Respirar tranquilo",
    rewardIcon: "calm",
    steps: [
      {
        number: 1,
        instruction: "Mira las imagenes",
        visualSupport: "Fotos de animales",
        icon: "look",
      },
      {
        number: 2,
        instruction: "Busca donde vive cada animal",
        visualSupport: "Casa o habitat",
        icon: "home",
      },
      {
        number: 3,
        instruction: "Une cada animal con su lugar",
        visualSupport: "Linea conectando",
        icon: "write",
      },
    ],
  },
];

export const supportContacts: SupportContact[] = [
  { id: "contact-1", name: "Mama", role: "Madre", initial: "M" },
  { id: "contact-2", name: "Papa", role: "Padre", initial: "P" },
  { id: "contact-3", name: "Abuela Rosa", role: "Abuela", initial: "R" },
  { id: "contact-4", name: "Profe Maria", role: "Docente", initial: "D" },
];

export const emotionOptions: EmotionOption[] = [
  { icon: "smile", emoji: "😊", label: "Muy bien", value: "muy_bien" },
  { icon: "check", emoji: "🙂", label: "Bien", value: "bien" },
  { icon: "steady", emoji: "😐", label: "Regular", value: "regular" },
  { icon: "tired", emoji: "🥱", label: "Cansado", value: "cansado" },
  { icon: "sad", emoji: "😢", label: "Triste", value: "triste" },
];

export const breakActivities: Array<{
  icon: StudentPortalIconName;
  label: string;
}> = [
  { icon: "water", label: "Tomar agua" },
  { icon: "stretch", label: "Estirarme" },
  { icon: "draw", label: "Dibujar" },
  { icon: "eyes", label: "Cerrar ojos" },
  { icon: "calm", label: "Respirar" },
  { icon: "music", label: "Musica suave" },
];

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

// Student-named aliases for components that use student-portal terminology.
export const studentPortalStudent = childStudent;
export const studentPortalTasks = childTasks;
export type StudentPortalStudent = ChildStudent;
export type StudentPortalTask = ChildTask;
export type StudentPortalStep = ChildStep;
