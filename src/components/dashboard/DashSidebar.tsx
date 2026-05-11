import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Code2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DashSection = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  group: "main" | "manage" | "system";
};

export default function DashSidebar({
  sections, current, onSelect, onSignOut, brand = "Web Store",
}: {
  sections: DashSection[];
  current: string;
  onSelect: (id: string) => void;
  onSignOut: () => void;
  brand?: string;
}) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const groups: { key: DashSection["group"]; label: string }[] = [
    { key: "main", label: "Main" },
    { key: "manage", label: "Manage" },
    { key: "system", label: "System" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight truncate">{brand}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Admin Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g) => {
          const items = sections.filter((s) => s.group === g.key);
          if (!items.length) return null;
          return (
            <SidebarGroup key={g.key}>
              {!collapsed && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((s) => (
                    <SidebarMenuItem key={s.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={current === s.id}
                        tooltip={s.label}
                      >
                        <button
                          type="button"
                          onClick={() => onSelect(s.id)}
                          className="flex items-center gap-2 w-full"
                        >
                          <s.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="flex-1 text-start truncate">{s.label}</span>}
                          {!collapsed && !!s.badge && (
                            <span className="ms-auto text-[10px] font-semibold rounded-full bg-primary/20 text-primary px-2 py-0.5">
                              {s.badge}
                            </span>
                          )}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <Button variant="ghost" size="sm" onClick={onSignOut} className="justify-start">
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ms-2">Sign out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
