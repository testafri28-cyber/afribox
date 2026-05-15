"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type Hotspot = {
  eyebrow: string;
  title: string;
  body: string;
  scale: number;
  fx: number;
  fy: number;
};

const HOTSPOTS: Hotspot[] = [
  {
    eyebrow: "Afribox",
    title: "Le smart locker pour l'Afrique",
    body: "Une consigne automatique 24/7, conçue pour les villes africaines. Robuste, autonome, simple à utiliser.",
    scale: 1,
    fx: 0.5,
    fy: 0.5,
  },
  {
    eyebrow: "Étape 01 — Envoi",
    title: "Déposez votre colis en quelques secondes",
    body: "Scannez votre code, choisissez un casier libre, déposez. Le destinataire reçoit son code en temps réel.",
    scale: 2.6,
    fx: 0.22,
    fy: 0.35,
  },
  {
    eyebrow: "Étape 02 — Interface",
    title: "Un écran tactile clair et accessible",
    body: "Navigation guidée en français, anglais et langues locales. Aucune appli requise pour démarrer.",
    scale: 2.8,
    fx: 0.5,
    fy: 0.36,
  },
  {
    eyebrow: "Étape 03 — Paiement",
    title: "Mobile money, carte ou espèces",
    body: "Le terminal intégré accepte tous les moyens de paiement courants. Reçu imprimé sur place.",
    scale: 3.4,
    fx: 0.53,
    fy: 0.65,
  },
  {
    eyebrow: "Étape 04 — Retrait",
    title: "Récupérez 24/7 en toute autonomie",
    body: "Votre code unique ouvre uniquement votre casier. Pas de file, pas d'horaires, pas d'attente.",
    scale: 2.6,
    fx: 0.79,
    fy: 0.35,
  },
];

const N = HOTSPOTS.length;

export default function LockerScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const keyframes = HOTSPOTS.map((_, i) => i / (N - 1));
  const scale = useTransform(
    scrollYProgress,
    keyframes,
    HOTSPOTS.map((h) => h.scale),
  );
  const x = useTransform(
    scrollYProgress,
    keyframes,
    HOTSPOTS.map((h) => -(h.fx - 0.5) * h.scale * 100),
  );
  const y = useTransform(
    scrollYProgress,
    keyframes,
    HOTSPOTS.map((h) => -(h.fy - 0.5) * h.scale * 100),
  );

  const transform = useMotionTemplate`translate(${x}%, ${y}%) scale(${scale})`;

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${N * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <motion.div
          style={{ transform }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/locker.jpg"
            alt="Afribox smart locker"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/10" />

        <div className="pointer-events-none absolute inset-0">
          <div className="relative mx-auto h-full w-full max-w-7xl px-6 sm:px-10">
            {HOTSPOTS.map((h, i) => (
              <HotspotPanel
                key={i}
                index={i}
                progress={scrollYProgress}
                hotspot={h}
              />
            ))}
          </div>
        </div>

        <ProgressRail progress={scrollYProgress} />
        <ScrollHint progress={scrollYProgress} />
      </div>
    </section>
  );
}

function HotspotPanel({
  index,
  progress,
  hotspot,
}: {
  index: number;
  progress: MotionValue<number>;
  hotspot: Hotspot;
}) {
  const center = index / (N - 1);
  const span = 1 / (N - 1);
  const opacity = useTransform(
    progress,
    [
      center - span * 0.5,
      center - span * 0.2,
      center + span * 0.2,
      center + span * 0.5,
    ],
    [0, 1, 1, 0],
  );
  const ty = useTransform(
    progress,
    [center - span * 0.5, center, center + span * 0.5],
    [40, 0, -40],
  );

  return (
    <motion.div
      style={{ opacity, y: ty }}
      className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center pr-6 sm:max-w-lg"
    >
      <span className="mb-4 inline-block w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
        {hotspot.eyebrow}
      </span>
      <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
        {hotspot.title}
      </h2>
      <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">
        {hotspot.body}
      </p>
    </motion.div>
  );
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 sm:right-10">
      {HOTSPOTS.map((_, i) => (
        <Dot key={i} index={i} progress={progress} />
      ))}
    </div>
  );
}

function Dot({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const center = index / (N - 1);
  const span = 1 / (N - 1);
  const scale = useTransform(
    progress,
    [center - span * 0.5, center, center + span * 0.5],
    [1, 1.8, 1],
  );
  const opacity = useTransform(
    progress,
    [center - span * 0.5, center, center + span * 0.5],
    [0.35, 1, 0.35],
  );
  return (
    <motion.span
      style={{ scale, opacity }}
      className="block h-2 w-2 rounded-full bg-white"
    />
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.08], [1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/60"
    >
      Scroll
    </motion.div>
  );
}
