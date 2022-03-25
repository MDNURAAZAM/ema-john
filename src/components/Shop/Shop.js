import React, { useEffect, useState } from 'react';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    useEffect(() => { 
        fetch('products.json')
            .then(res => res.json())
        .then(data => setProducts(data))
    }, []);
    
    const addToCart = (selectedProduct) => { 
        const exists = cart.find(cartProduct => cartProduct.id === selectedProduct.id);
        let newCart = [];
        if (!exists) {
            selectedProduct.quantity = 1;
            newCart = [...cart, selectedProduct];
        } else { 
            const rest = cart.filter(cartProduct => cartProduct.id !== selectedProduct.id);
            selectedProduct.quantity +=  1;
            newCart = [...rest, selectedProduct]
        }
        setCart(newCart);
        addToDb(selectedProduct.id);
    }

    useEffect(() => {
        const storedCart = getStoredCart();
        const savedCart = [];
        for (const id in storedCart) {
            const addedProduct = products.find(product => product.id === id);
            if (addedProduct) { 
                addedProduct.quantity = storedCart[id];
                savedCart.push(addedProduct);
            }
        }
        setCart(savedCart);
    },[products]);


    return (
        <div className='shop-container'>
            <div className="product-container">
                {
                    products.map(product => <Product
                        key={product.id}
                        product={product}
                        addToCart={ addToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
}; 

export default Shop;