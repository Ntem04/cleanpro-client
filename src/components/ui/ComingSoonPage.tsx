interface ComingSoonPageProps {
  title: string;
  description: string;
}

export default function ComingSoonPage({
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-6 py-16">
      <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#1d6f4c]">
        CleanPro
      </p>
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-slate-600">
        {description}
      </p>
    </section>
  );
}
