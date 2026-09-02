"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { portalLoginPath } from "../_lib/portal-routes";
import { clearSessionDataCache } from "../_lib/session-cache";
import { signOutCurrentUser } from "../_lib/supabase/auth";
import type { PortalRole } from "../_types/auth";
import { Button } from "./ui/button";

export function PortalLogoutButton({
  role,
  className,
  label = "Log out",
  pendingLabel = "Signing out...",
}: {
  role: PortalRole;
  className?: string;
  label?: string;
  pendingLabel?: string;
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    if (isSigningOut) {
      return;
    }

    try {
      setIsSigningOut(true);
      await signOutCurrentUser();
      clearSessionDataCache();
      router.replace(portalLoginPath[role]);
    } catch (error) {
      console.error(error);
      setIsSigningOut(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleLogout}
      disabled={isSigningOut}
      className={className}
    >
      <LogOut aria-hidden="true" className="h-4 w-4" />
      <span className="leading-none">{isSigningOut ? pendingLabel : label}</span>
    </Button>
  );
}
