import { FLAVOR_AXES } from "@/lib/scoring";
import { FlavorVector } from "@/types";

interface FlavorRadarChartProps {
  vector: FlavorVector;
  size?: number;
}

const AXIS_LABELS: Record<string, string> = {
  peat: "피트",
  sweet: "단맛",
  fruit: "과일",
  sherry: "셰리",
  vanilla: "바닐라",
  spice: "스파이스",
  body: "바디감",
};

const MAX_VALUE = 5;
const LEVELS = [1, 2, 3, 4, 5];

function pointAt(index: number, ratio: number, center: number, radius: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / FLAVOR_AXES.length;
  return {
    x: center + radius * ratio * Math.cos(angle),
    y: center + radius * ratio * Math.sin(angle),
  };
}

function polygonPoints(values: number[], center: number, radius: number) {
  return values
    .map((value, index) => {
      const { x, y } = pointAt(index, value / MAX_VALUE, center, radius);
      return `${x},${y}`;
    })
    .join(" ");
}

export default function FlavorRadarChart({ vector, size = 280 }: FlavorRadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 36;
  const values = FLAVOR_AXES.map((axis) => vector[axis]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs">
      {LEVELS.map((level) => (
        <polygon
          key={level}
          points={polygonPoints(
            FLAVOR_AXES.map(() => level),
            center,
            radius
          )}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}

      {FLAVOR_AXES.map((_, index) => {
        const { x, y } = pointAt(index, 1, center, radius);
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={polygonPoints(values, center, radius)}
        fill="rgba(245,158,11,0.25)"
        stroke="#F59E0B"
        strokeWidth={2}
      />

      {values.map((value, index) => {
        const { x, y } = pointAt(index, value / MAX_VALUE, center, radius);
        return <circle key={index} cx={x} cy={y} r={3} fill="#FBBF24" />;
      })}

      {FLAVOR_AXES.map((axis, index) => {
        const { x, y } = pointAt(index, 1.22, center, radius);
        return (
          <text
            key={axis}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-300 text-[10px] font-semibold"
          >
            {AXIS_LABELS[axis]}
          </text>
        );
      })}
    </svg>
  );
}
