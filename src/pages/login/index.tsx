import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/models/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { UserLoginRequest, UserRegisterRequest } from '@/types/auth';

const loginSchema = z.object({
  userAccount: z.string().min(1, {
    message: '请输入用户名',
  }),
  userPassword: z.string().min(1, {
    message: '请输入密码',
  }),
});

const registerSchema = z
  .object({
    userAccount: z.string().min(1, {
      message: '请输入用户名',
    }),
    userName: z.string().optional(),
    userPassword: z.string().min(6, {
      message: '密码至少需要6位',
    }),
    confirmPassword: z.string().min(1, {
      message: '请确认密码',
    }),
  })
  .refine((data) => data.userPassword === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuthStore();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const currentSchema = isRegisterMode ? registerSchema : loginSchema;

  const form = useForm<z.infer<typeof loginSchema> | z.infer<typeof registerSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      userAccount: '',
      userPassword: '',
      ...(isRegisterMode && { userName: '', confirmPassword: '' }),
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    form.reset({
      userAccount: '',
      userPassword: '',
      ...(isRegisterMode && { userName: '', confirmPassword: '' }),
    });
  }, [isRegisterMode, form]);

  async function onSubmit(values: z.infer<typeof loginSchema> | z.infer<typeof registerSchema>) {
    try {
      if (isRegisterMode) {
        const registerValues = values as z.infer<typeof registerSchema>;
        const { confirmPassword: _confirmPassword, ...registerData } = registerValues;
        await register(registerData as UserRegisterRequest);

        // 注册成功后的业务逻辑
        toast.success('注册成功！请登录');
        setIsRegisterMode(false);
        form.reset();
      } else {
        await login(values as UserLoginRequest);
        // 登录成功后会通过useEffect自动跳转到首页
      }
    } catch (error) {
      // HTTP层已经处理了错误显示
      // 这里只处理特殊的业务逻辑（如果有的话）
      console.error('操作失败:', error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center tracking-tight">
            {isRegisterMode ? '注册账号' : '登录到文档管理系统'}
          </CardTitle>
          <CardDescription className="text-center mt-1">
            {isRegisterMode ? '创建您的账号以开始使用' : '请输入您的账号信息以继续'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="userAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isRegisterMode && (
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>显示名称（可选）</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入显示名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="userPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={isRegisterMode ? '请输入密码（至少6位）' : '请输入密码'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isRegisterMode && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>确认密码</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="请再次输入密码" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button className="cursor-pointer w-full" type="submit">
                {isRegisterMode ? '注册' : '登录'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <Button
              className="cursor-pointer"
              variant="link"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
            >
              {isRegisterMode ? '已有账号？立即登录' : '没有账号？立即注册'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
