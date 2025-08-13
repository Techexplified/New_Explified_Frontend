import { Accordion, AccordionItem } from "@heroui/react";
import React from "react";

const FAQ = () => {
  return (
    <div className="px-7 lg:px-20 xl:px-20 my-24">
      <div className="text-[2rem] lg:text-5xl xl:text-5xl font-bold mb-10 capitalize">
        frequently asked questions{" "}
        <span className="text-[#23b5b5]">( FAQ )</span>
      </div>
      <Accordion>
        <AccordionItem
          key="1"
          aria-label="Accordion 1"
          title="How Explified Different?"
          className="font-semibold"
        >
          <span className="font-light">
            1. Dedicated team: Explified literally gives your marketing and
            creative teams superpowers. You can rapidly bring any idea to life
            and make it work for your business.
            <br />
            2. Fully managed: Skip the hassle of managing video production on
            your own and plan, shoot, edit, and produce your content through
            Explified.
            <br />
            3. Results-first: We’ve battle-tested what works and what doesn’t
            work over hundreds of different campaigns and for a variety of
            different businesses and industries.
          </span>
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Accordion 2"
          title="What is your video production like?"
          className="font-semibold"
        >
          <span className="font-light">
            We’ve streamlined the entire production process to ensure quality is
            high: Creative briefing and onboarding: We provide you with a
            creative brief to collect your product value propositions and your
            existing brand guidelines and logo files. Pre-production: We develop
            a concept and a script, then locate the best talent available.
            Production: for animation, we’ll then illustrate the entire
            storyboard before heading into motion. Post-production:an editor or
            motion graphics expert handles all the editing from start to finish.
            Delivery: once the editing is completed, all the media files will be
            made available for download following your final sign-off.
          </span>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Accordion 3"
          title="What types of video content you produce?"
          className="font-semibold"
        >
          <span className="font-light">
            It’s typical for video production agencies to only produce
            live-action or animation — at Explified, we have expert teams that
            work together to provide both. Our team has more than 2+ years of
            experience in live-action and animated video.
          </span>
        </AccordionItem>
        <AccordionItem
          key="4"
          aria-label="Accordion 4"
          title="What type of video is right for our business?"
          className="font-semibold"
        >
          <span className="font-light">
            This typically depends on one of three goals: customer acquisition,
            engagement or retention. We also consider audience and distribution
            channels (TV, Facebook, Youtube, TikTok).
          </span>
        </AccordionItem>
        <AccordionItem
          key="5"
          aria-label="Accordion 5"
          title="What makes a good video marketing strategy?"
          className="font-semibold"
        >
          <span className="font-light">
            ----------------------------------------------
          </span>
        </AccordionItem>
        <AccordionItem
          key="6"
          aria-label="Accordion 6"
          title="Does Explified focus on Corporate Video Production?"
          className="font-semibold"
        >
          <span className="font-light">
            We specialise in corporate video production and produce video
            content for both enterprise and challenger brands.
          </span>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;
