"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getPortalProfile } from "../_data/portal-access.repository";
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
  const [profile, setProfile] = useState<PortalProfileByRole<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToAuthState(async (nextUser) => {
      if (!nextUser) {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }

        router.replace(loginPath[role]);
        return;
      }

      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
          setUser(nextUser);
        }

        const nextProfile = await getPortalProfile(role, nextUser.id);

        if (!nextProfile) {
          await signOutCurrentUser();

          if (isMounted) {
            setUser(null);
            setProfile(null);
            setError("This account does not have access to this portal.");
            setIsLoading(false);
          }

          return;
        }

        if (isMounted) {
          setProfile(nextProfile);
          setIsLoading(false);
        }
      } catch (profileError) {
        console.error(profileError);

        if (isMounted) {
          setError("We could not verify your account access.");
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [role, router]);

  return {
    user,
    profile,
    isLoading,
    error,
  };
}
