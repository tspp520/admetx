export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-full bg-teal-500 text-white font-bold flex items-center justify-center"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        a
      </div>
      <span className="text-base font-semibold text-slate-800">睿智医药 AdmetX 成药性预测平台</span>
    </div>
  );
}
