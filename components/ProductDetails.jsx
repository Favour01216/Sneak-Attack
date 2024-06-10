import React, { useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { client, urlFor } from "../lib/client";
import { Product } from "../components";
import { useStateContext } from "../context/StateContext";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, sizes } = product;
  const [index, setIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes ? sizes[0] : null);
  const [sizeQuantities, setSizeQuantities] = useState(
    sizes ? sizes.reduce((acc, size) => ({ ...acc, [size]: 1 }), {}) : {}
  );

  const { onAdd, setShowCart } = useStateContext();

  const incQty = (size) => {
    setSizeQuantities((prevQuantities) => ({
      ...prevQuantities,
      [size]: prevQuantities[size] + 1,
    }));
  };

  const decQty = (size) => {
    setSizeQuantities((prevQuantities) => ({
      ...prevQuantities,
      [size]: Math.max(prevQuantities[size] - 1, 1),
    }));
  };

  const handleAddToCart = () => {
    onAdd(product, selectedSize, sizeQuantities[selectedSize]);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setShowCart(true);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
              alt={name}
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
                alt={`${name} image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="size-picker">
            <h3>Size:</h3>
            {sizes.map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "selected" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={() => decQty(selectedSize)}>
                <AiOutlineMinus />
              </span>
              <span className="num">{sizeQuantities[selectedSize]}</span>
              <span className="plus" onClick={() => incQty(selectedSize)}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products, product },
  };
};

export default ProductDetails;
