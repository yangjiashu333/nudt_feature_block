import { ImagePlus, Database, User, Users } from 'lucide-react';
import { useAuthStore } from '@/models/auth';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { NavLink } from 'react-router';

// Menu items.
const items = [
  {
    title: '数据集',
    url: '/dataset',
    icon: Database,
    roles: ['admin', 'user'],
  },
  {
    title: '特征算子',
    url: '/feature',
    icon: ImagePlus,
    roles: ['admin', 'user'],
  },
  {
    title: '用户管理',
    url: '/user',
    icon: Users,
    roles: ['admin', 'user'],
  },
];

export function AppSidebar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  // 过滤有权限的菜单项
  const accessibleItems = items.filter((item) => {
    if (!isAuthenticated || !user) return false;
    return item.roles.includes(user.userRole);
  });

  return (
    <Sidebar>
      {isAuthenticated && user && (
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col justify-center flex-1">
              <p className="font-medium">{user.userName}</p>
              <p className="text-sm text-muted-foreground">{user.userAccount}</p>
            </div>
          </div>
        </SidebarHeader>
      )}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive}>
                        <item.icon className="mr-1 h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {isAuthenticated && (
        <SidebarFooter className="border-t">
          <Button
            variant="link"
            onClick={() => logout()}
            className="w-full flex items-center justify-center cursor-pointer text-muted-foreground"
          >
            Logout
            <User className="h-4 w-4" />
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
