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
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src={sanjeevaniLogo}
            alt="Sanjeevani"
            className="h-10 w-10 object-contain rounded-lg"
          />
          {!collapsed && (
            <span className="font-bold text-lg text-foreground">Sanjeevani</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
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
