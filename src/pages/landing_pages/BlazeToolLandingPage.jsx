import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Zap,
  Clock,
  Target,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import FloatingOrbs from "../../reusable_components/design_components/FloatingOrbs";
import LiftingCircles from "../../reusable_components/design_components/LiftingCircles";
import Footer from "../../reusable_components/Footer";

const BlazeToolLandingPage = () => {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
  return (
    <>
      {/* <NavBarMain index={2}/> */}
      <div className="min-h-screen bg-[#18181B] text-white">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <FloatingOrbs />
          <LiftingCircles />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="mb-8"
                variants={floatingAnimation}
                initial="initial"
                animate="animate"
              >
                <Sparkles className="w-16 h-16 mx-auto text-[#2ed4d4]" />{" "}
                {/* You can replace Sparkles with any icon */}
              </motion.div>

              <h1 className="text-6xl md:text-9xl font-bold mb-6 pb-4 bg-gradient-to-r from-[#36fff5] from-40% via-[#20e3ff] via-50% to-[#00d5ff] to-60% text-transparent bg-clip-text font-unica">
                Blaze
                {/* : AI-Powered Marketing Suite */}
              </h1>
              <p className="text-xl md:text-xl text-gray-300 font-englebert tracking-wider mb-8 mt-20 max-w-3xl mx-auto">
                Transform your marketing strategy with our suite of AI tools.
                Create content, generate leads, and boost engagement - all in
                one place.
              </p>
              <motion.div
                className="flex justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/blaze/tools">
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="bg-[#23B5B5]/30 hover:bg-[#1a8a8a]/20 text-[#31ffff] transition-all duration-300 font-bungee font-bold py-3 px-8 rounded-lg flex items-center gap-2"
                  >
                    Give it a try <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <button className="font-bungee border border-[#23B5B5] hover:bg-[#23B5B5]/10 hover:border-[#23B5B5] transition-all duration-300 text-[#23B5B5] font-bold py-3 px-8 rounded-lg">
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-700/15 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl font-bold mb-4 font-unica">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-[#36fff5] to-[#00d5ff] text-transparent bg-clip-text">
                  Blaze
                </span>
                ?
              </h2>
              <p className="text-gray-400 font-mono">
                Powerful AI tools designed for modern marketers
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Brain,
                  title: "AI-Powered",
                  desc: "Advanced algorithms that learn and adapt to your needs",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Generate content and insights in seconds, not hours",
                },
                {
                  icon: Clock,
                  title: "Time-Saving",
                  desc: "Automate repetitive tasks and focus on strategy",
                },
                {
                  icon: Target,
                  title: "Results-Driven",
                  desc: "Optimize your content for maximum engagement",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-700/35 p-6 rounded-xl cursor-pointer hover:border-[#23B5B5]/75 border-2 border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-[#23B5B5]/10"
                  variants={fadeInUp}
                >
                  <feature.icon className="w-12 h-12 text-[#23B5B5] mb-4" />
                  <h3 className="text-xl font-semibold mb-4 font-poppins">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Tools */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl font-bold mb-4 font-unica">
                Our{" "}
                <span className="bg-gradient-to-br from-[#36fff5] to-[#00d5ff] gradien text-transparent bg-clip-text">
                  AI
                </span>{" "}
                Tools
              </h2>
              <p className="text-gray-400 font-mono">
                Everything you need to supercharge your marketing
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Long Form Assistant",
                  desc: "Generate comprehensive, engaging long-form content with AI assistance",
                },
                {
                  title: "Video Description Generator",
                  desc: "Create SEO-optimized YouTube video descriptions that drive views",
                },
                {
                  title: "Marketing Angles",
                  desc: "Discover unique marketing angles for your campaigns",
                },
                {
                  title: "Email Campaign Builder",
                  desc: "Create compelling email campaigns with AI-powered suggestions",
                },
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-700/30 rounded-xl p-6 cursor-pointer hover:border-[#23B5B5]/50 border-2 border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-[#23B5B5]/10"
                  variants={fadeInUp}
                >
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="font-poppins text-xl font-semibold">
                      {tool.title}
                    </h3>
                    <span className="bg-green-500 text-white font-bold py-1 px-3 rounded-full text-xs">
                      Live
                    </span>
                  </div>
                  <p className="text-gray-400 font-mono text-sm">{tool.desc}</p>
                </motion.div>
              ))}

              {/* "More Tools" Card */}
              <motion.div
                className="cursor-pointer bg-gradient-to-br from-gray-700/50 to-gray-700/10 rounded-xl p-6 hover:border-[#23B5B5]/50 border-2 border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-[#23B5B5]/10 flex flex-col items-center justify-center text-center"
                variants={fadeInUp}
              >
                <Sparkles className="w-12 h-12 text-[#23B5B5] mb-4" />
                <h3 className="text-xl font-semibold mb-2">And Many More...</h3>
                {/* <p className="text-gray-400 mb-4">Discover our full suite of AI-powered marketing tools</p>
                                <Link to="/login">
                                    <button className="bg-[#23B5B5] hover:bg-[#1a8a8a] transition-all duration-300 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                                        Explore All <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link> */}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="py-20 bg-gradient-to-r from-blue-700/25 via-cyan-600/40 to-purple-700/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-5xl font-bold mb-6 font-englebert capitalize">
                Ready to Transform Your Marketing?
              </h2>
              <p className="text-lg mb-8 font-maven">
                Join thousands of marketers using Blaze to create better content
                faster.
              </p>
              <Link to="/blaze/tools">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="bg-cyan-500/40 text-[#ffffff] font-bungee hover:bg-cyan-500/20 transition-all duration-200 font-bold py-4 px-8 rounded-xl shadow-xl"
                >
                  Get Started
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default BlazeToolLandingPage;
