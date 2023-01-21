import React, { useEffect, useState } from 'react';
import axios from "axios";

const Counter = () => {

    const [counter, setCounter] = useState([]);

    const updateCounter = () => {
        axios.get('https://api.countapi.xyz/hit/designandcreation-compteur/visits').then((res) => { 
            setCounter(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        updateCounter();
    }, []);

    return (
        <div>
            <p id="msg" style={{ color: "#fff" }}>Nombres de pages vues</p>
	  		<span id="counter" counter={counter} key={counter.id}>{counter.data?.map((count) => (
                <p style={{ color: "#fff" }}>{count?.value}</p>
            ))}</span>
        </div>
    );
};

export default Counter;