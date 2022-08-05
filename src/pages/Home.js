import React from 'react';
import CardDataView from '../components/CardDataView';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Home = () => {
    return (
        <div>
            <Header></Header>
            <CardDataView></CardDataView>
            <Footer></Footer>
        </div>
    );
};

export default Home;