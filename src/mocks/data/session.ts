import type { User } from '@/types/auth';

class MockSession {
  private currentUser: User | null = null;

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  clear(): void {
    this.currentUser = null;
  }
}

export const mockSession = new MockSession();
