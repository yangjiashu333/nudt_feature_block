import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/models/user';
import type { UserRole } from '@/types/auth';

const addUserSchema = z.object({
  userAccount: z.string().min(1, {
    message: '请输入用户名',
  }),
  userName: z.string().optional(),
  userPassword: z.string().min(6, {
    message: '密码至少需要6位',
  }),
  userRole: z.enum(['admin', 'user', 'ban']),
});

type AddUserFormData = z.infer<typeof addUserSchema>;

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addUser, isUserAccountExists } = useUserStore();

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      userAccount: '',
      userName: '',
      userPassword: '',
      userRole: 'user' as const,
    },
  });

  const onSubmit = async (values: AddUserFormData) => {
    setIsLoading(true);
    
    try {
      // 检查用户名是否已存在
      if (isUserAccountExists(values.userAccount)) {
        form.setError('userAccount', {
          type: 'manual',
          message: '用户名已存在',
        });
        setIsLoading(false);
        return;
      }

      const result = addUser({
        userAccount: values.userAccount,
        userName: values.userName,
        userPassword: values.userPassword,
        userRole: values.userRole as UserRole,
      });

      if (result.success) {
        form.reset();
        onOpenChange(false);
        // 可以在这里添加成功提示
      } else {
        // 处理错误
        console.error(result.message);
      }
    } catch (error) {
      console.error('添加用户失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加新用户</DialogTitle>
          <DialogDescription>
            创建一个新的用户账号。用户名必须唯一。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入用户名"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>昵称（可选）</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入昵称"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="请输入密码（至少6位）"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">管理员</SelectItem>
                      <SelectItem value="user">用户</SelectItem>
                      <SelectItem value="ban">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '添加中...' : '添加用户'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}