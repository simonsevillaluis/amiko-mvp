export type ChildStudent = {
  id: string;
  name: string;
  avatar: string;
  age: number;
  grade: string;
};

export type ChildTask = {
  id: string;
  title: string;
  subject: string;
  emoji: string;
  reward: string;
  rewardEmoji: string;
  steps: ChildStep[];
};

export type ChildStep = {
  number: number;
  instruction: string;
  visualSupport: string;
  pictogram: string;
};

export type SupportContact = {
  id: string;
  name: string;
  role: string;
  emoji: string;
};

export type EmotionOption = {
  emoji: string;
  label: string;
  value: string;
};

export const childStudent: ChildStudent = {
  id: "student-1",
  name: "Mateo",
  avatar: "🐻",
  age: 9,
  grade: "4to grado",
};

export const childTasks: ChildTask[] = [
  {
    id: "task-1",
    title: "Sumas y restas",
    subject: "Matemáticas",
    emoji: "📐",
    reward: "Jugar 15 minutos",
    rewardEmoji: "🎮",
    steps: [
      {
        number: 1,
        instruction: "Abre el libro en la página 24",
        visualSupport: "Libro abierto",
        pictogram: "📖",
      },
      {
        number: 2,
        instruction: "Lee el primer problema despacio",
        visualSupport: "Ojos leyendo",
        pictogram: "👀",
      },
      {
        number: 3,
        instruction: "Marca los números importantes",
        visualSupport: "Lápiz marcando",
        pictogram: "✏️",
      },
      {
        number: 4,
        instruction: "Haz la suma o la resta en tu cuaderno",
        visualSupport: "Cuaderno y lápiz",
        pictogram: "📝",
      },
      {
        number: 5,
        instruction: "Escribe la respuesta corta",
        visualSupport: "Respuesta escrita",
        pictogram: "✅",
      },
    ],
  },
  {
    id: "task-2",
    title: "Leer un cuento",
    subject: "Lectura",
    emoji: "📚",
    reward: "Dibujar lo que quieras",
    rewardEmoji: "🎨",
    steps: [
      {
        number: 1,
        instruction: "Busca el cuento en tu libro",
        visualSupport: "Buscar la página",
        pictogram: "🔍",
      },
      {
        number: 2,
        instruction: "Lee el título del cuento",
        visualSupport: "Título grande",
        pictogram: "📰",
      },
      {
        number: 3,
        instruction: "Lee un párrafo a la vez",
        visualSupport: "Un párrafo",
        pictogram: "📄",
      },
      {
        number: 4,
        instruction: "Piensa: ¿de qué trata?",
        visualSupport: "Nube de pensamiento",
        pictogram: "💭",
      },
    ],
  },
  {
    id: "task-3",
    title: "Animales y hábitats",
    subject: "Ciencias",
    emoji: "🌿",
    reward: "Ver tu video favorito",
    rewardEmoji: "📺",
    steps: [
      {
        number: 1,
        instruction: "Mira las imágenes de animales",
        visualSupport: "Fotos de animales",
        pictogram: "🦁",
      },
      {
        number: 2,
        instruction: "¿Dónde vive cada animal?",
        visualSupport: "Casas de animales",
        pictogram: "🏠",
      },
      {
        number: 3,
        instruction: "Dibuja una línea del animal a su hogar",
        visualSupport: "Línea conectando",
        pictogram: "✏️",
      },
    ],
  },
];

export const supportContacts: SupportContact[] = [
  { id: "contact-1", name: "Mamá", role: "Madre", emoji: "👩" },
  { id: "contact-2", name: "Papá", role: "Padre", emoji: "👨" },
  { id: "contact-3", name: "Abuela Rosa", role: "Abuela", emoji: "👵" },
  { id: "contact-4", name: "Profe María", role: "Docente", emoji: "👩‍🏫" },
];

export const emotionOptions: EmotionOption[] = [
  { emoji: "😊", label: "Muy bien", value: "muy_bien" },
  { emoji: "🙂", label: "Bien", value: "bien" },
  { emoji: "😐", label: "Regular", value: "regular" },
  { emoji: "😟", label: "No tan bien", value: "no_tan_bien" },
  { emoji: "😢", label: "Triste", value: "triste" },
];

export const breakActivities = [
  { emoji: "💧", label: "Tomar agua" },
  { emoji: "🤸", label: "Estirarme" },
  { emoji: "🎨", label: "Dibujar" },
  { emoji: "👁️", label: "Cerrar ojos" },
  { emoji: "🧸", label: "Abrazar peluche" },
  { emoji: "🎵", label: "Escuchar música" },
];

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "¡Buenos días";
  if (hour < 18) return "¡Buenas tardes";
  return "¡Buenas noches";
}
