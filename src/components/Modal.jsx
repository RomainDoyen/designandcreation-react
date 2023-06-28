import React, { useState } from "react";
import PropTypes from "prop-types";

const Modal = ({ imageUrl, closeModal }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="modal">
      <div className="modal-overlay"></div>
      <div className="modal-content">
        {isLoaded ? null : <div className="modal-loader">Loading...</div>}
        <img
          src={imageUrl}
          alt="Modal"
          className={isLoaded ? "modal-image" : "modal-image hidden"}
          onLoad={handleImageLoad}
        />
      </div>
      <button className="modal-close" onClick={closeModal}>
          <i className="fa-solid fa-xmark"></i>
        </button>
    </div>
  );
};

Modal.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;
