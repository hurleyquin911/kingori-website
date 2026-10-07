/* eslint-disable @next/next/no-img-element */
import { qris } from "@/lib/store-config";

const SIZE = 29;

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
}

function inFinder(x: number, y: number) {
  const zones = [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ];
  return zones.some(([zx, zy]) => x >= zx - 1 && x <= zx + 7 && y >= zy - 1 && y <= zy + 7);
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="7" height="7" fill="#0b0c0f" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#0b0c0f" />
    </g>
  );
}

function PlaceholderQr({ seed }: { seed: string }) {
  const rand = hash(seed);
  const cells: React.ReactNode[] = [];
  const mid = Math.floor(SIZE / 2);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (inFinder(x, y)) continue;
      if (Math.abs(x - mid) <= 3 && Math.abs(y - mid) <= 2) continue;
      if (rand() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill="#0b0c0f" />);
    }
  }
  return (
    <svg viewBox={`-2 -2 ${SIZE + 4} ${SIZE + 4}`} className="size-full" shapeRendering="crispEdges" role="img" aria-label="Kode QRIS">
      <rect x="-2" y="-2" width={SIZE + 4} height={SIZE + 4} fill="#fff" />
      {cells}
      <Finder x={0} y={0} />
      <Finder x={SIZE - 7} y={0} />
      <Finder x={0} y={SIZE - 7} />
      <rect x={mid - 3.5} y={mid - 2.5} width="7" height="5" rx="0.8" fill="#e11d48" />
      <text x={mid} y={mid + 1.1} textAnchor="middle" fontSize="2.6" fontWeight="900" fill="#fff" fontFamily="sans-serif">
        QRIS
      </text>
    </svg>
  );
}

export function QrisCode({ seed, className = "" }: { seed: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white ${className}`}>
      <div className="flex items-center justify-between bg-[#e11d48] px-4 py-2 text-white">
        <span className="text-sm font-black tracking-wider">QRIS</span>
        <span className="text-[10px] font-semibold opacity-90">QR Code Standar Pembayaran Nasional</span>
      </div>
      <div className="px-5 pt-3 text-center text-asphalt">
        <p className="text-sm font-extrabold">{qris.merchantName}</p>
        <p className="text-[10px] text-zinc-500">NMID: {qris.nmid}</p>
      </div>
      <div className="aspect-square p-4">
        {qris.image ? (
          <img src={qris.image} alt={`QRIS ${qris.merchantName}`} className="size-full object-contain" />
        ) : (
          <PlaceholderQr seed={seed} />
        )}
      </div>
      <p className="px-4 pb-3 text-center text-[10px] font-semibold text-zinc-500">
        Satu QRIS untuk semua aplikasi pembayaran
      </p>
    </div>
  );
}
