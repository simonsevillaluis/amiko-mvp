export type StudentProfile = {
  id: string;
  name: string;
  age: number;
  grade: string;
  supportLevel: "bajo" | "medio" | "alto";
  visualPreferences: string[];
  notes: string;
};

export type AdaptedStep = {
  number: number;
  instruction: string;
  visualSupport: string;
  adultSupport: string;
};

export type AdaptedTask = {
  id: string;
  title: string;
  subject: string;
  originalText: string;
  simpleSummary: string;
  emotionalSupport: string;
  difficultyLevel: "bajo" | "medio" | "alto";
  steps: AdaptedStep[];
};

export type ProgressEvent = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export const student: StudentProfile = {
  id: "student-1",
  name: "Mateo",
  age: 9,
  grade: "4to grado",
  supportLevel: "medio",
  visualPreferences: ["Pictogramas simples", "Pasos numerados", "Colores azul y verde"],
  notes:
    "Comprende mejor cuando la tarea se divide en acciones cortas y puede marcar cada paso terminado.",
};

export const adaptedTask: AdaptedTask = {
  id: "task-1",
  title: "Resolver problemas de suma y resta",
  subject: "Matemática",
  originalText:
    "Lee los cinco problemas de la página 24. Resuelve cada operación y escribe una respuesta completa en tu cuaderno.",
  simpleSummary:
    "Vas a resolver cinco problemas. Primero lees uno, después haces la operación y al final escribes la respuesta.",
  emotionalSupport:
    "Si te sientes cansado, puedes respirar, pedir ayuda y continuar con un solo problema a la vez.",
  difficultyLevel: "medio",
  steps: [
    {
      number: 1,
      instruction: "Abre el libro en la página 24.",
      visualSupport: "Libro abierto",
      adultSupport: "Señala la página y confirma que el estudiante está listo.",
    },
    {
      number: 2,
      instruction: "Lee el primer problema despacio.",
      visualSupport: "Ojos leyendo",
      adultSupport: "Lee junto al estudiante si lo necesita.",
    },
    {
      number: 3,
      instruction: "Marca los números importantes.",
      visualSupport: "Lápiz marcando",
      adultSupport: "Ayuda a identificar qué datos sirven para la operación.",
    },
    {
      number: 4,
      instruction: "Haz la suma o la resta en tu cuaderno.",
      visualSupport: "Cuaderno y lápiz",
      adultSupport: "Ofrece una pausa breve si aparece frustración.",
    },
    {
      number: 5,
      instruction: "Escribe una respuesta corta.",
      visualSupport: "Respuesta escrita",
      adultSupport: "Celebra el avance antes de pasar al siguiente problema.",
    },
  ],
};

export const progressEvents: ProgressEvent[] = [
  {
    id: "progress-1",
    label: "Tareas adaptadas",
    value: "6",
    detail: "Durante los últimos 7 días",
  },
  {
    id: "progress-2",
    label: "Pasos completados",
    value: "22",
    detail: "Con apoyo visual paso a paso",
  },
  {
    id: "progress-3",
    label: "Ayudas solicitadas",
    value: "5",
    detail: "Principalmente en lectura de consignas",
  },
  {
    id: "progress-4",
    label: "Momentos de frustración",
    value: "2",
    detail: "Se registraron pausas y acompañamiento adulto",
  },
];

export const recentTasks = [
  {
    id: "task-1",
    title: "Resolver problemas de suma y resta",
    subject: "Matemática",
    status: "En progreso",
  },
  {
    id: "task-2",
    title: "Leer un cuento y responder preguntas",
    subject: "Lengua",
    status: "Adaptada",
  },
  {
    id: "task-3",
    title: "Clasificar animales por hábitat",
    subject: "Ciencias",
    status: "Completada",
  },
];
