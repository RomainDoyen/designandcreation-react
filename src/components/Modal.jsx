"use client";

import { useState } from "react";

export default function Modal({ imageUrl, closeModal }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    <div className="modal">
      <div className="modal-overlay" />
      <div className="modal-content">
        {isLoaded ? null : <div className="modal-loader">Loading...</div>}
        <img
          src={imageUrl}
          alt="Modal"
          className={isLoaded ? "modal-image" : "modal-image hidden"}
          onLoad={handleImageLoad}
          onContextMenu={handleContextMenu}
        />
      </div>
      <button type="button" className="modal-close" onClick={closeModal}>
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
