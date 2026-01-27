import { Home, User, Heart, Shield, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import sanjeevaniLogo from "@/assets/sanjeevani-logo.jpg";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", href: "#home", icon: Home },
  { title: "Health Profile", href: "#profile", icon: User },
  { title: "First Aid", href: "#first-aid", icon: Heart },
  { title: "Warriors", href: "#warriors", icon: Shield },
  { title: "Emergency Dashboard", href: "#sos", icon: LayoutDashboard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar 
      collapsible="icon" 
      className={cn(
        "border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarHeader className="p-4 border-b border-border">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          collapsed && "justify-center"
        )}>
          <img
            src={sanjeevaniLogo}
            alt="Sanjeevani"
            className={cn(
              "object-contain rounded-lg transition-all duration-300",
              collapsed ? "h-8 w-8" : "h-10 w-10"
            )}
          />
          <span className={cn(
            "font-bold text-lg text-foreground transition-all duration-300 whitespace-nowrap overflow-hidden",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            Sanjeevani
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg hover:bg-muted transition-all duration-200 group",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span className={cn(
                        "font-medium transition-all duration-300 whitespace-nowrap overflow-hidden",
                        collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                      )}>
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
