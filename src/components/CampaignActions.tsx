import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Play, Calendar, Download, Settings } from "lucide-react";
import { toast } from "sonner";

export function CampaignActions() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          <Button 
            className="gap-2" 
            onClick={() => toast.success("Campaign paused")}
          >
            <Pause className="h-4 w-4" />
            Pause Campaign
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Report
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Customer List
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Modify Parameters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
