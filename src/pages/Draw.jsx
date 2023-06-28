import React, { useState, useEffect } from "react";
import { storage } from "../utils/firebase.config";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";

const Draw = () => {
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const imageListRef = ref(storage, "imagesDraw/");

  useEffect(() => {
    const fetchData = async () => {
      const res = await listAll(imageListRef);
      const urls = await Promise.all(res.items.map(item => getDownloadURL(item).catch(err => console.log("err", err))));
      setImageList(prev => Array.from(new Set([...prev, ...urls])));
      setLoading(false);
    };
  
    fetchData();
  }, []); 
  
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleContextMenu = (event) => {
    event.preventDefault(); // Empêche l'affichage du menu contextuel
  };

  return (
    <div>
      <Header></Header>
      <div className="gallery-section">
        <div className="inner-width">
          {loading ? (
            <Spinner />
          ) : (
            <div className="gallery">
              {imageList.map((url, index) => (
                <button
                  key={index}
                  className="image"
                  onClick={() => openModal(url)}
                >
                  <img src={url} key={index} alt="draw" onContextMenu={handleContextMenu}></img>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <Modal imageUrl={selectedImage} closeModal={closeModal} />
      )}
      <Footer></Footer>
    </div>
  );
};

export default Draw;