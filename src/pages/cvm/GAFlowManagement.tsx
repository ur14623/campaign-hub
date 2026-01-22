import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, RefreshCw, Download, Search, Clock, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DailyTask {
  id: string;
  date: string;
  gsmGa: { table: string; count: number };
  notRegistered: { table: string; count: number };
  registered: { table: string; count: number };
  received3Birr: { table: string; count: number };
  notReceived3Birr: { table: string; count: number };
  utilized3Birr: { table: string; count: number };
  notUtilized: { table: string; count: number };
}

interface WeeklySummary {
  date: string;
  gsmGa: number;
  notReg: number;
  mpesaGa: number;
  rewarded3B: number;
  notRewarded3B: number;
  buyBundle: number;
  notBuyBundle: number;
}

interface ActionPlan {
  id: string;
  date: string;
  category: string;
  tableName: string;
  count: number;
  campaign: string;
  contactPerson: string;
  status: string;
}

interface AnalysisResult {
  table: string;
  count: number;
  status: string;
  saved?: boolean;
}

interface AnalysisResponse {
  status: string;
  date_info: string;
  results: AnalysisResult[];
}

const initialDailyTasks: DailyTask[] = [
  {
    id: "1",
    date: "17-Jan",
    gsmGa: { table: "GSM_GA_1_17", count: 455648 },
    notRegistered: { table: "NOT_REG_JAN_1_17", count: 15278 },
    registered: { table: "REG_JAN_1_17", count: 451582 },
    received3Birr: { table: "REC_3B_JAN_1_17", count: 450725 },
    notReceived3Birr: { table: "NOT_REC_3B_JAN_1_17", count: 857 },
    utilized3Birr: { table: "USED_3B_JAN_1_17", count: 430504 },
    notUtilized: { table: "NOT_USED_3B_JAN_1_17", count: 20221 },
  },
  {
    id: "2",
    date: "18-Jan",
    gsmGa: { table: "GSM_GA_1_18", count: 462150 },
    notRegistered: { table: "NOT_REG_JAN_1_18", count: 14520 },
    registered: { table: "REG_JAN_1_18", count: 458230 },
    received3Birr: { table: "REC_3B_JAN_1_18", count: 457100 },
    notReceived3Birr: { table: "NOT_REC_3B_JAN_1_18", count: 1130 },
    utilized3Birr: { table: "USED_3B_JAN_1_18", count: 438920 },
    notUtilized: { table: "NOT_USED_3B_JAN_1_18", count: 18180 },
  },
  {
    id: "3",
    date: "19-Jan",
    gsmGa: { table: "GSM_GA_1_19", count: 470320 },
    notRegistered: { table: "NOT_REG_JAN_1_19", count: 13890 },
    registered: { table: "REG_JAN_1_19", count: 465430 },
    received3Birr: { table: "REC_3B_JAN_1_19", count: 464200 },
    notReceived3Birr: { table: "NOT_REC_3B_JAN_1_19", count: 1230 },
    utilized3Birr: { table: "USED_3B_JAN_1_19", count: 445100 },
    notUtilized: { table: "NOT_USED_3B_JAN_1_19", count: 19100 },
  },
];

const initialActionPlans: ActionPlan[] = [
  { id: "1", date: "17-Jan", category: "NOT REGIS", tableName: "NOT_REG_JAN_1_17", count: 15278, campaign: "Welcome Campaign", contactPerson: "", status: "PLANNED" },
  { id: "2", date: "17-Jan", category: "NOT RECEIVED", tableName: "NOT_REC_3B_JAN_1_17", count: 857, campaign: "Reward", contactPerson: "", status: "PLANNED" },
  { id: "3", date: "17-Jan", category: "NOT BUY BUNDLE", tableName: "NOT_USED_3B_JAN_1_17", count: 20221, campaign: "PIN Reset", contactPerson: "", status: "PLANNED" },
  { id: "4", date: "18-Jan", category: "NOT REGIS", tableName: "NOT_REG_JAN_1_18", count: 14520, campaign: "Welcome Campaign", contactPerson: "", status: "IN PROGRESS" },
  { id: "5", date: "18-Jan", category: "NOT RECEIVED", tableName: "NOT_REC_3B_JAN_1_18", count: 1130, campaign: "Reward", contactPerson: "", status: "COMPLETED" },
];

