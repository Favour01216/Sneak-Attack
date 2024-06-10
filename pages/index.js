// pages/index.js
import React from "react";
import { client } from "../lib/client";
import { Product, FooterBanner, HeroBanner } from "../components";

const Home = ({ products, heroBanner, footerBanner }) => (
  <div>
    <HeroBanner heroBanner={heroBanner} />
    <div className="products-heading">
      <h2>Best Seller Products</h2>
      <p>sneaker There are many variations passages</p>
    </div>

    <div className="products-container">
      {products?.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>

    <FooterBanner footerBanner={footerBanner} />
  </div>
);

export const getServerSideProps = async () => {
  const productsQuery = '*[_type == "product"]';
  const products = await client.fetch(productsQuery);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  const heroBanner =
    bannerData.find((banner) => banner.position === "hero") || null;
  const footerBanner =
    bannerData.find((banner) => banner.position === "footer") || null;

  return {
    props: {
      products,
      heroBanner,
      footerBanner,
    },
  };
};

export default Home;
