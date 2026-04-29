"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminTopBar() {
  const pathname = usePathname() || "";

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <header className="admin-topbar">
      <Link href="/admin" className="admin-topbar__brand">
        <span className="admin-topbar__brand-badge" aria-hidden>
          <i className="fas fa-palette" />
        </span>
        <span>
          Design And Creation
          <span className="admin-topbar__tag">Admin</span>
        </span>
      </Link>
      <nav className="admin-topbar__nav" aria-label="Navigation admin">
        <Link
          href="/admin"
          className={`admin-topbar__link${pathname === "/admin" ? " is-active" : ""}`}
        >
          Tableau de bord
        </Link>
        <Link
          href="/admin/draw"
          className={`admin-topbar__link${pathname === "/admin/draw" ? " is-active" : ""}`}
        >
          Dessins
        </Link>
        <Link
          href="/admin/logo"
          className={`admin-topbar__link${pathname === "/admin/logo" ? " is-active" : ""}`}
        >
          Logos
        </Link>
      </nav>
      <div className="admin-topbar__actions">
        <Link href="/" className="admin-topbar__btn-ghost">
          <i className="fas fa-external-link-alt" /> Site public
        </Link>
        <button type="button" className="admin-topbar__btn-logout" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}
