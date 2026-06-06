import { Calculator } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-16">
      <section className="w-full max-w-2xl">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-stone-200 bg-white text-emerald-700 shadow-sm">
          <Calculator aria-hidden="true" size={24} strokeWidth={2} />
        </div>
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-emerald-700">
          Interior estimate tool
        </p>
        <h1 className="text-4xl font-semibold tracking-normal text-stone-950 sm:text-5xl">
          Residential Paint Calculator
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-stone-700">
          Estimate paint quantities, material cost, and labour for residential
          interior walls and ceilings.
        </p>
      </section>
    </main>
  );
}
