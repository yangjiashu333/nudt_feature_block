import { useUserStore } from '@/models/user';
import type { User } from '@/types/auth';
import { useState } from 'react';
import { Input } from '../ui/input';

// 内联编辑昵称组件
export default function EditableUserName({ user }: { user: User }) {
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
