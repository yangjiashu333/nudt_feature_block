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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { User, UserRole } from '@/types/auth';
import { useState } from 'react';
import { useUserStore } from '@/models/user';

// 内联编辑昵称组件
function EditableUserName({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(user.userName);
  const { updateUser } = useUserStore();

  const handleSave = () => {
    if (editValue.trim() && editValue !== user.userName) {
      updateUser(user.id, { userName: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(user.userName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-8 text-sm"
        autoFocus
      />
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded min-h-[24px] flex items-center"
      onClick={() => setIsEditing(true)}
      title="点击编辑昵称"
    >
      {user.userName}
    </div>
  );
}

// 角色选择组件
function RoleSelect({ user }: { user: User }) {
  const { updateUser } = useUserStore();

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole !== user.userRole) {
      updateUser(user.id, { userRole: newRole });
    }
  };

  return (
    <Select value={user.userRole} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-24 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">管理员</SelectItem>
        <SelectItem value="user">用户</SelectItem>
        <SelectItem value="ban">禁用</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
                // 触发密码修改Modal
                window.dispatchEvent(new CustomEvent('openPasswordModal', { detail: user }));
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              修改密码
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                // 触发删除确认Dialog
                window.dispatchEvent(new CustomEvent('openDeleteDialog', { detail: user }));
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