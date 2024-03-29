import React, { useState, useEffect } from 'react';
import { storage } from "../utils/firebase.config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';
import Footer from './Footer';
import Header from './Header';

const UploadLogo = () => {

    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState([]);

    const imageListRef = ref(storage, "imagesLogo/")

    const uploadImage = () => {
        if (imageUpload === null) {
            return;
        }
        const imageRef = ref(storage, `imagesLogo/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageList((prev) => [...prev, url]);
            }).catch((err) => console.log("err", err));
        });
    }

    useEffect(() => {
        listAll(imageListRef).then((res) => {
            res.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prev) => [...prev, url]);
                }).catch((err) => console.log("err", err));
            });
        });
    }, []);

    return (
        <div>
            <Header></Header>
            <div className="contain-upload">
                <h2 className='articles_title'>Charger un logo</h2>
                <div className="upload">
                    <input className='choose-img__input' type="file" onChange={(e) => setImageUpload(e.target.files[0])}/>
                    <button className='btn-upload-img__button' onClick={uploadImage}>Upload image</button>
                </div>
            </div>
            {/* {imageList.map((url, index) => {
                return <img src={url} key={index} alt="logo"></img>
            })} */}
            <Footer></Footer>
        </div>
    );
};

export default UploadLogo;