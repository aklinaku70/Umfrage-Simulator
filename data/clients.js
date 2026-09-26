// 15 klientë të simuluar (gjermanisht) për stërvitjen e telefonatave "cold call".
// "persona" përcakton se si sillet klienti gjatë bisedës (shiko lib/callLogic.js).
//
// persona:
//  - "refuse_immediate": e mbyll thirrjen menjëherë pas hyrjes, thotë të mos e thërrasin më
//  - "refuse_mid": përgjigjet 1-2 pyetjeve, pastaj nuk ka kohë/nuk është e interesuar
//  - "no_answer": nuk përgjigjet fare (del "zë i zënë" / nuk merr telefonin)
//  - "full_polite": përgjigjet gjithë anketës, e sjellshme
//  - "full_quick": përgjigjet gjithë anketës, por shkurt e nxituar

export const clients = [
  {
    id: 1,
    vorname: "Andreas",
    nachname: "Müller",
    telefon: "+49 151 2345 6781",
    adresse: "Hauptstraße 12, 80331 München",
    persona: "full_polite",
  },
  {
    id: 2,
    vorname: "Petra",
    nachname: "Schmidt",
    telefon: "+49 172 9876 5432",
    adresse: "Bahnhofstraße 45, 50667 Köln",
    persona: "refuse_immediate",
  },
  {
    id: 3,
    vorname: "Klaus",
    nachname: "Weber",
    telefon: "+49 160 1122 3344",
    adresse: "Kirchweg 3, 10115 Berlin",
    persona: "full_quick",
  },
  {
    id: 4,
    vorname: "Sabine",
    nachname: "Fischer",
    telefon: "+49 176 5566 7788",
    adresse: "Gartenstraße 21, 70173 Stuttgart",
    persona: "refuse_mid",
  },
  {
    id: 5,
    vorname: "Michael",
    nachname: "Wagner",
    telefon: "+49 152 3344 5566",
    adresse: "Lindenallee 8, 04109 Leipzig",
    persona: "no_answer",
  },
  {
    id: 6,
    vorname: "Claudia",
    nachname: "Becker",
    telefon: "+49 163 7788 9900",
    adresse: "Marktplatz 5, 60311 Frankfurt am Main",
    persona: "full_polite",
  },
  {
    id: 7,
    vorname: "Thomas",
    nachname: "Hoffmann",
    telefon: "+49 179 2233 4455",
    adresse: "Ringstraße 17, 90402 Nürnberg",
    persona: "refuse_immediate",
  },
  {
    id: 8,
    vorname: "Birgit",
    nachname: "Schäfer",
    telefon: "+49 157 6677 8899",
    adresse: "Dorfstraße 9, 28195 Bremen",
    persona: "full_polite",
  },
  {
    id: 9,
    vorname: "Stefan",
    nachname: "Koch",
    telefon: "+49 171 4455 6677",
    adresse: "Schulstraße 30, 30159 Hannover",
    persona: "full_quick",
  },
  {
    id: 10,
    vorname: "Martina",
    nachname: "Richter",
    telefon: "+49 175 8899 0011",
    adresse: "Bergweg 14, 01067 Dresden",
    persona: "refuse_mid",
  },
  {
    id: 11,
    vorname: "Jürgen",
    nachname: "Klein",
    telefon: "+49 162 1234 5670",
    adresse: "Amselweg 6, 40213 Düsseldorf",
    persona: "no_answer",
  },
  {
    id: 12,
    vorname: "Ingrid",
    nachname: "Wolf",
    telefon: "+49 178 9988 7766",
    adresse: "Rosenstraße 22, 68159 Mannheim",
    persona: "full_polite",
  },
  {
    id: 13,
    vorname: "Dieter",
    nachname: "Neumann",
    telefon: "+49 151 5544 3322",
    adresse: "Talstraße 11, 45127 Essen",
    persona: "refuse_immediate",
  },
  {
    id: 14,
    vorname: "Ursula",
    nachname: "Zimmermann",
    telefon: "+49 173 6655 4433",
    adresse: "Waldweg 4, 24103 Kiel",
    persona: "full_polite",
  },
  {
    id: 15,
    vorname: "Frank",
    nachname: "Braun",
    telefon: "+49 159 2211 0099",
    adresse: "Ahornstraße 19, 55116 Mainz",
    persona: "full_quick",
  },
];
