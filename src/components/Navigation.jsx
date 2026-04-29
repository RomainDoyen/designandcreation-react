"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil", icon: "fas fa-home" },
  { href: "/about", label: "A propos", icon: "fas fa-newspaper" },
  { href: "/contact", label: "Contact", icon: "fas fa-phone" },
];

export default function Navigation() {
  const pathname = usePathname() || "";

  return (
    <div className="header_navbar--menu">
      {links.map(({ href, label, icon }) => {
        const active =
          href === "/"
            ? pathname === "/" || pathname === "/home"
            : pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`header_navbar--menu-link${active ? " is-active" : ""}`}
          >
            <li>
              <i className={icon} />
              &nbsp;{label}
            </li>
          </Link>
        );
      })}
    </div>
  );
}
