"use client";
import { useQuery, useConvexAuth } from "convex/react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
export function AccountPanel() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [recoveryError, setRecoveryError] = useState("");
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.identity.current, isAuthenticated ? {} : "skip");
  if (isLoading || (isAuthenticated && user === undefined))
    return <div className="skeleton sk-card" />;
  if (!user)
    return (
      <section className="panel">
        <h2>Your account starts here.</h2>
        <p>Sign in to save preferences and access your household.</p>
        <Link className="button" href="/sign-in">
          Sign in
        </Link>
      </section>
    );
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">YOUR CARETABLE</span>
        <h1>
          {user.isAnonymous ? "Your sample table." : `Hello, ${user.name}.`}
        </h1>
        <p>Your profile, your preferences, your place at the table.</p>
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <span className="badge">ACCOUNT</span>
          <h2>Your details</h2>
          <dl>
            <dt>Email</dt>
            <dd>
              {user.isAnonymous
                ? "Fictional sample session — no email required"
                : user.email}
            </dd>
            <dt>Access</dt>
            <dd>{user.role}</dd>
          </dl>
          {user.isAnonymous ? (
            <p>
              This sample is linked to this browser session. Reset it from Your
              table. To create your own account, leave the sample from the
              sign-in page.
            </p>
          ) : (
            <button className="text-button" onClick={async () => {
              try { await signOut(); router.push("/sign-in?flow=reset"); }
              catch { setRecoveryError("Could not sign out. Try the Sign out button in the header before password recovery."); }
            }}>Sign out & recover password</button>
          )}
          {recoveryError && <p role="alert">{recoveryError}</p>}
        </section>
        <section className="panel">
          <span className="badge">APPEARANCE</span>
          <h2>Make yourself at home.</h2>
          <p>
            Use the theme menu in the header to follow the site default or keep
            your own palette. Your selection is saved to your account.
          </p>
        </section>
        <section className="panel">
          <span className="badge">YOUR HOUSEHOLD</span>
          <h2>Good food starts with you.</h2>
          <p>
            Create an individual, partner, or family profile with preferences
            kept separate for each person.
          </p>
          <Link className="button outline" href="/planner">
            Open your table ↗
          </Link>
        </section>
      </div>
      {user.role !== "member" && (
        <Link className="button outline" href="/admin">
          Open administration
        </Link>
      )}
    </>
  );
}
