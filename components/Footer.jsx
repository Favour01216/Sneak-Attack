import React from "react";
import { IoLogoTiktok } from "react-icons/io5";
import { AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer-container">
      <p>&copy; 2024 Sneak Attack All rights reserved</p>
      <p className="icons">
        <AiFillInstagram />
        <AiOutlineTwitter />
        <IoLogoTiktok />
      </p>
    </div>
  );
};

export default Footer;
