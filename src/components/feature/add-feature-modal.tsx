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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFeatureStore } from '@/models/feature';
import type { Modality } from '@/types/common';

const addFeatureSchema = z.object({
  name: z.string().min(1, {
    message: '请输入特征名称',
  }),
  modality: z.enum(['SAR', 'RD', '1D'], {
    message: '请选择数据模态',
  }),
  description: z.string().optional(),
});

type AddFeatureFormData = z.infer<typeof addFeatureSchema>;

interface AddFeatureModalProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

const modalityOptions: { value: Modality; label: string }[] = [
  { value: 'SAR', label: 'SAR' },
  { value: 'RD', label: 'RD' },
  { value: '1D', label: '1D' },
];

export function AddFeatureModal({ open, onOpenChange }: AddFeatureModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addFeature } = useFeatureStore();

  const form = useForm<AddFeatureFormData>({
    resolver: zodResolver(addFeatureSchema),
    defaultValues: {
      name: '',
      modality: undefined,
      description: '',
    },
  });

  const onSubmit = async (values: AddFeatureFormData) => {
    setIsLoading(true);

    try {
      await addFeature({
        name: values.name,
        modality: values.modality,
        description: values.description,
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('添加特征失败:', error);
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
          <DialogTitle className="text-base font-semibold">添加新特征</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>特征名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入特征名称" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>数据模态</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择数据模态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modalityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入特征描述（可选）"
                      {...field}
                      disabled={isLoading}
                      rows={3}
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
                {isLoading ? '添加中...' : '添加特征'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
