import React, { useState, useEffect } from 'react';
import { storage } from "../utils/firebase.config";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import Footer from '../components/Footer';
import Header from '../components/Header';
import Swal from 'sweetalert2';
import Spinner from "../components/Spinner";

const Logo = () => {

    const [imageList, setImageList] = useState([]);
    const [loading, setLoading] = useState(true);

    const imageListRef = ref(storage, "imagesLogo/");

    useEffect(() => {
        listAll(imageListRef).then((res) => {
            res.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prev) => [...prev, url]);
                    setLoading(false);
                }).catch((err) => console.log("err", err));
            });
        });
    }, []);

    const showModal = () => {
        Swal.fire({
            imageUrl: imageList,
            imageWidth: 600,
            imageHeight: 300,
            imageAlt: 'Custom image',
        });
    }

    return (
        <div>
            <Header></Header>
            <div className="gallery-section">
                <div className="inner-width">
                    { loading ? <Spinner></Spinner> : 
                        <div className="gallery">
                            {imageList.map((url, index) => {
                                return (
                                    <button key={index} className="image" onClick={showModal}>
                                        <img src={url} key={index} alt="logo"></img>
                                    </button>  
                                );
                            })}
                        </div>
                    }
                </div>
    	    </div>
            <Footer></Footer>
        </div>
    );
};

export default Logo;