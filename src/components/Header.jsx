"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Navigation from "./Navigation";

const title = [
  "A propos",
  "Mon portfolio de dessins",
  "Me contacter",
  "Mon portfolio de logo",
];

function headerTextureClass(pathname) {
  if (pathname === "/" || pathname === "/home") return "header_texture";
  if (pathname === "/about") return "header_texture4";
  if (pathname === "/contact" || pathname === "/logo") return "header_texture3";
  if (pathname === "/draw") return "header_texture2";
  return "";
}

function headerSloganTitle(pathname) {
  if (pathname === "/about") return title[0];
  if (pathname === "/contact") return title[2];
  if (pathname === "/draw") return title[1];
  if (pathname === "/logo") return title[3];
  return "";
}

export default function Header() {
  const pathname = usePathname() || "";
  const [isActive, setActive] = useState(false);

  const toggleClass = (e) => {
    e.preventDefault();
    setActive(!isActive);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  const textureClass = headerTextureClass(pathname);
  const slogan = headerSloganTitle(pathname);

  return (
    <div className="header header_article">
      {textureClass ? (
        <div className={`${textureClass} header_article`} />
      ) : null}
      <div className="header_mask">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L 0 0 C 25 100 75 100 100 0 L 100 100" fill="#333" />
        </svg>
      </div>
      <div className="container">
        <div
          className={isActive ? "header_navbar is-open" : "header_navbar"}
          onClick={toggleClass}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleClass(e);
          }}
          role="button"
          tabIndex={0}
        >
          <div className="header_navbar--logo">
            <img
              src="/assets/images/profile1.png"
              className="header_navbar--logo-profile"
              width={45}
              alt="logo"
              onContextMenu={handleContextMenu}
            />
            <h1 className="header_navbar--logo-title">Design And Creation</h1>
          </div>
          <Navigation />
          <div className="header_navbar--toggle">
            <span className="header_navbar--toggle-icons" />
          </div>
        </div>
        <div className="header_slogan">
          {slogan ? <h1 className="header_slogan--title">{slogan}</h1> : null}
        </div>
      </div>
    </div>
  );
}
