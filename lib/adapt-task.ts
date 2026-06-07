export interface AdaptedStep {
  number: number;
  instruction: string;
  visual_support: string;
  adult_support: string;
}

export interface AdaptationResult {
  originalText: string;
  simple_summary: string;
  steps: AdaptedStep[];
  emotional_support: string;
  difficulty_level: "bajo" | "medio" | "alto";
}

export function generateMockAdaptation(
  taskText: string,
  options: string[] = [],
): AdaptationResult {
  const text = taskText.trim();
  const wordCount = text.split(/\s+/).length;

  const hasRead = /lee|leer|lectura|texto|libro|p[aá]gina|p[aá]g\./i.test(text);
  const hasWrite = /escrib|redact|copi|anot|cuaderno|hoja/i.test(text);
  const hasMath = /suma|resta|multiplic|divis|n[uú]mero|problema|operac|calcul|matem/i.test(text);
  const hasSearch = /investig|busc|consult|explor|averigua/i.test(text);

  const isLong = wordCount > 25 || options.includes("Tarea larga");
  const needsVisual = options.includes("Necesita apoyo visual");
  const mayFrustrate = options.includes("Puede causar frustración");
  const wantsSimple = options.includes("Pasos muy simples");

  const steps: AdaptedStep[] = [];
  let n = 1;

  steps.push({
    number: n++,
    instruction: "Busca un lugar tranquilo y prepara tus materiales.",
    visual_support: needsVisual ? "Imagen: mesa limpia con útiles" : "Mesa ordenada",
    adult_support: "Confirma que el estudiante tiene todo lo que necesita antes de empezar.",
  });

  if (hasRead) {
    steps.push({
      number: n++,
      instruction: "Lee la consigna despacio, una sola vez.",
      visual_support: needsVisual ? "Imagen: ojos leyendo un texto" : "Ojos leyendo",
      adult_support: "Lee junto al estudiante si lo necesita. Pueden señalar las palabras con el dedo.",
    });
  }

  if (hasMath) {
    steps.push({
      number: n++,
      instruction: "Identifica los números y la operación que pide la tarea.",
      visual_support: needsVisual ? "Imagen: números en un cuaderno" : "Cuaderno con números",
      adult_support: "Señala los datos importantes juntos. Pregunta: ¿qué tenemos que calcular?",
    });
  }

  if (hasSearch) {
    steps.push({
      number: n++,
      instruction: "Busca la información que necesitas en el libro o en tus notas.",
      visual_support: needsVisual ? "Imagen: libro abierto" : "Libro abierto",
      adult_support: "Orienta al estudiante hacia dónde buscar sin darle la respuesta directamente.",
    });
  }

  steps.push({
    number: n++,
    instruction: "Realiza lo que pide la tarea, parte por parte.",
    visual_support: needsVisual
      ? hasMath
        ? "Imagen: lápiz resolviendo operaciones"
        : "Imagen: manos trabajando en una hoja"
      : hasMath
        ? "Lápiz y cuaderno"
        : "Hoja de trabajo",
    adult_support: mayFrustrate
      ? "Si aparece frustración, ofrece una pausa breve antes de continuar."
      : "Acompaña el proceso y celebra cada parte terminada.",
  });

  if (hasWrite) {
    steps.push({
      number: n++,
      instruction: "Escribe tu respuesta con tus propias palabras.",
      visual_support: needsVisual ? "Imagen: lápiz escribiendo en cuaderno" : "Lápiz escribiendo",
      adult_support: "Celebra el esfuerzo, no solo el resultado correcto.",
    });
  }

  steps.push({
    number: n++,
    instruction: "Revisa lo que hiciste y confirma que terminaste.",
    visual_support: needsVisual ? "Imagen: palomita de verificación" : "Lista con tilde",
    adult_support: "Pregunta: ¿Terminaste? ¿Cómo te sentiste con esta tarea?",
  });

  const preview = text.length > 90 ? text.slice(0, 90) + "…" : text;

  return {
    originalText: text,
    simple_summary: `Vas a trabajar en esta tarea: "${preview}". Vamos un paso a la vez, sin apuro.`,
    steps: wantsSimple ? steps.slice(0, Math.min(steps.length, 4)) : steps,
    emotional_support: mayFrustrate
      ? "Si te sientes cansado o frustrado, puedes respirar profundo, pedir ayuda y continuar con una sola parte a la vez. Vas bien."
      : "Vas muy bien. Si necesitas una pausa, puedes tomarla y continuar después. Cada paso cuenta.",
    difficulty_level: isLong ? "alto" : wantsSimple ? "bajo" : "medio",
  };
}
