'use client';

interface HeaderContentProps {
  name: string;
  role: string;
}

export default function HeaderContent({ name, role }: HeaderContentProps) {
  return (
    <div className="header-content flex justify-between pt-8 pb-0 md:py-20 print:py-4">
      <div className="grid justify-items-end">
        <h1 className="text-4xl font-extrabold text-blue-600 print:text-3xl md:text-5xl lg:text-7xl">
          {name}
        </h1>
        <p className="mt-2 text-2xl text-teal-300 print:mt-1 print:text-lg print:text-teal-500 md:mt-5 md:text-3xl">
          {role}
        </p>
      </div>
    </div>
  );
}
