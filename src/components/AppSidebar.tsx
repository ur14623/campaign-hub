import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Trophy,
  TrendingUp,
  Wallet,
  Zap,
  Key,
  DollarSign,
  Coffee,
  Fuel,
  Gift,
  Droplet,
  BarChart3,
  ChevronRight,
  Smartphone,
  Download,
  UserX,
  Search,
  Activity,
  UserPlus,
  Users,
  TrendingDown,
  ShoppingBag,
  Store,
  CreditCard,
  Phone,
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

const appItems = [
  { title: "App Downloader", url: "/app/downloader", icon: Download },
  { title: "App Upgrade", url: "/app/upgrade", icon: TrendingUp },
  { title: "App Churner", url: "/app/churner", icon: UserX },
];

const queryItems = [
  { title: "Active Customers", url: "/query/active-customers", icon: Users },
  { title: "Active New", url: "/query/active-new", icon: UserPlus },
  { title: "Active Total", url: "/query/active-total", icon: Activity },
  { title: "Gross Adds", url: "/query/gross-adds", icon: TrendingUp },
  { title: "Active Existing", url: "/query/active-existing", icon: Users },
  { title: "Non-Gross Adds", url: "/query/non-gross-adds", icon: TrendingDown },
  { title: "Active Micro Merchants", url: "/query/micro-merchants", icon: ShoppingBag },
  { title: "Active Unified Merchants", url: "/query/unified-merchants", icon: Store },
  { title: "Active Transacting Total", url: "/query/transacting-total", icon: CreditCard },
  { title: "Active New Transacting", url: "/query/new-transacting", icon: CreditCard },
  { title: "Active Existing", url: "/query/existing-transacting", icon: CreditCard },
  { title: "App Downloads", url: "/query/app-downloads", icon: Download },
  { title: "Active App Users", url: "/query/active-app-users", icon: Smartphone },
  { title: "App Transacting", url: "/query/app-transacting", icon: CreditCard },
];

const rewardCampaigns = [
  { title: "Win Back Churner", url: "/campaign/win-back-churner", icon: TrendingUp },
  { title: "CBE Campaign", url: "/campaign/cbe", icon: Trophy },
  { title: "Micro Cash", url: "/campaign/micro-cash", icon: Wallet },
  { title: "30% Airtime Bonus", url: "/campaign/airtime-bonus", icon: Zap },
  { title: "PIN Reset", url: "/campaign/pin-reset", icon: Key },
  { title: "Case In", url: "/campaign/case-in", icon: DollarSign },
  { title: "GA Flow Up", url: "/campaign/ga-flow-up", icon: TrendingUp },
  { title: "Airtime Advance", url: "/campaign/airtime-advance", icon: Phone },
];

const merchantCampaigns = [
  { title: "Tomoca Cashback", url: "/campaign/tomoca", icon: Coffee },
  { title: "Fuel Cashback", url: "/campaign/fuel", icon: Fuel },
  { title: "Cashier Incentive", url: "/campaign/cashier", icon: Gift },
  { title: "EEU & Water Cashback", url: "/campaign/eeu-water", icon: Droplet },
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
                      <Smartphone className="h-4 w-4" />
                      <span>App</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {appItems.map((item) => (
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
                      <Search className="h-4 w-4" />
                      <span>Query</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {queryItems.map((item) => (
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
