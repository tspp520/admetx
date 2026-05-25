'use client';
export function SmilesTextarea({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="请输入 SMILES（最多 30 个，多个用换行分隔）"
      className="w-full h-48 border rounded-md px-3 py-2 text-sm font-mono
                 focus:outline-none focus:ring-2 focus:ring-teal-400"
    />
  );
}
