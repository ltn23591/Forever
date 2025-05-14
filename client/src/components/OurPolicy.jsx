import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const OurPolicy = () => {
    return (
        <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
            <div>
                <img
                    src={assets.exchange_icon}
                    alt="Exchange Icon"
                    className="w-12 m-auto mb-5"
                />
                <p>Easy Exchange Policy</p>
                <p className="text-gray-400">
                    We offer hassle-free returns and exchanges.
                </p>
            </div>
            <div>
                <img
                    src={assets.quality_icon}
                    alt="Quality Icon"
                    className="w-12 m-auto mb-5"
                />
                <p>Days Return Policy</p>
                <p className="text-gray-400">
                    We provide 7 days free return policy
                </p>
            </div>
            <div>
                <img
                    src={assets.support_img}
                    alt="Support Icon"
                    className="w-12 m-auto mb-5"
                />
                <p>Best customers support</p>
                <p className="text-gray-400">
                    We provide 24/7 customer support for all your needs.
                </p>
            </div>
        </div>
    );
};

export default OurPolicy;
