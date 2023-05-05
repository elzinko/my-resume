export default function Loading() {
  return (
    <>
      <div className="grid  h-screen grid-cols-1 place-items-center content-center gap-4">
        <span className="relative flex h-12 w-12">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-12 w-12 rounded-full bg-sky-500"></span>
        </span>
      </div>
    </>
  );
}
