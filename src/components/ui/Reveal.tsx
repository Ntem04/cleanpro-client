import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  // Délai optionnel pour faire des effets de cascade (ex: 100ms, 200ms)
  delay?: number;
  // Direction de l'animation d'entrée
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  // Déclenche l'animation une seule fois (true) ou à chaque scroll (false)
  once?: boolean;
  // Déclenche l'animation au chargement dès le montage sans exiger de scroll manuel
  immediate?: boolean;
}

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  once = true,
  immediate = false,
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (immediate) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [immediate]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1, // Déclenche quand 10% du composant est visible
        rootMargin: "50px",
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [once]);

  // Configurations des directions de départ avec Tailwind (décalages subtils anti-CLS)
  const baseDirection = {
    up: "translate-y-3",
    down: "-translate-y-3",
    left: "-translate-x-3",
    right: "translate-x-3",
    none: "",
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transition-all duration-800 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0 will-change-auto"
          : `opacity-0 ${baseDirection[direction]} will-change-transform`
      }`}
    >
      {children}
    </div>
  );
}
