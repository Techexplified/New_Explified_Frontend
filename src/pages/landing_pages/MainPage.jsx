import React from "react";
import Footer from "../../reusable_components/Footer";
import NavBar from "../../reusable_components/NavBar";
import HeroSection from "../../sections/landing_page_sections/HeroSection";
import InfiniteScrollingLogo from "../../sections/landing_page_sections/InfiniteScrollingLogo";
import OurServices from "../../sections/landing_page_sections/OurServices";
import WhyChooseUsSection from "../../sections/landing_page_sections/WhyChooseUsSection";
import IncreasingViews from "../../sections/landing_page_sections/IncreasingViews";
import FullScreenVideoDisplaySection from "../../sections/landing_page_sections/FullScreenVideoDisplaySection";
import ShortFormVideo from "../../sections/landing_page_sections/ShortFormVideo";
import Favourites from "../../sections/landing_page_sections/Favourites";
import LandingPageAboutUs from "../../sections/landing_page_sections/LandingPageAboutUs";
import FAQ from "../../sections/landing_page_sections/FAQ";

const MainPage = () => {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <InfiniteScrollingLogo />
      <OurServices />
      <WhyChooseUsSection />
      <IncreasingViews />
      <FullScreenVideoDisplaySection />
      <ShortFormVideo />
      <Favourites />
      <LandingPageAboutUs />
      <FAQ />
      <Footer />
    </div>
  );
};

export default MainPage;
