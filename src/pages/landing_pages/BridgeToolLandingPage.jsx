import React from "react";
import { ArrowRight, MessageSquare, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LiftingCircles from "../../reusable_components/design_components/LiftingCircles";
import Footer from "../../reusable_components/Footer";

const BridgeToolLandingPage = () => {
  const workFlow = [
    {
      step: "01",
      title: "Define Your Needs",
      desc: "Share your objectives and outline the type of assistance required.",
    },
    {
      step: "02",
      title: "Let AI Enhance",
      desc: "Our intelligent system refines and personalizes your content to perfection.",
    },
    {
      step: "03",
      title: "Deliver & Monitor",
      desc: "Use the enhanced communication and track its impact effortlessly.",
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Engage Smarter",
      desc: "Experience meaningful and intelligent conversations with cutting-edge AI.",
    },
    {
      icon: Brain,
      title: "Learn as You Go",
      desc: "AI that evolves and adapts, learning from every interaction to serve you better.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      desc: "Quick, precise, and responsive – answers in the blink of an eye.",
    },
  ];

  // Animation variants
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
      {/* <NavBarMain index={1}/> */}
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-800 text-white">
        {/* Hero */}
        <div className="relative overflow-hidden">
          {/* <FloatingOrbs /> */}
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
                <MessageSquare className="w-16 h-16 mx-auto text-[#23B5B5]" />
              </motion.div>

              <h1 className="text-6xl md:text-9xl font-teko font-bold mb-6 pb-4 bg-gradient-to-r from-blue-600 via-[#23B5B5] to-pink-400 from-30% via-50% to-60% text-transparent bg-clip-text">
                BRIDGE
              </h1>
              <p className="text-xl bg-gradient-to-r from-blue-600 via-[#23B5B5] to-pink-400 tracking-wider mb-10 max-w-3xl mx-auto font-pacifico text-transparent bg-clip-text">
                Your intelligent companion for seamless conversations and
                knowledge discovery
              </p>

              <motion.div
                className="flex justify-center gap-4 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/bridge/chats">
                  <button className="bg-gradient-to-r from-blue-600/90 via-[#23B5B5]/90 to-pink-400/90 hover:from-blue-600/75 hover:via-[#23B5B5]/75 hover:to-pink-400/75 transition-all duration-300 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 font-bungee">
                    Start Bridging <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <button className="border-2 border-pink-400 hover:bg-pink-400/10 transition-all duration-300 text-pink-400 font-bold py-4 px-8 rounded-xl font-bungee">
                  See Examples
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700 hover:border-[#23B5B5] transition-all duration-300 cursor-pointer"
                  variants={fadeInUp}
                >
                  <feature.icon className="w-12 h-12 text-[#23B5B5] mb-4" />
                  <h3 className="text-xl font-bold mb-3 font-poppins">
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

        {/* Workflow */}
        <div className="py-20 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-4 font-teko">
                How{" "}
                <span className="bg-gradient-to-r from-blue-200 via-[#69e4e4] to-pink-200 text-transparent bg-clip-text"></span>{" "}
                Bridge Works ?
              </h2>
              <p className="text-gray-400 font-mono">
                Simple steps to enhance your communication
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {workFlow.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative cursor-pointer"
                  variants={fadeInUp}
                >
                  <div className="bg-zinc-500/10 p-8 rounded-2xl border border-zinc-500/20 hover:border-[#23B5B5] transition-all duration-300">
                    <span className="text-5xl font-bold absolute -top-6 -left-2 bg-gradient-to-br from-blue-600/50 via-[#23B5B5]/50 to-pink-400/50 from-20% via-50% to-80% text-transparent bg-clip-text">
                      {step.step}
                    </span>
                    <h3 className="text-xl font-bold mb-3 mt-4 font-poppins">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
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
                Elevate Your Communication Experience
              </h2>
              <p className="text-lg mb-8 font-maven">
                Revolutionize how you connect with AI-driven insights and
                smarter strategies
              </p>
              <Link to="/bridge/chats">
                <button className="bg-cyan-500/40 text-white font-bungee hover:bg-cyan-500/20 transition-all duration-300 font-bold py-4 px-8 rounded-xl shadow-xl">
                  Get Started Now
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

export default BridgeToolLandingPage;
