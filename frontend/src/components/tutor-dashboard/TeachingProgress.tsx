
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartDataItem {
  label: string;
  hours: number;
  students: number;
}

interface TeachingProgressProps {
  chartData: ChartDataItem[];
}

const TeachingProgress = ({ chartData }: TeachingProgressProps) => {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-2 px-6 pt-6">
        <CardTitle className="text-lg font-semibold text-gray-800">Teaching Progress</CardTitle>
        <CardDescription>Monthly statistics</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#8B5CF6" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#D6BCFA" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderColor: '#e5e7eb', 
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }} 
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
            <Bar 
              yAxisId="left" 
              dataKey="hours" 
              name="Teaching Hours" 
              fill="#8B5CF6" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
            <Bar 
              yAxisId="right" 
              dataKey="students" 
              name="Students" 
              fill="#D6BCFA" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TeachingProgress;