const categories = ["NOT REGIS", "NOT RECEIVED", "NOT BUY BUNDLE", "UTILIZED", "OTHER"];
const statuses = ["PLANNED", "IN PROGRESS", "COMPLETED", "CANCELLED"];

export default function GAFlowManagement() {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(initialDailyTasks);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(initialActionPlans);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Create Flow Dialog State
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [postFix, setPostFix] = useState("");
  const [dateType, setDateType] = useState<"fixed" | "range">("fixed");
  const [dateVal1, setDateVal1] = useState("");
  const [dateVal2, setDateVal2] = useState("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const [savingTable, setSavingTable] = useState<string | null>(null);
  
  // Search states for each table
  const [dailyTaskSearch, setDailyTaskSearch] = useState("");
  const [summarySearch, setSummarySearch] = useState("");
  const [actionPlanSearch, setActionPlanSearch] = useState("");

  // Calculate weekly summary from daily tasks (auto-updates when dailyTasks changes)
  const weeklySummary: WeeklySummary[] = useMemo(() => {
    return dailyTasks.map(task => ({
      date: task.date,
      gsmGa: task.gsmGa.count,
      notReg: task.notRegistered.count,
      mpesaGa: task.registered.count,
      rewarded3B: task.received3Birr.count,
      notRewarded3B: task.notReceived3Birr.count,
      buyBundle: task.utilized3Birr.count,
      notBuyBundle: task.notUtilized.count,
    }));
  }, [dailyTasks]);

  // Filtered data based on search
  const filteredDailyTasks = useMemo(() => {
    if (!dailyTaskSearch) return dailyTasks;
    const search = dailyTaskSearch.toLowerCase();
    return dailyTasks.filter(task =>
      task.date.toLowerCase().includes(search) ||
      task.gsmGa.table.toLowerCase().includes(search) ||
      task.notRegistered.table.toLowerCase().includes(search) ||
      task.registered.table.toLowerCase().includes(search) ||
      task.received3Birr.table.toLowerCase().includes(search) ||
      task.notReceived3Birr.table.toLowerCase().includes(search) ||
      task.utilized3Birr.table.toLowerCase().includes(search) ||
      task.notUtilized.table.toLowerCase().includes(search) ||
      String(task.gsmGa.count).includes(search) ||
      String(task.notRegistered.count).includes(search)
    );
  }, [dailyTasks, dailyTaskSearch]);

  const filteredSummary = useMemo(() => {
    if (!summarySearch) return weeklySummary;
    const search = summarySearch.toLowerCase();
    return weeklySummary.filter(s =>
      s.date.toLowerCase().includes(search) ||
      String(s.gsmGa).includes(search) ||
      String(s.notReg).includes(search) ||
      String(s.mpesaGa).includes(search) ||
      String(s.rewarded3B).includes(search) ||
      String(s.notRewarded3B).includes(search) ||
      String(s.buyBundle).includes(search) ||
      String(s.notBuyBundle).includes(search)
    );
  }, [weeklySummary, summarySearch]);

  const filteredActionPlans = useMemo(() => {
    if (!actionPlanSearch) return actionPlans;
    const search = actionPlanSearch.toLowerCase();
    return actionPlans.filter(plan =>
      plan.date.toLowerCase().includes(search) ||
      plan.category.toLowerCase().includes(search) ||
      plan.tableName.toLowerCase().includes(search) ||
      plan.campaign.toLowerCase().includes(search) ||
      plan.contactPerson.toLowerCase().includes(search) ||
      plan.status.toLowerCase().includes(search) ||
      String(plan.count).includes(search)
    );
  }, [actionPlans, actionPlanSearch]);

  // Refresh handlers
  const handleRefreshClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRefresh = async () => {
    setShowConfirmDialog(false);
    setIsRefreshing(true);

    try {
      // Simulate API call to reload data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate refreshed data (in real app, fetch from API)
      const refreshedTasks = initialDailyTasks.map(task => ({
        ...task,
        gsmGa: { ...task.gsmGa, count: task.gsmGa.count + Math.floor(Math.random() * 1000) },
        notRegistered: { ...task.notRegistered, count: task.notRegistered.count + Math.floor(Math.random() * 100) },
        registered: { ...task.registered, count: task.registered.count + Math.floor(Math.random() * 500) },
        received3Birr: { ...task.received3Birr, count: task.received3Birr.count + Math.floor(Math.random() * 500) },
        notReceived3Birr: { ...task.notReceived3Birr, count: task.notReceived3Birr.count + Math.floor(Math.random() * 50) },
        utilized3Birr: { ...task.utilized3Birr, count: task.utilized3Birr.count + Math.floor(Math.random() * 400) },
        notUtilized: { ...task.notUtilized, count: task.notUtilized.count + Math.floor(Math.random() * 200) },
      }));

      setDailyTasks(refreshedTasks);
      setLastRefresh(new Date());
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancelRefresh = () => {
    setShowConfirmDialog(false);
  };

  // Export functions
  const exportToExcel = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(h => {
        const key = h.toLowerCase().replace(/\s+/g, '');
        return row[key] ?? row[h] ?? '';
      }).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} exported successfully`);
  };

  const exportDailyTasks = () => {
    const data = filteredDailyTasks.map(task => ({
      Date: task.date,
      "GSM_GA Table": task.gsmGa.table,
      "GSM_GA Count": task.gsmGa.count,
      "Not Registered Table": task.notRegistered.table,
      "Not Registered Count": task.notRegistered.count,
      "Registered Table": task.registered.table,
      "Registered Count": task.registered.count,
      "Received 3B Table": task.received3Birr.table,
      "Received 3B Count": task.received3Birr.count,
      "Not Received 3B Table": task.notReceived3Birr.table,
      "Not Received 3B Count": task.notReceived3Birr.count,
      "Utilized 3B Table": task.utilized3Birr.table,
      "Utilized 3B Count": task.utilized3Birr.count,
      "Not Utilized Table": task.notUtilized.table,
      "Not Utilized Count": task.notUtilized.count,
    }));
    
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `daily_ga_flow_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("Daily Task data exported");
  };

  const exportSummary = () => {
    const data = filteredSummary.map(s => ({
      Date: s.date,
      "GSM GA": s.gsmGa,
      "NOT REG": s.notReg,
      "MPESA GA": s.mpesaGa,
      "REWARDED 3B": s.rewarded3B,
      "NOT REWARDED 3B": s.notRewarded3B,
      "BUY BUNDLE": s.buyBundle,
      "NOT BUY BUNDLE": s.notBuyBundle,
    }));
    
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ga_flow_summary_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("Summary data exported");
  };

  const exportActionPlans = () => {
    const data = filteredActionPlans.map(p => ({
      Date: p.date,
      Category: p.category,
      "Table Name": p.tableName,
      Count: p.count,
      Campaign: p.campaign,
      "Contact Person": p.contactPerson,
      Status: p.status,
    }));
    
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `action_plans_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("Action Plans exported");
  };

  // Action Plan CRUD
  const handleActionPlanChange = (id: string, field: keyof ActionPlan, value: string | number) => {
    setActionPlans(prev => prev.map(plan =>
      plan.id === id ? { ...plan, [field]: value } : plan
    ));
  };

  const addActionPlan = () => {
    const newId = String(Date.now());
    const newPlan: ActionPlan = {
      id: newId,
      date: "",
      category: "NOT REGIS",
      tableName: "",
      count: 0,
      campaign: "",
      contactPerson: "",
      status: "PLANNED",
    };
    setActionPlans([...actionPlans, newPlan]);
    toast.success("New action plan row added");
  };

  const deleteActionPlan = (id: string) => {
    setActionPlans(prev => prev.filter(plan => plan.id !== id));
    toast.success("Action plan deleted");
  };

  // Create Flow Analysis handlers
  const handleCreateFlow = () => {
    setShowCreateDialog(true);
    setPostFix("");
    setDateType("fixed");
    setDateVal1("");
    setDateVal2("");
    setAnalysisResults(null);
  };

  const handleRunAnalysis = async () => {
    if (!postFix.trim()) {
      toast.error("Please enter a post fix value");
      return;
    }
    if (!dateVal1) {
      toast.error("Please select a start date");
      return;
    }
    if (dateType === "range" && !dateVal2) {
      toast.error("Please select an end date for range");
      return;
    }

    setIsAnalyzing(true);

    try {
      const requestBody: {
        post_fix: string;
        date_type: "fixed" | "range";
        date_val_1: string;
        date_val_2?: string;
      } = {
        post_fix: postFix,
        date_type: dateType,
        date_val_1: dateVal1,
      };

      if (dateType === "range") {
        requestBody.date_val_2 = dateVal2;
      }

      const response = await fetch("http://127.0.0.1:5000/trigger_ga_funnel_analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: AnalysisResponse = await response.json();

      setAnalysisResults(data);
      toast.success("Analysis completed successfully");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to run analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveResult = async (tableName: string, count: number) => {
    setSavingTable(tableName);
    
    try {
      const response = await fetch("http://127.0.0.1:5000/save_single_funnel_result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableName, count }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setAnalysisResults(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          results: prev.results.map(r =>
            r.table === tableName ? { ...r, saved: true } : r
          ),
        };
      });
      
      toast.success(data.message || `${tableName} saved successfully`);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : `Failed to save ${tableName}`);
    } finally {
      setSavingTable(null);
    }
  };

  const handleSaveAll = async () => {
    if (!analysisResults?.results) return;
    
    setSavingTable("all");
    
    try {
      const resultsToSave = analysisResults.results
        .filter(r => !r.saved)
        .map(r => ({ table: r.table, count: r.count }));

      if (resultsToSave.length === 0) {
        toast.info("All results are already saved");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/save_ga_funnel_results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: resultsToSave }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setAnalysisResults(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          results: prev.results.map(r => ({ ...r, saved: true })),
        };
      });
      
      toast.success(data.message || "All results saved successfully");
    } catch (error) {
      console.error("Save all error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save all results");
    } finally {
      setSavingTable(null);
    }
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">GA Flow Management</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last Refresh: {format(lastRefresh, "MMM dd, yyyy HH:mm:ss")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateFlow}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Flow
          </Button>
          <Button
            variant="outline"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* BLOCK 1: Daily Task for GA Flow (Read-Only) */}
      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">1️⃣ DAILY TASK FOR GA FLOW</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={dailyTaskSearch}
                  onChange={(e) => setDailyTaskSearch(e.target.value)}
                  className="pl-8 h-9 w-48"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportDailyTasks} className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-muted/50">
                <th rowSpan={2} className="border border-border px-3 py-2 text-left font-semibold w-20">Date</th>
                <th colSpan={2} className="border border-border px-3 py-2 text-center font-semibold bg-blue-100 dark:bg-blue-900/30">GSM_GA</th>
                <th colSpan={2} className="border border-border px-3 py-2 text-center font-semibold bg-red-100 dark:bg-red-900/30">NOT Registered</th>
                <th colSpan={2} className="border border-border px-3 py-2 text-center font-semibold bg-green-100 dark:bg-green-900/30">Registered</th>
                <th colSpan={2} className="border border-border px-3 py-2 text-center font-semibold bg-yellow-100 dark:bg-yellow-900/30">RECEIVED 3 Birr</th>
                <th colSpan={2} className="border border-border px-3 py-2 text-center font-semibold bg-orange-100 dark:bg-orange-900/30">NOT Received 3 Birr</th>
                <th colSpan={2} className="border border-border px-3 py-2 text-center font-semibold bg-purple-100 dark:bg-purple-900/30">Utilized 3 Birr</th>
                <th colSpan={2} className="border border-border px-3 py-2 text-center font-semibold bg-pink-100 dark:bg-pink-900/30">Not Utilized</th>
              </tr>
              <tr className="bg-muted/30">
                <th className="border border-border px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20">Table</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20">Count</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-red-50 dark:bg-red-900/20">Table</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-red-50 dark:bg-red-900/20">Count</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-green-50 dark:bg-green-900/20">Table</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-green-50 dark:bg-green-900/20">Count</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20">Table</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20">Count</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-orange-50 dark:bg-orange-900/20">Table</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-orange-50 dark:bg-orange-900/20">Count</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/20">Table</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/20">Count</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-pink-50 dark:bg-pink-900/20">Table</th>
                <th className="border border-border px-2 py-1 text-xs font-medium bg-pink-50 dark:bg-pink-900/20">Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredDailyTasks.map((task) => (
                <tr key={task.id} className="hover:bg-muted/20">
                  <td className="border border-border px-3 py-2 font-medium">{task.date}</td>
                  <td className="border border-border px-2 py-2 text-xs font-mono bg-blue-50/50 dark:bg-blue-900/10">{task.gsmGa.table}</td>
                  <td className="border border-border px-2 py-2 text-right font-mono bg-blue-50/50 dark:bg-blue-900/10">{formatNumber(task.gsmGa.count)}</td>
                  <td className="border border-border px-2 py-2 text-xs font-mono bg-red-50/50 dark:bg-red-900/10">{task.notRegistered.table}</td>
                  <td className="border border-border px-2 py-2 text-right font-mono bg-red-50/50 dark:bg-red-900/10">{formatNumber(task.notRegistered.count)}</td>
                  <td className="border border-border px-2 py-2 text-xs font-mono bg-green-50/50 dark:bg-green-900/10">{task.registered.table}</td>
                  <td className="border border-border px-2 py-2 text-right font-mono bg-green-50/50 dark:bg-green-900/10">{formatNumber(task.registered.count)}</td>
                  <td className="border border-border px-2 py-2 text-xs font-mono bg-yellow-50/50 dark:bg-yellow-900/10">{task.received3Birr.table}</td>
                  <td className="border border-border px-2 py-2 text-right font-mono bg-yellow-50/50 dark:bg-yellow-900/10">{formatNumber(task.received3Birr.count)}</td>
                  <td className="border border-border px-2 py-2 text-xs font-mono bg-orange-50/50 dark:bg-orange-900/10">{task.notReceived3Birr.table}</td>
                  <td className="border border-border px-2 py-2 text-right font-mono bg-orange-50/50 dark:bg-orange-900/10">{formatNumber(task.notReceived3Birr.count)}</td>
                  <td className="border border-border px-2 py-2 text-xs font-mono bg-purple-50/50 dark:bg-purple-900/10">{task.utilized3Birr.table}</td>
                  <td className="border border-border px-2 py-2 text-right font-mono bg-purple-50/50 dark:bg-purple-900/10">{formatNumber(task.utilized3Birr.count)}</td>
                  <td className="border border-border px-2 py-2 text-xs font-mono bg-pink-50/50 dark:bg-pink-900/10">{task.notUtilized.table}</td>
                  <td className="border border-border px-2 py-2 text-right font-mono bg-pink-50/50 dark:bg-pink-900/10">{formatNumber(task.notUtilized.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDailyTasks.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No data matching search criteria</div>
          )}
        </CardContent>
      </Card>

      {/* BLOCK 2: Daily GA Flow Summary (Read-Only, Auto-calculated) */}
      <Card>
        <CardHeader className="bg-secondary/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">2️⃣ DAILY GA FLOW SUMMARY</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={summarySearch}
                  onChange={(e) => setSummarySearch(e.target.value)}
                  className="pl-8 h-9 w-48"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportSummary} className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-4 py-3 text-left font-semibold">Date</th>
                <th className="border border-border px-4 py-3 text-right font-semibold">GSM GA</th>
                <th className="border border-border px-4 py-3 text-right font-semibold">NOT REG</th>
                <th className="border border-border px-4 py-3 text-right font-semibold">MPESA GA</th>
                <th className="border border-border px-4 py-3 text-right font-semibold">REWARDED 3B</th>
                <th className="border border-border px-4 py-3 text-right font-semibold">NOT REWARDED 3B</th>
                <th className="border border-border px-4 py-3 text-right font-semibold">BUY BUNDLE</th>
                <th className="border border-border px-4 py-3 text-right font-semibold">NOT BUY BUNDLE</th>
              </tr>
            </thead>
            <tbody>
              {filteredSummary.map((summary, idx) => (
                <tr key={idx} className="hover:bg-muted/20">
                  <td className="border border-border px-4 py-2 font-medium">{summary.date}</td>
                  <td className="border border-border px-4 py-2 text-right font-mono">{formatNumber(summary.gsmGa)}</td>
                  <td className="border border-border px-4 py-2 text-right font-mono text-red-600">{formatNumber(summary.notReg)}</td>
                  <td className="border border-border px-4 py-2 text-right font-mono text-green-600">{formatNumber(summary.mpesaGa)}</td>
                  <td className="border border-border px-4 py-2 text-right font-mono text-yellow-600">{formatNumber(summary.rewarded3B)}</td>
                  <td className="border border-border px-4 py-2 text-right font-mono text-orange-600">{formatNumber(summary.notRewarded3B)}</td>
                  <td className="border border-border px-4 py-2 text-right font-mono text-purple-600">{formatNumber(summary.buyBundle)}</td>
                  <td className="border border-border px-4 py-2 text-right font-mono text-pink-600">{formatNumber(summary.notBuyBundle)}</td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-muted font-bold">
                <td className="border border-border px-4 py-2">TOTAL</td>
                <td className="border border-border px-4 py-2 text-right font-mono">{formatNumber(weeklySummary.reduce((sum, s) => sum + s.gsmGa, 0))}</td>
                <td className="border border-border px-4 py-2 text-right font-mono text-red-600">{formatNumber(weeklySummary.reduce((sum, s) => sum + s.notReg, 0))}</td>
                <td className="border border-border px-4 py-2 text-right font-mono text-green-600">{formatNumber(weeklySummary.reduce((sum, s) => sum + s.mpesaGa, 0))}</td>
                <td className="border border-border px-4 py-2 text-right font-mono text-yellow-600">{formatNumber(weeklySummary.reduce((sum, s) => sum + s.rewarded3B, 0))}</td>
                <td className="border border-border px-4 py-2 text-right font-mono text-orange-600">{formatNumber(weeklySummary.reduce((sum, s) => sum + s.notRewarded3B, 0))}</td>
                <td className="border border-border px-4 py-2 text-right font-mono text-purple-600">{formatNumber(weeklySummary.reduce((sum, s) => sum + s.buyBundle, 0))}</td>
                <td className="border border-border px-4 py-2 text-right font-mono text-pink-600">{formatNumber(weeklySummary.reduce((sum, s) => sum + s.notBuyBundle, 0))}</td>
              </tr>
            </tbody>
          </table>
          {filteredSummary.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No data matching search criteria</div>
          )}
        </CardContent>
      </Card>

      {/* BLOCK 3: Action Plan Table (Manual CRUD) */}
      <Card>
        <CardHeader className="bg-accent/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">3️⃣ ACTION PLAN TABLE</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={actionPlanSearch}
                  onChange={(e) => setActionPlanSearch(e.target.value)}
                  className="pl-8 h-9 w-48"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportActionPlans} className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-4 py-3 text-left font-semibold w-24">DATE</th>
                <th className="border border-border px-4 py-3 text-left font-semibold w-36">CATEGORY</th>
                <th className="border border-border px-4 py-3 text-left font-semibold">TABLE NAME</th>
                <th className="border border-border px-4 py-3 text-right font-semibold w-28">COUNT</th>
                <th className="border border-border px-4 py-3 text-left font-semibold">CAMPAIGN</th>
                <th className="border border-border px-4 py-3 text-left font-semibold w-36">CONTACT PERSON</th>
                <th className="border border-border px-4 py-3 text-left font-semibold w-32">STATUS</th>
                <th className="border border-border px-4 py-3 text-center font-semibold w-16">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredActionPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-muted/20">
                  <td className="border border-border px-2 py-1">
                    <Input
                      value={plan.date}
                      onChange={(e) => handleActionPlanChange(plan.id, 'date', e.target.value)}
                      className="h-8 text-sm w-20"
                    />
                  </td>
                  <td className="border border-border px-2 py-1">
                    <Select
                      value={plan.category}
                      onValueChange={(value) => handleActionPlanChange(plan.id, 'category', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-border px-2 py-1">
                    <Input
                      value={plan.tableName}
                      onChange={(e) => handleActionPlanChange(plan.id, 'tableName', e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-border px-2 py-1">
                    <Input
                      type="number"
                      value={plan.count}
                      onChange={(e) => handleActionPlanChange(plan.id, 'count', parseInt(e.target.value) || 0)}
                      className="h-8 text-xs text-right"
                    />
                  </td>
                  <td className="border border-border px-2 py-1">
                    <Input
                      value={plan.campaign}
                      onChange={(e) => handleActionPlanChange(plan.id, 'campaign', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="border border-border px-2 py-1">
                    <Input
                      value={plan.contactPerson}
                      onChange={(e) => handleActionPlanChange(plan.id, 'contactPerson', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="border border-border px-2 py-1">
                    <Select
                      value={plan.status}
                      onValueChange={(value) => handleActionPlanChange(plan.id, 'status', value)}
                    >
                      <SelectTrigger className={`h-8 text-xs ${
                        plan.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        plan.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        plan.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-border px-2 py-1 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteActionPlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredActionPlans.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No action plans matching search criteria</div>
          )}
          <div className="p-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={addActionPlan}>
              <Plus className="h-4 w-4 mr-2" />
              Add Action Plan Row
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refresh Data?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to refresh the data? This will reload metrics from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelRefresh}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRefresh}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Flow Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New GA Funnel Analysis</DialogTitle>
            <DialogDescription>
              Configure and trigger a new GA funnel analysis. Results will be displayed below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Request Form */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postFix">Post Fix</Label>
                <Input
                  id="postFix"
                  placeholder="e.g., JAN_22 or WEEK_3"
                  value={postFix}
                  onChange={(e) => setPostFix(e.target.value.toUpperCase())}
                />
              </div>

              <div className="grid gap-2">
                <Label>Date Type</Label>
                <RadioGroup
                  value={dateType}
                  onValueChange={(value) => setDateType(value as "fixed" | "range")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="font-normal cursor-pointer">Fixed Date</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="range" id="range" />
                    <Label htmlFor="range" className="font-normal cursor-pointer">Date Range</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="dateVal1">{dateType === "fixed" ? "Date" : "Start Date"}</Label>
                  <Input
                    id="dateVal1"
                    type="date"
                    value={dateVal1}
                    onChange={(e) => setDateVal1(e.target.value)}
                  />
                </div>
                {dateType === "range" && (
                  <div className="grid gap-2">
                    <Label htmlFor="dateVal2">End Date</Label>
                    <Input
                      id="dateVal2"
                      type="date"
                      value={dateVal2}
                      onChange={(e) => setDateVal2(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <Button 
                onClick={handleRunAnalysis} 
                disabled={isAnalyzing}
                className="w-full sm:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Analysis...
                  </>
                ) : (
                  "Run Analysis"
                )}
              </Button>
            </div>

            {/* Results Table */}
            {analysisResults && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Analysis Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="text-green-600 font-medium">{analysisResults.status}</span> | 
                      Date Info: {analysisResults.date_info}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveAll}
                    disabled={analysisResults.results.every(r => r.saved)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save All
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border-b px-4 py-3 text-left font-semibold">Table</th>
                        <th className="border-b px-4 py-3 text-right font-semibold">Count</th>
                        <th className="border-b px-4 py-3 text-center font-semibold">Status</th>
                        <th className="border-b px-4 py-3 text-center font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResults.results.map((result, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                          <td className="px-4 py-3 font-mono text-sm">{result.table}</td>
                          <td className="px-4 py-3 text-right font-medium">{formatNumber(result.count)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              result.status === "Success" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {result.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {result.saved ? (
                              <span className="text-sm text-muted-foreground">Saved ✓</span>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveResult(result.table, result.count)}
                                disabled={savingTable === result.table}
                              >
                                {savingTable === result.table ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
