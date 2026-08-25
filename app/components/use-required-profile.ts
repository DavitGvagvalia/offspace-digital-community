"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getPortalProfile } from "../_data/portal-access.repository";
import {
  clearSessionDataCache,
  useSessionCachedQuery,
} from "../_lib/session-cache";
import {
  signOutCurrentUser,
  subscribeToAuthState,
} from "../_lib/supabase/auth";
import type {
  PortalProfileByRole,
  PortalRole,
  RequiredProfileState,
} from "../_types/auth";

const loginPath: Record<PortalRole, string> = {
  student: "/student/login",
  mentor: "/mentor/login",
  "super-admin": "/super-admin/login",
};

export function useRequiredProfile<T extends PortalRole>(
  role: T,
): RequiredProfileState<T> {
  const router = useRouter();
  const [user, setUser] = useState<RequiredProfileState<T>["user"]>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileQuery = useSessionCachedQuery<PortalProfileByRole<T> | null>({
    key: user ? `portal-profile:${role}:${user.id}` : null,
    enabled: Boolean(user) && !error,
    fetcher: () => {
      if (!user) {
        return Promise.resolve(null);
      }

      return getPortalProfile(role, user.id);
    },
  });

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToAuthState((nextUser) => {
      if (!nextUser) {
        clearSessionDataCache();

        if (isMounted) {
          setUser(null);
          setIsAuthLoading(false);
        }

        router.replace(loginPath[role]);
        return;
      }

      if (isMounted) {
        setError(null);
        setUser(nextUser);
        setIsAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [role, router]);

  useEffect(() => {
    let isMounted = true;

    async function signOutUnauthorizedUser() {
      if (
        !user ||
        profileQuery.isLoading ||
        profileQuery.error ||
        profileQuery.data !== null
      ) {
        return;
      }

      await signOutCurrentUser();
      clearSessionDataCache();

      if (isMounted) {
        setUser(null);
        setError("This account does not have access to this portal.");
      }
    }

    signOutUnauthorizedUser().catch((signOutError) => {
      console.error(signOutError);

      if (isMounted) {
        setError("We could not verify your account access.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [profileQuery.data, profileQuery.error, profileQuery.isLoading, user]);

  return {
    user,
    profile: profileQuery.data,
    isLoading: isAuthLoading || (Boolean(user) && profileQuery.isLoading),
    error:
      error ??
      (profileQuery.error ? "We could not verify your account access." : null),
  };
}
