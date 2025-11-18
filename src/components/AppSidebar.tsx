import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Trophy,
  TrendingUp,
  Wallet,
  Download,
  Zap,
  Users,
  Key,
  DollarSign,
  MessageSquare,
  Upload,
  UserX,
  Lock,
  Info,
  Coffee,
  Fuel,
  Gift,
  Droplet,
  Settings,
  UserCog,
  BarChart3,
  Calendar,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const rewardCampaigns = [
  { title: "Win Back Churner", url: "/campaign/win-back-churner", icon: TrendingUp },
  { title: "CBE Campaign", url: "/campaign/cbe", icon: Trophy },
  { title: "Micro Cash", url: "/campaign/micro-cash", icon: Wallet },
  { title: "App Download", url: "/campaign/app-download", icon: Download },
  { title: "30% Airtime Bonus", url: "/campaign/airtime-bonus", icon: Zap },
  { title: "App Churner", url: "/campaign/app-churner", icon: Users },
  { title: "PIN Reset", url: "/campaign/pin-reset", icon: Key },
  { title: "Case In", url: "/campaign/case-in", icon: DollarSign },
];

const infoCampaigns = [
  { title: "App Upgrade", url: "/campaign/app-upgrade", icon: Upload },
  { title: "Airtime Advance", url: "/campaign/airtime-advance", icon: MessageSquare },
  { title: "Unutilized Customers", url: "/campaign/unutilized", icon: UserX },
  { title: "USSD Password Push", url: "/campaign/ussd-password", icon: Lock },
];

const merchantCampaigns = [
  { title: "Tomoca Cashback", url: "/campaign/tomoca", icon: Coffee },
  { title: "Fuel Cashback", url: "/campaign/fuel", icon: Fuel },
  { title: "Cashier Incentive", url: "/campaign/cashier", icon: Gift },
  { title: "EEU & Water Cashback", url: "/campaign/eeu-water", icon: Droplet },
];

const adminItems = [
  { title: "Campaign Setup", url: "/admin/setup", icon: Settings },
  { title: "User Management", url: "/admin/users", icon: UserCog },
  { title: "System Configuration", url: "/admin/config", icon: Settings },
  { title: "Report Scheduler", url: "/admin/reports", icon: Calendar },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <div className="px-3 py-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sidebar-primary" />
            {open && "MPESA Manager"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-sidebar-primary">
                      <Trophy className="h-4 w-4" />
                      <span>Reward Campaigns</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {rewardCampaigns.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
                            <NavLink to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-info">
                      <Info className="h-4 w-4" />
                      <span>Info Campaigns</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {infoCampaigns.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
                            <NavLink to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-accent">
                      <Coffee className="h-4 w-4" />
                      <span>Merchant Campaigns</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {merchantCampaigns.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
                            <NavLink to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-muted-foreground">
                      <Settings className="h-4 w-4" />
                      <span>Administrative</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {adminItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
                            <NavLink to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
