/**
 * Pied de page du formulaire de paramètres avec note explicative
 */
export default function SettingsFooter() {
  return (
    <div className="pt-2">
      <p className="text-sm italic text-slate-400 max-w-xl">
        Les champs non documentés sont à compléter. Aucun réglage actif n'est
        présumé.
      </p>
    </div>
  );
}

