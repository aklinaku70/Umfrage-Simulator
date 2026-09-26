// Skripti i agjentit (çka duhet me e thënë agjenti gjatë thirrjes) dhe
// "motori" i dialogut që gjeneron përgjigjet e klientit të simuluar.

export const AGENT_NAME = "Alex";

export const SCRIPT_STEPS = [
  {
    id: "opening",
    label: "Hapja",
    agentText: `Guten Tag, mein Name ist ${AGENT_NAME}, entschuldigen Sie bitte die Störung. Ich habe 4 Fragen für Sie, es dauert nur 20 Sekunden.`,
  },
  {
    id: "q1",
    label: "Pyetja 1",
    agentText: "Bevorzugen Sie klassische Küche oder gehobene Küche?",
    options: ["A) Klassische Küche", "B) Gehobene Küche"],
  },
  {
    id: "q2",
    label: "Pyetja 2",
    agentText: "Essen Sie lieber Fleisch, Fisch oder vegetarisch?",
    options: ["A) Fleisch", "B) Fisch", "C) Vegetarisch"],
  },
  {
    id: "q3",
    label: "Pyetja 3",
    agentText:
      "Was trinken Sie lieber, Rotwein, Weißwein oder Rosé? Und trinken Sie etwa 2 bis 3 Mal pro Jahr Rot-, Weiß- oder Roséwein?",
    options: ["A) Rotwein", "B) Weißwein", "C) Rosé"],
  },
  {
    id: "q4",
    label: "Pyetja 4",
    agentText: "Bevorzugen Sie leichte Weine oder schwere Weine?",
    options: ["A) Leichte Weine", "B) Schwere Weine"],
  },
  {
    id: "nachname",
    label: "Mbiemri",
    agentText:
      "Entschuldigung, wie ist Ihr Nachname? Können Sie das bitte buchstabieren?",
  },
  {
    id: "vorname",
    label: "Emri",
    agentText: "Und Ihr Vorname bitte? Können Sie das bitte buchstabieren?",
  },
  {
    id: "closing",
    label: "Mbyllja",
    agentText:
      "Als Dankeschön bekommen Sie noch einen Anruf von uns! Vielen Dank für Ihre Zeit, auf Wiederhören!",
  },
];

// Shkronjëzimi gjerman (Buchstabiertafel) — përdoret për të "spelluar" emrin/mbiemrin realisht.
const GERMAN_SPELLING_ALPHABET = {
  A: "Anton",
  Ä: "Ärger",
  B: "Berta",
  C: "Cäsar",
  D: "Dora",
  E: "Emil",
  F: "Friedrich",
  G: "Gustav",
  H: "Heinrich",
  I: "Ida",
  J: "Julius",
  K: "Kaufmann",
  L: "Ludwig",
  M: "Martha",
  N: "Nordpol",
  O: "Otto",
  Ö: "Ökonom",
  P: "Paula",
  Q: "Quelle",
  R: "Richard",
  S: "Samuel",
  T: "Theodor",
  U: "Ulrich",
  Ü: "Übermut",
  V: "Viktor",
  W: "Wilhelm",
  X: "Xanthippe",
  Y: "Ypsilon",
  Z: "Zacharias",
};

export function spellOut(word) {
  return word
    .toUpperCase()
    .split("")
    .map((ch) => GERMAN_SPELLING_ALPHABET[ch] || ch)
    .join(" - ");
}

// Zgjedh deterministikisht një element nga një listë, bazuar në id-në e klientit,
// që çdo klient të ketë pak variacion në përgjigje pa qenë e rastësishme çdo herë.
function pick(list, seed) {
  return list[seed % list.length];
}

/**
 * Kthen "skenarin" e plotë të thirrjes për një klient: për çdo hap të skriptit
 * (nga SCRIPT_STEPS) çka thotë klienti pasi agjenti e ka "check"-uar atë rresht,
 * dhe nëse thirrja mbyllet aty.
 */
export function buildClientCallFlow(client) {
  const seed = client.id;
  const fullName = `${client.vorname} ${client.nachname}`;

  const q1Answer = pick(["A", "B"], seed);
  const q2Answer = pick(["A", "B", "C"], seed);
  const q3Answer = pick(["A", "B", "C"], seed + 1);
  const q4Answer = pick(["A", "B"], seed + 2);

  const politeAcks = ["Ja, gerne.", "In Ordnung.", "Ja, klar."];
  const ack = pick(politeAcks, seed);

  const flows = {
    refuse_immediate: {
      opening: {
        text: "Nein danke, ich habe kein Interesse. Bitte rufen Sie hier nicht mehr an!",
        endCall: true,
        outcome: "REFUZUAR – mos me e thirr me",
      },
    },
    refuse_mid: {
      opening: { text: `${ack} Aber ich habe nicht viel Zeit.` },
      q1: { text: q1Answer === "A" ? "Klassische Küche." : "Gehobene Küche." },
      q2: {
        text: "Entschuldigung, ich muss jetzt wirklich auflegen, ich habe keine Zeit mehr. Rufen Sie vielleicht ein anderes Mal an.",
        endCall: true,
        outcome: "NUK KA KOHË – me thirr ndonjë herë tjetër",
      },
    },
    no_answer: {
      // trajtohet ne UI para se te fillojne hapat e skriptit
    },
    full_polite: {
      opening: { text: `${ack} Sagen Sie bitte.` },
      q1: { text: q1Answer === "A" ? "Ich mag lieber klassische Küche." : "Eher gehobene Küche." },
      q2: {
        text:
          q2Answer === "A"
            ? "Ich esse lieber Fleisch."
            : q2Answer === "B"
            ? "Ich esse lieber Fisch."
            : "Ich esse vegetarisch.",
      },
      q3: {
        text:
          q3Answer === "A"
            ? "Ich trinke lieber Rotwein, etwa 2 bis 3 Mal im Jahr."
            : q3Answer === "B"
            ? "Ich trinke lieber Weißwein, ungefähr 2 bis 3 Mal im Jahr."
            : "Ich trinke lieber Rosé, so 2 bis 3 Mal im Jahr.",
      },
      q4: { text: q4Answer === "A" ? "Ich bevorzuge leichte Weine." : "Ich bevorzuge schwere Weine." },
      nachname: { text: `${client.nachname}. ${spellOut(client.nachname)}.` },
      vorname: { text: `${client.vorname}. ${spellOut(client.vorname)}.` },
      closing: {
        text: "Vielen Dank auch Ihnen, auf Wiederhören!",
        endCall: true,
        outcome: `PLOTËSUAR – ${fullName}`,
      },
    },
    full_quick: {
      opening: { text: "Ja?" },
      q1: { text: q1Answer === "A" ? "Klassisch." : "Gehoben." },
      q2: { text: q2Answer === "A" ? "Fleisch." : q2Answer === "B" ? "Fisch." : "Vegetarisch." },
      q3: { text: q3Answer === "A" ? "Rotwein." : q3Answer === "B" ? "Weißwein." : "Rosé." },
      q4: { text: q4Answer === "A" ? "Leichte." : "Schwere." },
      nachname: { text: `${client.nachname}, ${spellOut(client.nachname)}.` },
      vorname: { text: `${client.vorname}, ${spellOut(client.vorname)}.` },
      closing: {
        text: "Gerne, tschüss!",
        endCall: true,
        outcome: `PLOTËSUAR – ${fullName}`,
      },
    },
  };

  return flows[client.persona] || flows.full_polite;
}

export const GREETING_LINE = "Hallo?";
