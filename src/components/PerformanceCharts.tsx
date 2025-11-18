import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const dailyData = [
  { date: "Jan 1", activations: 400, redemptions: 240 },
  { date: "Jan 2", activations: 300, redemptions: 139 },
  { date: "Jan 3", activations: 500, redemptions: 380 },
  { date: "Jan 4", activations: 278, redemptions: 390 },
  { date: "Jan 5", activations: 189, redemptions: 480 },
  { date: "Jan 6", activations: 239, redemptions: 380 },
  { date: "Jan 7", activations: 349, redemptions: 430 },
];

const segmentData = [
  { name: "Active Users", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Churned", value: 30, color: "hsl(var(--chart-2))" },
  { name: "New Users", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Inactive", value: 10, color: "hsl(var(--chart-4))" },
];

export function PerformanceCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Daily Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))" 
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="activations" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Activations"
              />
              <Line 
                type="monotone" 
                dataKey="redemptions" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Redemptions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))" 
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
