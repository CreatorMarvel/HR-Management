import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2>Not Found</h2>
      <p className="mb-2">Could not find requested resource</p>
      <Link href="/">
        <span className="rounded-full border-2 border-slate-700 px-4 py-2 font-bold text-slate-700">
          Return Home
        </span>
      </Link>
    </div>
  );
}
