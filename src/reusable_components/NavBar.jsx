import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as images from "../assets/index";
import { MenuIcon, X } from "lucide-react";

const NavBar = ({ index = 0 }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logout successful");
    navigate("/login");
  };

  // Handle resizing logic
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set isMobile to true for screens <= 768px
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logo = [
    { logo: images.ExplifiedLogo, name: "Explified" },
    { logo: images.BridgeLogo, name: "Bridge" },
    { logo: images.BlazeLogo, name: "Blaze" },
    { logo: images.MotionLogo, name: "Motion" },
  ];

  const navItems = [
    { path: "/solutions", label: "Solutions" },
    { path: "/work", label: "Work" },
    { path: "/about-us", label: "About Us" },
    { path: "/contact-us", label: "Contact us" },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <div key={item.path}>
          <Link to={item.path}>
            <p className="hover:text-[#23b5b5] transition-colors duration-200">
              {item.label}
            </p>
          </Link>
        </div>
      ))}
    </>
  );

  return (
    <div className="w-full bg-black/20 backdrop-blur-lg flex flex-row justify-between items-center px-10 py-4 fixed z-30">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center gap-3">
          <img src={logo[index]["logo"]} className="h-10" alt="Logo" />
          <h1 className="text-2xl font-semibold text-white">
            {logo[index]["name"]}
          </h1>
        </div>
      </Link>

      {isMobile ? (
        <>
          <MenuIcon
            className="text-white cursor-pointer"
            size={32}
            onClick={() => setIsMenuOpen(true)}
          />

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 right-0 h-screen w-64 bg-black text-white transform ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Menu</h2>
              <X
                className="cursor-pointer"
                size={28}
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
            <div className="flex flex-col items-center gap-6 mt-6">
              <NavLinks isMobile />
            </div>
          </div>

          {/* Overlay for closing menu when clicking outside */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMenuOpen(false)}
            ></div>
          )}
        </>
      ) : (
        // w-[35%] put this in div className if the schedule a call is added again

        <div className="flex flex-row items-end gap-14">
          <NavLinks />
        </div>
      )}
    </div>
  );
};

export default NavBar;
