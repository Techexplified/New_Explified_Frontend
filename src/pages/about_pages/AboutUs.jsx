import React from "react";
import { KushalImgWithBg } from "../../assets/index";
import NavBar from "../../reusable_components/NavBar";
import Footer from "../../reusable_components/Footer";

const AboutUs = () => {
  return (
    <div>
      <NavBar />
      <div className="h-screen w-full bg-zinc-900 flex justify-center items-center text-8xl font-extrabold">
        About Us
      </div>
      <div className="flex flex-col justify-center items-center gap-10 p-20">
        <div className="text-4xl font-extrabold text-center">
          Meet Explified
        </div>
        <div className="text-center font-light text-xl">
          Explified is a forward-thinking digital marketing company founded by
          Kushal, dedicated to revolutionizing the way businesses connect with
          their audience online. With a strong emphasis on innovation and
          results-driven strategies, Explified offers a wide range of services,
          including social media marketing, search engine optimization (SEO),
          content creation, and performance analytics. By combining creative
          expertise with cutting-edge technology, Explified helps businesses of
          all sizes build a strong digital presence, engage their target
          audience effectively, and achieve sustainable growth. Under the
          visionary leadership of Kushal, Explified continues to redefine
          success in the ever-evolving digital marketing landscape.
        </div>
      </div>
      <div className="flex flex-row justify-center items-center p-20 gap-5 h-[40rem] w-full">
        <div className="h-full w-[50%] flex">
          <img
            src={KushalImgWithBg}
            className="w-[80%] h-full bg-zinc-900  rounded-3xl object-cover object-bottom border-4"
          />
        </div>
        <div className="w-full flex flex-col gap-5">
          <div className="text-center font-bold text-2xl text-[#23b5b5]">
            Founder
          </div>
          <div className="text-center font-semibold text-3xl">Kushal</div>
          <div className="text-center font-light text-xl">
            Kushal is a creative entrepreneur and experienced product manager
            with a passion for innovation and delivering exceptional results for
            clients. A graduate of BITS Pilani, he brings over nine years of
            expertise across technology, product management, and media
            production. Having worked internationally and collaborated with
            diverse teams, Kushal blends a global perspective with a creative
            mindset. His journey as a musician and media creator has fueled his
            dedication to storytelling and design excellence, helping brands
            achieve impactful growth and memorable engagement.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
