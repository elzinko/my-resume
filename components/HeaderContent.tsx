'use client';

interface HeaderContentProps {
  name: string;
  role: string;
}

export default function HeaderContent({ name, role }: HeaderContentProps) {
  return (
    <div className="header-content flex justify-between pb-0 pt-2 print:py-4 max-md:pt-1 md:py-20">
      <div className="grid w-full justify-items-end">
        <h1 className="text-3xl font-extrabold leading-tight text-blue-600 print:text-3xl md:text-5xl md:leading-none lg:text-7xl">
          {name}
        </h1>
        <p className="mt-1 text-lg leading-snug text-teal-300 print:mt-1 print:text-lg print:text-teal-500 md:mt-5 md:text-3xl md:leading-normal">
          {role}
        </p>
      </div>
    </div>
  );
}
