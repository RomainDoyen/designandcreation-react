import React, { useState, useEffect } from "react";
import { storage } from "../utils/firebase.config";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Swal from 'sweetalert2';

const Draw = () => {
  const [imageList, setImageList] = useState([]);

  const imageListRef = ref(storage, "imagesDraw/");

  useEffect(() => {
    listAll(imageListRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item)
          .then((url) => {
            setImageList((prev) => [...prev, url]);
          })
          .catch((err) => console.log("err", err));
      });
    });
  }, []);

  const showModal = () => {
    Swal.fire({
        imageUrl: imageList,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
    });
  }

  return (
    <div>
      <Header></Header>
      <div className="gallery-section">
        <div className="inner-width">
          <div className="gallery">
            {imageList.map((url, index) => {
              return (
                <button key={index} className="image" onClick={showModal}>
                    <img src={url} key={index} alt="draw"></img>
                </button> 
              );
            })}
          </div>
          <div>
        </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Draw;
