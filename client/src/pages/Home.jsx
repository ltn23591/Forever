import React from 'react';
import Hero from '../components/Hero';
import LastedCollection from '../components/LastedCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsLetterBox from '../components/NewsLetterBox';
const Home = () => {
    return (
        <div>
            <Hero />
            <LastedCollection />
            <BestSeller />
            <OurPolicy />
            <NewsLetterBox />
        </div>
    );
};

export default Home;
