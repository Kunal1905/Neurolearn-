import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function ResultsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Assessment Results</h1>

      <Suspense fallback={<div className="p-8 text-center">Loading results preview…</div>}>
        <ResultsClient />
      </Suspense>
    </main>
  );
}
