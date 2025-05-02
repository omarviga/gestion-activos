import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface DataItem {
  name: string
  value: number
  color: string
}

interface EstadisticasChartProps {
  data: DataItem[]
}

export const EstadisticasChart = ({ data }: EstadisticasChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} unidades`, 'Cantidad']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
