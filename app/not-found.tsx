import Link from 'next/link';

export const metadata = {
  title: '404',
};

export default function NotFound() {
  return (
    <div className="container mx-auto min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Page introuvable · Page not found</p>
      <p className="mt-6">
        <Link href="/fr" className="text-blue-600 underline">
          CV (FR)
        </Link>
        <span className="mx-2 text-gray-400">·</span>
        <Link href="/en" className="text-blue-600 underline">
          Resume (EN)
        </Link>
      </p>
    </div>
  );
}
