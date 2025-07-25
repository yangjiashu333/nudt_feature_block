import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Plus, ChevronDown, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/models/auth';
import { useUserStore } from '@/models/user';
import { columns } from '@/components/user/user-columns';
import { AddUserModal } from '@/components/user/add-user-modal';
import { PasswordModal } from '@/components/user/password-modal';
import { DeleteUserDialog, DeleteUsersDialog } from '@/components/user/delete-user-dialog';
import type { User } from '@/types/auth';

export default function UserManagement() {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const { getUserList, users } = useUserStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Modal states
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 获取用户列表
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await getUserList();
      } catch (error) {
        console.error('获取用户列表失败:', error);
      }
    };

    if (isAuthenticated && currentUser?.userRole === 'admin') {
      loadUsers();
    }
  }, [isAuthenticated, currentUser, getUserList]);

  // 权限验证：只有admin用户可以访问
  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.userRole !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // 监听自定义事件
  useEffect(() => {
    const handleOpenPasswordModal = (event: CustomEvent) => {
      setSelectedUser(event.detail);
      setPasswordModalOpen(true);
    };

    const handleOpenDeleteDialog = (event: CustomEvent) => {
      setSelectedUser(event.detail);
      setDeleteDialogOpen(true);
    };

    window.addEventListener('openPasswordModal', handleOpenPasswordModal as EventListener);
    window.addEventListener('openDeleteDialog', handleOpenDeleteDialog as EventListener);

    return () => {
      window.removeEventListener('openPasswordModal', handleOpenPasswordModal as EventListener);
      window.removeEventListener('openDeleteDialog', handleOpenDeleteDialog as EventListener);
    };
  }, []);

  // 批量删除
  const handleBatchDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    setBatchDeleteDialogOpen(true);
  };

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedUsers = selectedRows.map((row) => row.original);

  // 如果不是admin用户，显示权限不足
  if (!isAuthenticated || !currentUser || currentUser.userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">权限不足</h2>
          <p className="text-muted-foreground">只有管理员用户可以访问用户管理功能</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">用户管理</h1>
          <p className="text-muted-foreground">
            管理系统用户，包括添加、编辑、删除用户和设置角色权限
          </p>
        </div>
        <Button onClick={() => setAddUserModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加用户
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="搜索用户名..."
          value={(table.getColumn('userAccount')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('userAccount')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn('userRole')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value: string) => {
            table.getColumn('userRole')?.setFilterValue(value === 'all' ? '' : value);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="角色筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部角色</SelectItem>
            <SelectItem value="admin">管理员</SelectItem>
            <SelectItem value="user">用户</SelectItem>
            <SelectItem value="ban">禁用</SelectItem>
          </SelectContent>
        </Select>
        {selectedRows.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            删除选中 ({selectedRows.length})
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              列显示 <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === 'id' && 'ID'}
                    {column.id === 'userAccount' && '用户名'}
                    {column.id === 'userName' && '昵称'}
                    {column.id === 'userRole' && '角色'}
                    {column.id === 'actions' && '操作'}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  没有找到用户数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} /{' '}
          {table.getFilteredRowModel().rows.length} 行已选择
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">每页显示</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal open={addUserModalOpen} onOpenChange={setAddUserModalOpen} />
      <PasswordModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        user={selectedUser}
      />
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
      />
      <DeleteUsersDialog
        open={batchDeleteDialogOpen}
        onOpenChange={setBatchDeleteDialogOpen}
        users={selectedUsers}
        onSuccess={() => {
          setRowSelection({});
        }}
      />
    </div>
  );
}
