import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2, Key } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/models/user';
import type { User } from '@/types/auth';
import EditableUserName from './editable-user-name';
import RoleSelect from './role-select';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="w-[60px]">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'userAccount',
    header: '用户名',
    cell: ({ row }) => {
      const userAccount = row.getValue('userAccount') as string;
      return <div className="font-medium">{userAccount}</div>;
    },
  },
  {
    accessorKey: 'userName',
    header: '昵称',
    cell: ({ row }) => <EditableUserName user={row.original} />,
  },
  {
    accessorKey: 'userRole',
    header: '角色',
    cell: ({ row }) => <RoleSelect user={row.original} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      const user = row.original;
      const { openModal } = useUserStore.getState();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">打开菜单</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                openModal('password', user);
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              修改密码
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                openModal('deleteUser', user);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除用户
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
