# Chart Library Alternatives for Your Report

## 1. Chart.js + react-chartjs-2 (RECOMMENDED)

**Installation:**
```bash
npm install chart.js react-chartjs-2
```

**Usage Example:**
```tsx
"use client"
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function PerformanceChart({ theoryScore, practicalScore, attendance, printMode }) {
  const data = {
    labels: ['Theory', 'Practical', 'Attendance'],
    datasets: [{
      label: 'Scores',
      data: [theoryScore, practicalScore, attendance],
      backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'],
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: !printMode }
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  }

  return (
    <div style={{ height: printMode ? '150px' : '200px' }}>
      <Bar data={data} options={options} />
    </div>
  )
}
```

**Pros:**
- ✅ Very stable and reliable
- ✅ Excellent documentation
- ✅ Works perfectly with Next.js
- ✅ No SSR issues
- ✅ Great performance

**Cons:**
- ⚠️ Slightly larger bundle size
- ⚠️ Requires registering components

---

## 2. Victory Charts

**Installation:**
```bash
npm install victory
```

**Usage Example:**
```tsx
"use client"
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory'

export function PerformanceChart({ theoryScore, practicalScore, attendance, printMode }) {
  const data = [
    { x: 'Theory', y: theoryScore },
    { x: 'Practical', y: practicalScore },
    { x: 'Attendance', y: attendance }
  ]

  return (
    <div style={{ height: printMode ? '150px' : '200px' }}>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}
        height={printMode ? 150 : 200}
      >
        <VictoryAxis />
        <VictoryAxis dependentAxis domain={[0, 100]} />
        <VictoryBar
          data={data}
          style={{
            data: { fill: ({ datum }) => 
              datum.x === 'Theory' ? '#3b82f6' :
              datum.x === 'Practical' ? '#10b981' : '#8b5cf6'
            }
          }}
        />
      </VictoryChart>
    </div>
  )
}
```

**Pros:**
- ✅ Built specifically for React
- ✅ Beautiful animations
- ✅ Good TypeScript support
- ✅ Responsive by default

**Cons:**
- ⚠️ Larger bundle size
- ⚠️ Can be slower with many data points

---

## 3. Nivo (Beautiful & Modern)

**Installation:**
```bash
npm install @nivo/bar
```

**Usage Example:**
```tsx
"use client"
import { ResponsiveBar } from '@nivo/bar'

export function PerformanceChart({ theoryScore, practicalScore, attendance, printMode }) {
  const data = [
    { id: 'Theory', value: theoryScore },
    { id: 'Practical', value: practicalScore },
    { id: 'Attendance', value: attendance }
  ]

  return (
    <div style={{ height: printMode ? '150px' : '200px' }}>
      <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="id"
        margin={{ top: 10, right: 10, bottom: 50, left: 0 }}
        padding={0.3}
        colors={['#3b82f6', '#10b981', '#8b5cf6']}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        maxValue={100}
      />
    </div>
  )
}
```

**Pros:**
- ✅ Beautiful default styling
- ✅ Very customizable
- ✅ Responsive out of the box
- ✅ Great for dashboards

**Cons:**
- ⚠️ Each chart type is a separate package
- ⚠️ Can be overkill for simple charts

---

## 4. ApexCharts (Feature-Rich)

**Installation:**
```bash
npm install react-apexcharts apexcharts
```

**Usage Example:**
```tsx
"use client"
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export function PerformanceChart({ theoryScore, practicalScore, attendance, printMode }) {
  const options = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false } },
    dataLabels: { enabled: true },
    xaxis: { categories: ['Theory', 'Practical', 'Attendance'] },
    yaxis: { max: 100 },
    colors: ['#3b82f6', '#10b981', '#8b5cf6'],
  }

  const series = [{
    name: 'Scores',
    data: [theoryScore, practicalScore, attendance]
  }]

  return (
    <div style={{ height: printMode ? '150px' : '200px' }}>
      <Chart options={options} series={series} type="bar" height={printMode ? 150 : 200} />
    </div>
  )
}
```

**Pros:**
- ✅ Very feature-rich
- ✅ Great for dashboards
- ✅ Interactive tooltips
- ✅ Many chart types

**Cons:**
- ⚠️ Requires dynamic import (SSR issues)
- ⚠️ Larger bundle size

---

## Quick Comparison

| Library | Bundle Size | Ease of Use | Next.js Compatible | Best For |
|---------|------------|-------------|-------------------|----------|
| **Chart.js** | Medium | ⭐⭐⭐⭐⭐ | ✅ Perfect | General use |
| **Victory** | Large | ⭐⭐⭐⭐ | ✅ Good | React-focused apps |
| **Nivo** | Medium | ⭐⭐⭐⭐ | ✅ Perfect | Beautiful dashboards |
| **ApexCharts** | Large | ⭐⭐⭐ | ⚠️ Needs dynamic import | Feature-rich dashboards |
| **Recharts** | Small | ⭐⭐⭐⭐ | ⚠️ Can have issues | Current choice |

---

## My Recommendation

**Use Chart.js + react-chartjs-2** because:
1. Most stable and reliable
2. Works perfectly with Next.js (no SSR issues)
3. Great documentation and community support
4. Good performance
5. Easy to customize

Would you like me to implement Chart.js in your report component?

