import { useParams } from "react-router-dom";
import { CampaignOverview } from "@/components/CampaignOverview";
import { PerformanceCharts } from "@/components/PerformanceCharts";
import { SqlPanel } from "@/components/SqlPanel";
import { CampaignActions } from "@/components/CampaignActions";

const campaignNames: Record<string, string> = {
  "win-back-churner": "Win Back Churner",
  "cbe": "CBE Campaign",
  "micro-cash": "Micro Cash",
  "app-download": "App Download",
  "airtime-bonus": "30% Airtime Bonus",
  "app-churner": "App Churner",
  "pin-reset": "PIN Reset",
  "case-in": "Case In",
  "app-upgrade": "App Upgrade",
  "airtime-advance": "Airtime Advance",
  "unutilized": "Unutilized Customers",
  "ussd-password": "USSD Password Push",
  "tomoca": "Tomoca Cashback",
  "fuel": "Fuel Cashback",
  "cashier": "Cashier Incentive",
  "eeu-water": "EEU & Water Cashback",
};

const CampaignDetail = () => {
  const { id } = useParams();
  const campaignName = campaignNames[id || ""] || "Campaign";

  return (
    <div className="space-y-6 p-6">
      <CampaignOverview name={campaignName} status="active" />
      
      <PerformanceCharts />
      
      <CampaignActions />
      
      <SqlPanel />
      
      <footer className="border-t pt-6 mt-6">
        <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex gap-6">
            <span>System Status: <span className="text-success">●</span> Operational</span>
            <span>Last Refresh: 2 minutes ago</span>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-foreground">Contact Support</button>
            <span>v2.4.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CampaignDetail;
