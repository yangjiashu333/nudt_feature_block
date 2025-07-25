import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUserStore } from '@/models/user';
import { useAuthStore } from '@/models/auth';
import type { User } from '@/types/auth';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  user: User | null;
}

export function DeleteUserDialog({ open, onOpenChange, user }: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteUser } = useUserStore();
  const { user: currentUser, logout } = useAuthStore();

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      await deleteUser(user.id);
      onOpenChange(false);
      // 如果删除的是当前用户自己，需要登出
      if (currentUser && currentUser.id === user.id) {
        setTimeout(async () => {
          alert('账号已注销，即将退出登录');
          await logout();
        }, 100);
      }
    } catch (error) {
      console.error('删除用户失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOwnAccount = currentUser && user && currentUser.id === user.id;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isOwnAccount ? '注销账号' : '删除用户'}</AlertDialogTitle>
          <AlertDialogDescription>
            {isOwnAccount ? (
              <>
                你确定要注销自己的账号吗？
                <br />
                <strong className="text-destructive">
                  注销后将立即退出登录，且无法恢复此账号。
                </strong>
              </>
            ) : (
              <>
                你确定要删除用户 <strong>{user?.userName}</strong>（{user?.userAccount}）吗？
                <br />
                <strong className="text-destructive">
                  此操作无法撤销，用户的所有数据将被永久删除。
                </strong>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? '处理中...' : isOwnAccount ? '确认注销' : '确认删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// 批量删除对话框
interface DeleteUsersDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  users: User[];
  onSuccess?: () => void;
}

export function DeleteUsersDialog({ open, onOpenChange, users }: DeleteUsersDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteUsers } = useUserStore();
  const { user: currentUser, logout } = useAuthStore();

  const handleDelete = async () => {
    if (users.length === 0) return;

    setIsLoading(true);

    try {
      const userIds = users.map((u) => u.id);
      await deleteUsers(userIds);
      onOpenChange(false);

      // 检查是否删除了当前用户自己
      const deletedSelf = currentUser && userIds.includes(currentUser.id);
      if (deletedSelf) {
        setTimeout(async () => {
          alert('账号已注销，即将退出登录');
          await logout();
        }, 100);
      }
    } catch (error) {
      console.error('批量删除用户失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const includesSelf = currentUser && users.some((u) => u.id === currentUser.id);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>批量删除用户</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要删除选中的 <strong>{users.length}</strong> 个用户吗？
            <br />
            {includesSelf && (
              <span className="text-destructive font-medium">
                注意：选中的用户中包含你自己的账号，删除后将立即退出登录。
              </span>
            )}
            <br />
            <strong className="text-destructive">
              此操作无法撤销，所有选中用户的数据将被永久删除。
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading || users.length === 0}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? '删除中...' : '确认删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
