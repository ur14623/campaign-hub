import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, MessageSquare, Coffee, Settings, ArrowRight, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Reward Campaigns",
      description: "Manage customer retention and engagement campaigns",
      icon: Trophy,
      campaigns: 8,
      path: "/campaign/win-back-churner",
      color: "text-success",
    },
    {
      title: "Info Campaigns",
      description: "Customer communication and education initiatives",
      icon: MessageSquare,
      campaigns: 4,
      path: "/campaign/app-upgrade",
      color: "text-info",
    },
    {
      title: "Merchant Campaigns",
      description: "Partnership and cashback programs",
      icon: Coffee,
      campaigns: 4,
      path: "/campaign/tomoca",
      color: "text-accent",
    },
    {
      title: "Administrative",
      description: "System configuration and user management",
      icon: Settings,
      campaigns: 4,
      path: "/admin/setup",
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">MPESA Campaign Manager</h1>
        <p className="text-lg text-muted-foreground">
          Monitor and optimize your customer engagement campaigns
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-success">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activations</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Reached</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-info">+12% conversion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <section.icon className={`h-8 w-8 ${section.color}`} />
                <span className="text-sm text-muted-foreground">{section.campaigns} campaigns</span>
              </div>
              <CardTitle className="text-xl">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate(section.path)}
                className="w-full gap-2"
                variant="outline"
              >
                View Campaigns
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
