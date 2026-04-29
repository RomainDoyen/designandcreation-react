"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";

export default function GalleryPage({ kind, alt }) {
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects?kind=${encodeURIComponent(kind)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      setImageList(data.items?.map((p) => p.imageUrl) ?? []);
    } catch {
      setError("Impossible de charger la galerie.");
      setImageList([]);
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    <div className="gallery-section">
      <div className="inner-width">
        {error ? (
          <p style={{ color: "#eee", textAlign: "center" }}>{error}</p>
        ) : null}
        {loading ? (
          <Spinner />
        ) : (
          <div className="gallery">
            {imageList.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                className="image"
                onClick={() => openModal(url)}
              >
                <img
                  src={url}
                  alt={alt}
                  onContextMenu={handleContextMenu}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      {showModal ? (
        <Modal imageUrl={selectedImage} closeModal={closeModal} />
      ) : null}
    </div>
  );
}
