import React from "react";
import Footer from "../../../reusable_components/Footer";
import GetInTouchForm from "../../../reusable_components/design_components/GetInTouchForm";
import { Accordion, AccordionItem, Button, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import {
  SiBuffer,
  SiCanva,
  SiGoogleanalytics,
  SiGoogledatastudio,
  SiGooglesearchconsole,
  SiHootsuite,
  SiSemrush,
  SiYoast,
} from "react-icons/si";
import NavBar from "../../../reusable_components/NavBar";
import {
  AnalyticsReportingImg,
  ContentCreationImg,
  ContentMarketingPageDiscoveryImg,
  ContentOptimizationImg,
  ContentStrategyImg,
  ConversionImg,
  DomainAuthorityImg,
  FreeTrafficImg,
  QualityTrafficImg,
  QuantityTrafficImg,
  SeoServiceImg1,
  SeoWorkImg,
  VisibilityImg,
} from "../../../assets";

const icons = [
  SiCanva,
  SiGooglesearchconsole,
  SiSemrush,
  SiYoast,
  SiGoogleanalytics,
  SiGoogledatastudio,
  SiHootsuite,
  SiBuffer,
];

const BenefitsContainer = ({ title, description, img }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer rounded-3xl bg-zinc-900 h-[27rem] w-80 m-5 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black hover:border-2  border-[#23b5b5]">
      <div className="flex h-56 w-56 m-6 items-center justify-center ">
        <img className="h-56 w-56 object-contain object-right" src={img} />
      </div>
      <div className="text-xl font-bold my-3 text-center mx-2">{title}</div>
      <Divider />
      <div className="text-sm my-3 text-left m-3">{description}</div>
    </div>
  );
};

const SEOServicePage = () => {
  return (
    <div>
      <NavBar />

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full h-screen px-6 lg:px-20 py-14">
        <div className="flex flex-col w-full p-5">
          <h1 className="w-full mb-4 capitalize text-[2rem] lg:text-[3.5rem] text-left font-bold tracking-tight leading-none">
            Dominate Search & Social with Expert Optimization Services
          </h1>
          <p className="w-full my-6 lg:my-10 font-light text-gray-400 text-left text-lg lg:text-xl">
            Integrated solutions for search engine rankings and social
            engagement to expand your digital footprint and build your audience.
          </p>
          <Button
            radius="sm"
            className="text-md lg:text-lg font-bold w-fit h-12 bg-[#23b5b5] text-zinc-900 px-8 lg:px-16"
          >
            <Link to="/contact-us">Get Started</Link>
          </Button>
        </div>
        <div className="flex justify-center items-center object-cover object-right w-full lg:w-[75%]">
          <img
            src={SeoServiceImg1}
            className="w-full h-auto"
            alt="Social Platform"
          ></img>
        </div>
      </div>

      {/* Tools Section */}
      <div className="relative w-full h-40 overflow-hidden bg-[#23b5b5] my-48 bg-opacity-65">
        <div
          className="absolute flex whitespace-nowrap"
          style={{
            animation: "scroll 60s linear infinite",
          }}
        >
          {/* Duplicate the icon list for smooth looping */}
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-14">
              {icons.map((Icon, index) => (
                <div
                  key={`${idx}-${index}`}
                  className="flex items-center justify-center w-40 h-40 text-5xl text-white"
                >
                  <Icon className="w-20 h-20" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <style>
          {`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-100%);
                }
              }
            `}
        </style>
      </div>

      {/* Benefit of SEO Services */}
      <div className="flex flex-col items-center mt-20">
        <div className="text-6xl font-extrabold mb-10">
          Benefits of
          <span className="text-[#23b5b5]"> SEO </span> Services
        </div>
        <div className="flex flex-row items-center">
          <BenefitsContainer
            title={"Quality Of Traffic"}
            description={
              "You can attract all the visitors in the world who are genuinely interested in the products that you offer."
            }
            img={QualityTrafficImg}
          />
          <BenefitsContainer
            title={"Free Traffic"}
            description={
              "Ads make up a large share of SERPs. Organic traffic is any traffic that you don’t have to pay for."
            }
            img={FreeTrafficImg}
          />
          <BenefitsContainer
            title={"Conversion"}
            description={
              "If you get top search engine rankings then you will get more conversions."
            }
            img={ConversionImg}
          />
        </div>
        <div className="flex flex-row items-center">
          <BenefitsContainer
            title={"Better Online Visibility"}
            description={
              "You get more brand exposure when you rank on top of the first-page search results."
            }
            img={VisibilityImg}
          />
          <BenefitsContainer
            title={"Quantity Of Traffic"}
            description={
              "Once you have the right people clicking through from those search engine results pages (SERPs), more traffic is better."
            }
            img={QuantityTrafficImg}
          />
          <BenefitsContainer
            title={"Higher Domain Authority"}
            description={
              "A proper SEO strategy helps you to increase your website’s domain authority and reputation."
            }
            img={DomainAuthorityImg}
          />
        </div>
      </div>

      {/* Process */}
      <div className="w-full h-fit flex flex-col justify-center items-center mt-20 mb-40 px-4">
        <div className="text-center text-4xl md:text-6xl lg:text-8xl my-10 font-bold">
          Our Process
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={ContentMarketingPageDiscoveryImg}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            1
          </div>
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Audit and Analysis</div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Strategy Development</div>
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            2
          </div>
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img src={ContentStrategyImg} className="w-full object-cover" />
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={ContentOptimizationImg}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            3
          </div>
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Optimization Implementation</div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Content Creation</div>
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            4
          </div>
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={ContentCreationImg}
              className="w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="flex flex-row justify-center items-center my-10">
          <div className="w-full lg:w-96 h-[50%] lg:h-60 flex rounded-3xl overflow-hidden border-3 duration-400 hover:scale-105">
            <img
              src={AnalyticsReportingImg}
              className="w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-row justify-center items-center w-16 h-[1.70rem] lg:w-8 lg:h-8 z-10 rounded-full bg-[#23b5b5] mx-5 lg:mx-20 text-white text-center font-bold text-sm lg:text-xl my-6 lg:my-0">
            5
          </div>
          <div className="w-full lg:w-96 h-fit rounded-3xl flex flex-col justify-center text-xl md:text-2xl lg:text-3xl">
            <div>Performance Tracking and Adjustments</div>
          </div>
        </div>

        {/* Line */}
        <div className="absolute lg:h-[180vh] h-[45%] md:h-[105%] mt-32 lg:mt-44 z-0 border-1 border-zinc-500" />
      </div>

      {/* Key to SEO Success */}
      <div className="flex flex-col m-16 p-8 rounded-[3rem] bg-neutral-950 hover:shadow-zinc-900 shadow-2xl duration-200">
        <div className="text-6xl font-extrabold w-full text-center mb-14 mt-8">
          How Do <span className="text-[#23b5b5]"> SEO </span> Service Work ?
        </div>
        <div className="flex flex-row items-center m-10 gap-14">
          <div className="w-full">
            <img
              src={SeoWorkImg}
              className="rounded-t-3xl border-x-2 border-t-2 border-gray-500"
            />
            <div className="text-3xl font-extralight text-center m-5">
              SEO Result
            </div>
            <div className="text-sm font-light italic text-center m-5">
              How Does SEO Rankings Appear in Search Results
            </div>
          </div>
          <div className="w-full text-2xl font-light">
            Search Engine Optimization (SEO) is the inbound marketing process of
            increasing the quantity and quality of traffic through organic
            search results.
            <br />
            <br />
            In other words, it is an approach that helps businesses improve
            their website’s performance in organic search results. The ultimate
            objective of SEO service is to make your website appear on the first
            page of search engine results by following the search engine
            algorithm.
          </div>
        </div>
      </div>

      {/* Section FaQ */}
      <div className="px-20 mt-24">
        <div className="text-5xl font-bold mb-10 capitalize">
          frequently asked questions{" "}
          <span className="text-[#23b5b5]">( FAQ )</span>
        </div>
        <Accordion>
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="What is included in your SEO and social media optimization services?"
            className="font-semibold"
          >
            <span className="font-normal">
              Our services include keyword research, on-page and off-page SEO,
              technical SEO audits, content optimization, social media strategy
              development, post scheduling, audience targeting, and analytics
              tracking to measure performance and drive results.
            </span>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="How long does it take to see results from SEO and social media optimization?"
            className="font-semibold"
          >
            <span className="font-normal">
              SEO typically requires 3-6 months to show significant
              improvements, depending on the competitiveness of your industry.
              Social media optimization results, such as engagement and reach,
              can often be observed within weeks, but consistent growth takes
              ongoing effort and strategic adjustments.
            </span>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="Will you create content for my website and social media platforms?"
            className="font-semibold"
          >
            <span className="font-normal">
              Yes, we offer content creation services as part of our packages.
              Our team can produce SEO-optimized website content, blog posts,
              and social media graphics, videos, and captions tailored to your
              brand voice and goals.
            </span>
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Accordion 4"
            title="How do you measure the success of your SEO and social media efforts?"
            className="font-semibold"
          >
            <span className="font-normal">
              We use tools like Google Analytics, Search Console, and social
              media insights to track metrics such as website traffic, keyword
              rankings, engagement rates, follower growth, and conversions.
              Regular reports keep you informed about progress and ROI.
            </span>
          </AccordionItem>
          <AccordionItem
            key="5"
            aria-label="Accordion 4"
            title="Can you optimize my existing content and accounts?"
            className="font-semibold"
          >
            <span className="font-normal">
              Absolutely! We can audit and optimize your current website
              content, blog posts, and social media profiles to align with the
              latest SEO and social media best practices, ensuring improved
              visibility and engagement.
            </span>
          </AccordionItem>
        </Accordion>
      </div>

      <GetInTouchForm />
      <Footer />
    </div>
  );
};

export default SEOServicePage;
