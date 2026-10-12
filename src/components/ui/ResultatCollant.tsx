import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Bloc du résultat principal d'un calculateur (RECETTE §5, règle du 2026-10-11).
 * Marqué `data-resultat` ; sur téléphone, tant que le bloc est sous l'écran, une barre collée
 * en bas montre le chiffre clé. La barre n'existe que côté client : rien n'est dupliqué dans le HTML.
 */
export default function ResultatCollant({ label, value, className, children }: { label: string; value: string; className?: string; children: ReactNode }) {
  const bloc = useRef<HTMLDivElement>(null);
  const [dessous, setDessous] = useState(false);
  useEffect(() => {
    const el = bloc.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setDessous(!e.isIntersecting && e.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={bloc} data-resultat aria-live="polite" className={className}>
      {children}
      {dessous && (
        <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => bloc.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="fixed inset-x-0 bottom-0 z-40 flex items-baseline justify-between gap-3 border-t border-brand-200 bg-brand-500 px-4 py-3 text-left text-white shadow-lg lg:hidden">
          <span className="text-sm font-medium text-white/90">{label}</span>
          <span className="tabular-nums text-xl font-bold">{value}</span>
        </button>
      )}
    </div>
  );
}
