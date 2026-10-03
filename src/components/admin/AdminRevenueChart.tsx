import React, { useState } from 'react';

interface RevenueDataPoint {
  day: string;
  revenue: number;
  orders: number;
}

interface AdminRevenueChartProps {
  data: RevenueDataPoint[];
}

export const AdminRevenueChart: React.FC<AdminRevenueChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxRevenue = 120000;
  const chartHeight = 200;
  const chartWidth = 700;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 35;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - (d.revenue / maxRevenue) * innerHeight;
    return { x, y, ...d };
  });

  // Generate SVG path commands for smooth curve
  const pathData = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  // Area path closing down to the bottom
  const areaData = `${pathData} L ${points[points.length - 1].x},${paddingTop + innerHeight} L ${points[0].x},${paddingTop + innerHeight} Z`;

  const yTicks = [120000, 90000, 60000, 30000, 0];

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-56 sm:h-64"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#10b981" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines & Y labels */}
        {yTicks.map((val) => {
          const y = paddingTop + innerHeight - (val / maxRevenue) * innerHeight;
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="end"
                fontWeight="500"
              >
                Rs.{val === 0 ? '0' : `${val / 1000}k`}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaData} fill="url(#adminRevenueGrad)" />

        {/* Curve stroke */}
        <path
          d={pathData}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Points & X-axis labels */}
        {points.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g
              key={p.day}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Invisible wide hover column */}
              <rect
                x={p.x - innerWidth / (data.length * 2)}
                y={paddingTop}
                width={innerWidth / data.length}
                height={innerHeight}
                fill="transparent"
              />

              {/* Day label on X axis */}
              <text
                x={p.x}
                y={chartHeight - 10}
                fill={isHovered ? '#34d399' : '#94a3b8'}
                fontSize="12"
                fontWeight={isHovered ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {p.day}
              </text>

              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={p.x}
                  y1={paddingTop}
                  x2={p.x}
                  y2={paddingTop + innerHeight}
                  stroke="#10b981"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
              )}

              {/* Dot on curve */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4}
                fill="#10b981"
                stroke="#0f172a"
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Interactive Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute pointer-events-none bg-slate-950/95 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs shadow-xl backdrop-blur-xs transition-all duration-150 z-20"
          style={{
            left: `${((points[hoveredIndex].x - paddingLeft) / innerWidth) * 80 + 10}%`,
            top: '8px',
          }}
        >
          <div className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{data[hoveredIndex].day} Sales Dispatch</span>
          </div>
          <div className="text-emerald-400 font-extrabold text-sm mt-0.5">
            Rs. {data[hoveredIndex].revenue.toLocaleString()}
          </div>
          <div className="text-slate-400 text-xs mt-0.5">
            {data[hoveredIndex].orders} fulfilled orders
          </div>
        </div>
      )}
    </div>
  );
};
