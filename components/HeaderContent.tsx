'use client';

interface HeaderContentProps {
  name: string;
  role: string;
}

export default function HeaderContent({ name, role }: HeaderContentProps) {
  return (
    <div className="header-content flex justify-between py-14 md:py-20 print:py-4">
      <div className="grid justify-items-end">
        <h1 className="text-4xl font-extrabold text-blue-600 md:text-5xl lg:text-7xl print:text-3xl">
          {name}
        </h1>
        <p className="mt-5 text-2xl text-teal-300 md:text-3xl print:mt-1 print:text-lg print:text-teal-500">
          {role}
        </p>
      </div>
    </div>
  );
}
