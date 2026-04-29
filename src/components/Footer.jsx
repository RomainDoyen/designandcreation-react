"use client";

import { useCallback, useEffect, useState } from "react";
import Counter from "./Counter";

export default function Footer() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = useCallback(() => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) setVisible(true);
    else setVisible(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisible);
  }, [toggleVisible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCurrentYear = () => new Date().getFullYear();

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    <div className="footer">
      <div className="parent">
        <div className="element_left">
          <img
            src="/assets/images/profile1.png"
            className="header_navbar--logo-profile"
            width={45}
            alt="profile"
            onContextMenu={handleContextMenu}
          />
          <h1 className="header_navbar--logo-title">Design And Creation</h1>
          <p>
            &copy; Design And Creation 2016 - {getCurrentYear()} | Tous droits
            réservés.
          </p>
        </div>
        <div className="reseaux">
          <span>
            <i className="fa fa-share-alt" />
            &nbsp;Suivez-moi
          </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com/designandcreation39"
            className="sous_reseaux"
            id="facebook"
          >
            <i className="fab fa-facebook-f" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/designandcreation_rd/"
            className="sous_reseaux"
            id="instagram"
          >
            <i className="fab fa-instagram" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://accounts.google.com/"
            className="sous_reseaux"
            id="email"
          >
            <i className="fas fa-envelope" />
          </a>
        </div>
        <div className="element_right">
          <div className="content_counter">
            <Counter />
          </div>
        </div>
      </div>

      <div className="btn_up" onClick={scrollToTop} role="presentation">
        <img
          id="btn_up"
          src="/assets/images/btn_up.png"
          style={{ display: visible ? "inline" : "none" }}
          alt="btn up"
          onContextMenu={handleContextMenu}
        />
      </div>
    </div>
  );
}
