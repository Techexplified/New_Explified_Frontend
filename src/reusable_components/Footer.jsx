import React from "react";
import { Link } from "react-router-dom";
import * as images from "../assets/index";
import { MdOutlineTravelExplore } from "react-icons/md";

const Footer = () => {
  return (
    <div className="border-gray-500 bg-black pt-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-5 py-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center sm:items-start">
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="/"
            className="flex flex-row"
          >
            <div className="flex flex-row items-center gap-3">
              <img
                src={images.ExplifiedLogo}
                className="h-16"
                alt="Explified Logo"
              />
              <h1 className="text-2xl md:text-4xl font-semibold text-white">
                Explified
              </h1>
            </div>
          </Link>
        </div>

        {/* Products Section */}
        <div>
          <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <img
              className="h-8 w-8 invert"
              src={images.ProductIcon}
              alt="Products Icon"
            />
            <div>PRODUCTS</div>
          </div>
          <ul className="mt-5 space-y-2">
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                to="/blaze"
              >
                Blaze
              </Link>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                to="/bridge"
              >
                Bridge
              </Link>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                to="/motion"
              >
                Motion
              </Link>
            </li>
          </ul>
        </div>

        {/* Services Section */}
        <div>
          <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <img
              className="h-8 w-8 invert"
              src={images.ServiceIcon}
              alt="Services Icon"
            />
            <div>SOLUTIONS</div>
          </div>
          <ul className="mt-5 space-y-2">
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link to="/content-marketing-service">Content Marketing</Link>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link to="/video-editing-service">Video Editing</Link>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link to="/market-research-analysis-service">
                Market Research & Analysis
              </Link>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link to="/seo-and-smo-service">
                SEO & Social Media Optimization
              </Link>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link to="/solutions">Custom Solutions</Link>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <Link to="/youtube-management-service">
                YouTube Channel Management
              </Link>
            </li>
          </ul>
        </div>

        {/* Blogs section  */}
        <div>
          <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <MdOutlineTravelExplore className="h-8 w-8" />
            <div>More</div>
          </div>

          <ul className="mt-5 space-y-2">
            <li className="hover:text-teal-500 cursor-pointer">
              <Link to="/blog">Blogs</Link>
            </li>
          </ul>
        </div>

        {/* Apps Section
        <div>
          <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <img className="h-8 w-8" src={images.playstores} alt="Apps Icon" />
            <div>Apps</div>
          </div>
          <ul className="mt-5 space-y-2">
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <a
                href="https://play.google.com/store/apps/details?id=com.explified.vocabulary_app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vocabulary App
              </a>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <a
                href="https://play.google.com/store/apps/details?id=com.explified.grammar_app"
                target="_blank"
                rel="noopener noreferrer"
              >
                English Grammar App
              </a>
            </li>
            <li className="hover:text-[#23b5b5] cursor-pointer">
              <a
                href="https://play.google.com/store/apps/details?id=com.explified.VocabularyApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                IELTS Vocabulary App
              </a>
            </li>
          </ul>
        </div> */}
      </div>

      {/* Policies and Disclaimer Section */}
      <div className="flex flex-wrap justify-center gap-5 mt-10 px-5">
        <div className="hover:text-[#23b5b5] cursor-pointer text-gray-400">
          Disclaimer
        </div>
        <div className="hover:text-[#23b5b5] cursor-pointer text-gray-400">
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
        <div className="hover:text-[#23b5b5] cursor-pointer text-gray-400">
          <Link to="/affliate-policy">Affiliate Terms</Link>
        </div>
        <div className="hover:text-[#23b5b5] cursor-pointer text-gray-400">
          <Link to="/">Client Terms</Link>
        </div>
        {/* <div className="hover:text-[#23b5b5] cursor-pointer text-gray-400">
          <Link to="/">Client Policy</Link>
        </div> */}
        <div className="hover:text-[#23b5b5] cursor-pointer text-gray-400">
          <Link to="/">Refund Policy</Link>
        </div>
        <div className="hover:text-[#23b5b5] cursor-pointer text-gray-400">
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-gray-400 flex justify-center mt-5 italic px-5 text-center">
        {/* © <span className="text-[#23b5b5] mx-2">2024 Explified™</span> All Rights Reserved. */}
      </div>
    </div>
  );
};

export default Footer;
