import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  ChevronRight,
  Database,
  Settings,
  LogOut,
  Upload,
  Eye,
  List,
  Cog,
  Brain,
} from 'lucide-react';

const menuItems = [
  {
    title: '数据管理',
    path: '/dashboard/data',
    icon: Database,
    items: [
      { title: '数据上传', path: '/dashboard/data/upload', icon: Upload },
      { title: '数据预览', path: '/dashboard/data/preview', icon: Eye },
    ],
  },
  {
    title: '算子管理',
    path: '/dashboard/operators',
    icon: Settings,
    items: [
      { title: '算子列表', path: '/dashboard/operators/list', icon: List },
      { title: '算子配置', path: '/dashboard/operators/config', icon: Cog },
    ],
  },
];

function getBreadcrumbItems(pathname: string) {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [{ title: '首页', path: '/dashboard' }];

  if (pathSegments.length > 1) {
    const section = pathSegments[1];
    const page = pathSegments[2];

    for (const menuItem of menuItems) {
      const matchingSubItem = menuItem.items.find(
        item => item.path.includes(section) && item.path.includes(page)
      );
      if (matchingSubItem) {
        breadcrumbItems.push(
          { title: menuItem.title, path: menuItem.path },
          { title: matchingSubItem.title, path: matchingSubItem.path }
        );
        break;
      }
    }
  }

  return breadcrumbItems;
}

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  return (
    <SidebarProvider>
      <div className='flex h-screen w-full'>
        <Sidebar>
          <SidebarHeader>
            <div className='flex items-center gap-2 px-4 py-2'>
              <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                <Brain className='h-4 w-4 text-primary-foreground' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>AI 训练平台</span>
                <span className='truncate text-xs'>机器学习管理系统</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <item.icon className='h-4 w-4' />
                        <span>{item.title}</span>
                        <ChevronRight className='ml-auto h-4 w-4' />
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.items.map(subItem => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.path}>
                                <subItem.icon className='h-4 w-4' />
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className='flex items-center gap-2 px-4 py-2'>
                  <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center'>
                    <span className='text-sm font-medium'>
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.username}
                    </span>
                    <span className='truncate text-xs'>{user?.email}</span>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleLogout}
                    className='h-8 w-8 p-0'
                  >
                    <LogOut className='h-4 w-4' />
                  </Button>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className='flex-1 flex flex-col'>
          <header className='flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4'>
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <div key={item.title} className='flex items-center'>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbItems.length - 1 ? (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.path}>
                          {item.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className='flex-1 overflow-auto p-4'>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
