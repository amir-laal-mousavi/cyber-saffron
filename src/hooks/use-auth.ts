import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  
  // @ts-ignore - TS2589: Type instantiation is excessively deep
  const userQuery = useQuery(api.users.currentUser);
  
  const { signIn, signOut } = useAuthActions();

  // Derive isLoading directly from the dependencies instead of managing separate state
  const isLoading = isAuthLoading || (isAuthenticated && userQuery === undefined);

  return {
    isLoading,
    isAuthenticated,
    user: userQuery,
    signIn,
    signOut,
  };
}