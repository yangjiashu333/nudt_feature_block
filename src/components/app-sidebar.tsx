import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Workflow, 
  Settings, 
  TestTube, 
  Database, 
  Zap, 
  Combine, 
  Brain, 
  Network, 
  Merge, 
  Target 
} from 'lucide-react';
import Link from 'next/link';
import { FeatureBlockIcon } from '@/components/ui/feature-block-icon';

export const SIDEBAR_GROUPS = [
  {
    label: '基础功能',
    items: [
      {
        label: '执行推理',
        href: '/workflow',
        icon: <Workflow size={16} />,
      },
      {
        label: '训练优化',
        href: '/train',
        icon: <Settings size={16} />,
      },
      {
        label: '测试与评估',
        href: '/val',
        icon: <TestTube size={16} />,
      }
    ],
  },
  {
    label: '子模块',
    items: [
      {
        label: '数据接入',
        href: '/data',
        icon: <Database size={16} />,
      },
      {
        label: '多维特征提取',
        href: '/feature',
        icon: <Zap size={16} />,
      },
      {
        label: '特征优选组合',
        href: '/combination',
        icon: <Combine size={16} />,
      },
      {
        label: '特征知识表征',
        href: '/knowledge',
        icon: <Brain size={16} />,
      },
      {
        label: '目标识别网络',
        href: '/network',
        icon: <Network size={16} />,
      },
      {
        label: '网络特征融合',
        href: '/merge',
        icon: <Merge size={16} />,
      },
      {
        label: '分类器',
        href: '/classifier',
        icon: <Target size={16} />,
      }
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <FeatureBlockIcon size={32} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Feature Block</span>
            <span className="text-xs text-muted-foreground">特征融合视觉分类平台</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
