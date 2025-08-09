import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/models/user';

const addUserSchema = z.object({
  userAccount: z.string().min(1, {
    message: '请输入用户名',
  }),
  userName: z.string().optional(),
  userPassword: z.string().min(6, {
    message: '密码至少需要6位',
  }),
});

type AddUserFormData = z.infer<typeof addUserSchema>;

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

export function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addUser } = useUserStore();

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      userAccount: '',
      userName: '',
      userPassword: '',
    },
  });

  const onSubmit = async (values: AddUserFormData) => {
    setIsLoading(true);

    try {
      await addUser({
        userAccount: values.userAccount,
        userName: values.userName,
        userPassword: values.userPassword,
      });

      form.reset();
      onOpenChange(false);
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
          <DialogTitle className="text-base font-semibold">添加新用户</DialogTitle>
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
                    <Input placeholder="请输入用户名" {...field} disabled={isLoading} />
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
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入姓名" {...field} disabled={isLoading} />
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
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
