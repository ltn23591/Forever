import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
const LastedCollection = () => {
    const { products } = useContext(ShopContext);
    const [lastedProducts, setlastedProducts] = useState([]);

    useEffect(() => {
        setlastedProducts(products.slice(0, 10)); // Lấy 10 sản phẩm đầu tiên từ danh sách sản phẩm
    }, [products]);
    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1={'LASTED'} text2={'COLLECTION'} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Explore our latest collection of products!
                </p>
            </div>

            {/* Render Product */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {lastedProducts.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    );
};

export default LastedCollection;
