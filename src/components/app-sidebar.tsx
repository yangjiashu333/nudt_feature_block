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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { NavLink } from 'react-router';

// Menu items.
const items = [
  {
    title: '数据集',
    url: '/dataset',
    icon: Database,
  },
  {
    title: '特征算子',
    url: '/feature',
    icon: ImagePlus,
  },
  {
    title: '用户管理',
    url: '/user',
    icon: Users,
  },
];

export function AppSidebar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <Sidebar>
      {isAuthenticated && user && (
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={`https://picsum.photos/seed/${user.userName}/200`}
                alt={user.userName}
              />
              <AvatarFallback className="text-xl">
                {user.userName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
              {items.map((item) => (
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
