import { CalculatorWorkspace } from "@/components/calculator-workspace";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-stone-50/50 px-4 py-8 sm:px-6 sm:py-12">
      <CalculatorWorkspace />
    </main>
  );
}
