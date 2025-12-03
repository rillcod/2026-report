"use client"

interface PerformanceChartProps {
  theoryScore: number
  practicalScore: number
  attendance: number
  type?: "bar" | "pie"
  className?: string
  printMode?: boolean
}

export function PerformanceChart({ 
  theoryScore, 
  practicalScore, 
  attendance, 
  className = "",
  printMode = false
}: PerformanceChartProps) {
  const maxValue = 100
  const chartHeight = printMode ? 170 : 220
  const chartWidth = "100%"
  
  // Normalize scores
  const tScore = Math.max(0, Math.min(100, theoryScore || 0))
  const pScore = Math.max(0, Math.min(100, practicalScore || 0))
  const aScore = Math.max(0, Math.min(100, attendance || 0))
  
  // Calculate overall score
  const overallScore = ((tScore + pScore + aScore) / 3).toFixed(1)

  return (
    <div className={`w-full ${className}`} style={{ height: chartHeight, position: 'relative' }}>
      <svg 
        width={chartWidth} 
        height={chartHeight}
        viewBox={`0 0 400 ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Overall Score - Far above the 100 label for clarity */}
        <text
          x="200"
          y="18"
          textAnchor="middle"
          fontSize={printMode ? "12" : "14"}
          fill="#374151"
          fontWeight="bold"
        >
          Overall ({overallScore}%)
        </text>
        {/* Background grid lines */}
        {[0, 25, 50, 75, 100].map((value) => (
          <line
            key={value}
            x1="40"
            y1={chartHeight - 20 - (value / 100) * (chartHeight - 60)}
            x2="380"
            y2={chartHeight - 20 - (value / 100) * (chartHeight - 60)}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}

        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((value) => (
          <text
            key={value}
            x="35"
            y={chartHeight - 20 - (value / 100) * (chartHeight - 60) + 4}
            textAnchor="end"
            fontSize={printMode ? "9" : "10"}
            fill="#64748b"
            fontWeight="500"
          >
            {value}
          </text>
        ))}

        {/* Bars */}
        {/* Theory Bar */}
        <g>
          <rect
            x="60"
            y={chartHeight - 20 - (tScore / 100) * (chartHeight - 60)}
            width="80"
            height={(tScore / 100) * (chartHeight - 60)}
            fill="#3b82f6"
            rx="4"
            ry="4"
          />
          <text
            x="100"
            y={chartHeight - 20 - (tScore / 100) * (chartHeight - 60) - 5}
            textAnchor="middle"
            fontSize={printMode ? "10" : "11"}
            fill="#1e40af"
            fontWeight="bold"
          >
            {tScore}%
          </text>
          <text
            x="100"
            y={chartHeight - 5}
            textAnchor="middle"
            fontSize={printMode ? "10" : "11"}
            fill="#64748b"
            fontWeight="bold"
          >
            Theory
          </text>
        </g>

        {/* Practical Bar */}
        <g>
          <rect
            x="160"
            y={chartHeight - 20 - (pScore / 100) * (chartHeight - 60)}
            width="80"
            height={(pScore / 100) * (chartHeight - 60)}
            fill="#10b981"
            rx="4"
            ry="4"
          />
          <text
            x="200"
            y={chartHeight - 20 - (pScore / 100) * (chartHeight - 60) - 5}
            textAnchor="middle"
            fontSize={printMode ? "10" : "11"}
            fill="#047857"
            fontWeight="bold"
          >
            {pScore}%
          </text>
          <text
            x="200"
            y={chartHeight - 5}
            textAnchor="middle"
            fontSize={printMode ? "10" : "11"}
            fill="#64748b"
            fontWeight="bold"
          >
            Practical
          </text>
        </g>

        {/* Attendance Bar */}
        <g>
          <rect
            x="260"
            y={chartHeight - 20 - (aScore / 100) * (chartHeight - 60)}
            width="80"
            height={(aScore / 100) * (chartHeight - 60)}
            fill="#8b5cf6"
            rx="4"
            ry="4"
          />
          <text
            x="300"
            y={chartHeight - 20 - (aScore / 100) * (chartHeight - 60) - 5}
            textAnchor="middle"
            fontSize={printMode ? "10" : "11"}
            fill="#6d28d9"
            fontWeight="bold"
          >
            {aScore}%
          </text>
          <text
            x="300"
            y={chartHeight - 5}
            textAnchor="middle"
            fontSize={printMode ? "10" : "11"}
            fill="#64748b"
            fontWeight="bold"
          >
            Attendance
          </text>
        </g>

        {/* X-axis line */}
        <line
          x1="40"
          y1={chartHeight - 20}
          x2="380"
          y2={chartHeight - 20}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}