import TaxCalculator from '@/components/TaxCalculator';

export const metadata = {
  title: 'Malaysia Tax Calculator 2025 | Estimate Your Income Tax',
  description: 'Calculate your Malaysia Personal Income Tax for Assessment Year 2025 with our easy-to-use calculator. Includes latest reliefs and rebates.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <TaxCalculator />

      <footer className="max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
        <p>
          Disclaimer: This calculator is for estimation purposes only and based on the tax rates for Assessment Year 2025.
          Please refer to the official LHDN website or consult a tax professional for accurate filing.
        </p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} Malaysia Tax Calculator
        </p>
      </footer>
    </main>
  );
}
