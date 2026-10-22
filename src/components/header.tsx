"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { ThemePicker } from "@/modules/appearance/theme-provider";
export function Header() {
  const pathname = usePathname();
  const { isAuthenticated } = useConvexAuth();
  const viewer = useQuery(api.identity.current, isAuthenticated ? {} : "skip");
  const { signOut } = useAuthActions();
  return (
    <header className="header">
      <Link className="brand" href="/">
        <span className="brand-symbol" aria-hidden="true">
          c<span>·</span>
        </span>
        CareTable
      </Link>
      <nav aria-label="Main navigation">
        <Link
          aria-current={pathname === "/planner" ? "page" : undefined}
          href="/planner"
        >
          Your table
        </Link>
        <Link
          aria-current={pathname === "/account" ? "page" : undefined}
          href="/account"
        >
          Your account
        </Link>
        {viewer && viewer.role !== "member" && (
          <Link href="/admin">Administration</Link>
        )}
      </nav>
      <div className="header-tools">
        <ThemePicker />
        {isAuthenticated ? (
          <button className="text-button" onClick={() => void signOut()}>
            Sign out
          </button>
        ) : (
          <Link className="button small" href="/sign-in">
            Sign in <span>↗</span>
          </Link>
        )}
      </div>
    </header>
  );
}
