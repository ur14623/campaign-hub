import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, UserCog, Calendar } from "lucide-react";

const pageNames: Record<string, string> = {
  "setup": "Campaign Setup",
  "users": "User Management",
  "config": "System Configuration",
  "reports": "Report Scheduler",
};

const AdminPage = () => {
  const { page } = useParams();
  const pageName = pageNames[page || ""] || "Administration";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{pageName}</h1>
        <p className="text-muted-foreground">Administrative tools and configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {pageName}
          </CardTitle>
          <CardDescription>
            Configure and manage system settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Administrative interface - Coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
