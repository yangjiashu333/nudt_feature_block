import { useUserStore } from '@/models/user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { User, UserRole } from '@/types/auth';

// 角色选择组件
export default function RoleSelect({ user }: { user: User }) {
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
