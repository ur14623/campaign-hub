import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Dashboard from "./pages/Dashboard";
import MetricDetail from "./pages/MetricDetail";
import BasePreparation from "./pages/BasePreparation";
import CourtIssue from "./pages/ops-support/CourtIssue";
import DormantList from "./pages/ops-support/DormantList";
import Pinlock from "./pages/ops-support/Pinlock";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="metric/:metricId" element={<MetricDetail />} />
            <Route path="base-preparation" element={<BasePreparation />} />
            <Route path="campaign-management" element={<Dashboard />} />
            <Route path="ops-support/court-issue" element={<CourtIssue />} />
            <Route path="ops-support/dormant-list" element={<DormantList />} />
            <Route path="ops-support/pinlock" element={<Pinlock />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
