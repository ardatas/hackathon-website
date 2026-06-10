import type { Person, PersonContent } from "@/types/content";

export const peopleContent: PersonContent = {
  title: "Speakers & Judges",
  description: "here are our past speakers in our conference",
  fallback: "Speakers and judges announced soon.",
};

export const people: Person[] = [
  {
    id: "fabian-bodensteiner",
    name: "Fabian Bodensteiner",
    category: "Speaker",
    role: "Managing Director",
    company: "World",
    topic: "Prior event speaker",
    imageSrc: "/mock/speakers/fabian_bodensteiner.png",
    publicCleared: true,
  },
  {
    id: "jordi-baylina",
    name: "Jordi Baylina",
    category: "Speaker",
    role: "Developer",
    company: "Zisk",
    topic: "Prior event speaker",
    imageSrc: "/mock/speakers/jordi_baylina.png",
    publicCleared: true,
  },
  {
    id: "benedikt-buenz",
    name: "Benedikt Bünz",
    category: "Speaker",
    role: "Chief Scientist",
    company: "Espresso Systems",
    topic: "Prior event speaker",
    imageSrc: "/mock/speakers/benedikt_buenz.png",
    publicCleared: true,
  },
  {
    id: "kostas-chalkias",
    name: "Kostas Chalkias",
    category: "Speaker",
    role: "Chief Cryptographer & Co-Founder",
    company: "Sui / Mysten Labs",
    topic: "Cryptography, security, and scalable blockchain systems",
    imageSrc: "/mock/speakers/kostas_chalkias.png",
    publicCleared: true,
  },
];
