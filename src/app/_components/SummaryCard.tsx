"use client";

export default function SummaryCard({
  text,
  number,
}: {
  text: string;
  number: number;
}): JSX.Element {
  return (
    <div className="flex w-[200px] flex-col items-center justify-center gap-6 rounded-md border-4 border-slate-500 py-12 text-center">
      <div>👭</div>
      <div>
        <h2 className="text-3xl">{number}</h2>
        <h3>{text}</h3>
      </div>
    </div>
  );
}
