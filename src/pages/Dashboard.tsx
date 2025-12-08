import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const metrics = [
  { title: "Active Total", slug: "active-total" },
  { title: "Active New", slug: "active-new" },
  { title: "Active Existing", slug: "active-existing" },
  { title: "Active Existing Transacting", slug: "active-existing-transacting" },
  { title: "Active New Transacting", slug: "active-new-transacting" },
  { title: "Active Micro Merchants", slug: "active-micro-merchants" },
  { title: "Active Unified Merchants", slug: "active-unified-merchants" },
  { title: "Active App Users", slug: "active-app-users" },
  { title: "App Downloads", slug: "app-downloads" },
  { title: "Non-Gross Adds", slug: "non-gross-adds" },
  { title: "Gross Adds", slug: "gross-adds" },
  { title: "Top Up", slug: "top-up" },
];

const generateMockData = (period: string) => {
  if (period === "daily") {
    return Array.from({ length: 7 }, (_, i) => ({
      date: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), "MMM dd"),
      value: Math.floor(Math.random() * 5000) + 10000,
    }));
  } else if (period === "30-day") {
    return Array.from({ length: 30 }, (_, i) => ({
      date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), "MMM dd"),
      value: Math.floor(Math.random() * 5000) + 10000,
    }));
  } else {
    return Array.from({ length: 3 }, (_, i) => ({
      date: `Month ${i + 1}`,
      value: Math.floor(Math.random() * 150000) + 300000,
    }));
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [viewTab, setViewTab] = useState<"chart" | "card">("card");
  const [period, setPeriod] = useState<"daily" | "30-day" | "90-day">("daily");

  const data = generateMockData(period);
  const meanValue = period === "30-day" ? data.reduce((acc, d) => acc + d.value, 0) / data.length : null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 blur-3xl -z-10" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">MPESA CVM Dashboard</h2>
        <p className="text-muted-foreground mt-1 text-sm">Real-time overview of all key metrics</p>
      </div>

      <Tabs value={viewTab} onValueChange={(v) => setViewTab(v as any)} className="w-full">
        <div className="flex items-center justify-between mb-4 gap-4">
          <TabsList className="grid w-full grid-cols-2 bg-card shadow-card border border-border/50 p-1.5">
            <TabsTrigger value="card" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-elegant">Cards View</TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-elegant">Chart View</TabsTrigger>
          </TabsList>
          
          <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
            <SelectTrigger className="w-44 bg-card shadow-card border-border/50 hover:border-primary/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="30-day">30-Day</SelectItem>
              <SelectItem value="90-day">90-Day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="chart" className="space-y-3 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, idx) => (
              <div key={metric.slug} className="group relative bg-gradient-card border border-border/50 rounded-xl p-3 space-y-3 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                <div className="flex items-center justify-between relative z-10">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{metric.title}</h3>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-card)'
                      }}
                    />
                    <Bar dataKey="value" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} />
                    {meanValue && <ReferenceLine y={meanValue} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" label={{ value: "Mean", fill: 'hsl(var(--chart-2))' }} />}
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="card" className="space-y-3 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, idx) => (
              <div key={metric.slug} className="animate-scale-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <MetricCard
                  title={metric.title}
                  period={period}
                  onNavigate={() => navigate(`/metric/${metric.slug}`)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
