'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { SIDEBAR_GROUPS } from '@/components/app-sidebar';

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const sidebarGroup = SIDEBAR_GROUPS.find((group) =>
    group.items.some((item) => pathname.startsWith(item.href))
  );
  const sidebarItem = sidebarGroup?.items.find((item) =>
    pathname.startsWith(item.href)
  );

  if (!sidebarGroup || !sidebarItem) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          {sidebarGroup.label}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="hidden md:block">
          {sidebarItem.label}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
