import { createContext } from "react";
import type { UserProfile } from "../../../services/authService";

export interface AdminProfileContextValue {
  readonly profile: UserProfile;
  readonly avatarUrl: string | null;
  readonly isLoading: boolean;
  readonly isSaving: boolean;
  readonly updateAvatar: (newAvatarUrl: string) => Promise<boolean>;
  readonly updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  readonly reloadProfile: () => void;
}

export const AdminProfileContext = createContext<AdminProfileContextValue | null>(null);

