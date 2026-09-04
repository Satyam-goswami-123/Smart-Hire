import React from 'react'
import './SkillGapChart.css'

// Radar chart — hexagonal shape with 6 axes matching reference
const SKILLS = [
  { label: 'Python',        angle: -90,  value: 0.78 },
  { label: 'Data Analysis', angle: -30,  value: 0.65 },
  { label: 'Machine Learning', angle: 30, value: 0.55 },
  { label: 'Leadership',    angle: 90,   value: 0.60 },
  { label: 'Communication', angle: 150,  value: 0.70 },
  { label: 'Python',        angle: 210,  value: 0.75 },
]

const CX = 90
const CY = 90
const R  = 58

function polarToXY(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function buildPolygon(values, maxR) {
  return values
    .map((v, i) => {
      const { x, y } = polarToXY(SKILLS[i].angle, v * maxR)
      return `${x},${y}`
    })
    .join(' ')
}

const rings = [0.25, 0.5, 0.75, 1]

export default function SkillGapChart() {
  const dataPolygon = buildPolygon(SKILLS.map((s) => s.value), R)

  return (
    <div className="sgc">
      <h3 className="sgc__title">Skill Gap Analysis</h3>
      <div className="sgc__chart-wrap">
        <svg
          className="sgc__svg"
          viewBox="0 0 180 180"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid rings */}
          {rings.map((r) => {
            const pts = SKILLS.map((s) => {
              const { x, y } = polarToXY(s.angle, r * R)
              return `${x},${y}`
            }).join(' ')
            return (
              <polygon
                key={r}
                points={pts}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="0.8"
              />
            )
          })}

          {/* Axis lines */}
          {SKILLS.map((s, i) => {
            const end = polarToXY(s.angle, R)
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={end.x}
                y2={end.y}
                stroke="#E5E7EB"
                strokeWidth="0.8"
              />
            )
          })}

          {/* Data polygon */}
          <polygon
            points={dataPolygon}
            fill="rgba(99,102,241,0.18)"
            stroke="#6366F1"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Data dots */}
          {SKILLS.map((s, i) => {
            const { x, y } = polarToXY(s.angle, s.value * R)
            return <circle key={i} cx={x} cy={y} r={2.5} fill="#6366F1" />
          })}

          {/* Labels */}
          {SKILLS.map((s, i) => {
            const { x, y } = polarToXY(s.angle, R + 14)
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7.5"
                fill="#6B7280"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {s.label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
