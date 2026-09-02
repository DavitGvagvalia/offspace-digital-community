"use client";

import { Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { portalLoginPath } from "../../_lib/portal-routes";
import { clearSessionDataCache } from "../../_lib/session-cache";
import { signOutCurrentUser } from "../../_lib/supabase/auth";
import { PortalLogoutButton } from "../../components/portal-logout-button";
import { Button } from "../../components/ui/button";
import { deleteCurrentStudentAuthAccount } from "./actions";

export function StudentProfileActions() {
  const router = useRouter();
  const titleId = useId();
  const descriptionId = useId();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDeleteProfile() {
    try {
      setIsDeletingProfile(true);
      setDeleteError(null);
      const result = await deleteCurrentStudentAuthAccount();

      if (!result.ok) {
        setDeleteError(result.message);
        setIsDeletingProfile(false);
        setIsDeleteDialogOpen(false);
        return;
      }

      await signOutCurrentUser();
      clearSessionDataCache();
      router.replace(portalLoginPath.student);
    } catch (error) {
      console.error(error);
      setDeleteError("We could not delete your profile right now.");
      setIsDeletingProfile(false);
      setIsDeleteDialogOpen(false);
    }
  }

  return (
    <section>
      {deleteError ? (
        <p
          role="alert"
          className="rounded-sm border border-danger/20 bg-danger/10 px-3 py-2 text-sm leading-6 text-danger"
        >
          {deleteError}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <PortalLogoutButton
          role="student"
          variant="danger"
          className="w-full"
        />
        <Button
          type="button"
          variant="danger"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeletingProfile}
          className="w-full"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          Delete account
        </Button>
      </div>

      {isDeleteDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 py-6"
          onClick={() => {
            if (!isDeletingProfile) {
              setIsDeleteDialogOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="w-full max-w-md rounded-md border border-danger/25 bg-offwhite p-5 text-ink shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-danger">
                  Delete account
                </p>
                <h2 id={titleId} className="mt-2 text-2xl font-semibold">
                  Permanently delete your account?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeletingProfile}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-ink-muted transition hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:pointer-events-none disabled:opacity-55"
                aria-label="Close delete profile confirmation"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <p
              id={descriptionId}
              className="mt-3 text-sm leading-6 text-ink-soft"
            >
              This will permanently delete your login account, remove your
              student portal access, and sign you out.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeletingProfile}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteProfile}
                disabled={isDeletingProfile}
                className="w-full"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                {isDeletingProfile ? "Deleting..." : "Delete account"}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
