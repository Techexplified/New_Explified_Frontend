import React, { useState } from "react";
import {
  Building2,
  CreditCard,
  ChevronRight,
  ExternalLink,
  Check,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnterpriseSectionSimple() {
  const [expandedPlan, setExpandedPlan] = useState("plan-starter"); // Starter open by default

  const plans = [
    {
      id: "plan-starter",
      title: "Expli Starter",
      price: "$500",
      freq: "mo",
      bullets: [
        "Unlimited projects",
        "Priority support (24/7)",
        "Advanced analytics & reporting",
      ],
      cta: "Buy Subscription",
    },
    {
      id: "plan-pro",
      title: "Expli Pro",
      price: "$1000",
      freq: "mo",
      bullets: [
        "Everything in Starter",
        "Dedicated account manager",
        "Custom integrations & SLAs",
      ],
      cta: "Buy Subscription",
    },
  ];

  const togglePlan = (id) => {
    setExpandedPlan((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="col-span-12 lg:col-span-9">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Enterprise</h2>
            <p className="text-gray-400 mb-6 max-w-2xl">
              Scale your organization with enterprise-grade features — SSO, SCIM
              provisioning, dedicated support, and custom integrations.
            </p>
          </div>
        </div>

        {/* Plans list */}
        <div className="space-y-4 mt-4">
          {plans.map((plan) => {
            const expanded = expandedPlan === plan.id;
            return (
              <div
                key={plan.id}
                className="rounded-lg border border-[#2b3b3b] bg-gradient-to-br from-[#081214] to-[#071014] overflow-hidden"
              >
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-[#0f2b2a] flex items-center justify-center text-white">
                      <CreditCard />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {plan.title}
                      </div>
                      <div className="text-sm text-gray-400">bullet points</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right mr-2">
                      <div className="text-xl font-semibold text-white">
                        {plan.price}
                      </div>
                      <div className="text-xs text-gray-400">/{plan.freq}</div>
                    </div>

                    <button
                      onClick={() => togglePlan(plan.id)}
                      aria-expanded={expanded}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-[#2a3a3a] bg-transparent hover:bg-[#112c2b] transition transform"
                    >
                      <motion.span
                        animate={{ rotate: expanded ? 90 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </motion.span>
                    </button>
                  </div>
                </div>

                {/* accordion content */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-5 bg-gradient-to-b from-[#071717]/50 to-transparent"
                    >
                      <div className="pt-2 pb-3">
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                          {plan.bullets.map((b, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-[3px] text-teal-300">
                                <Check className="w-4 h-4" />
                              </span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 items-center">
                        <a
                          href="https://labs.explified.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="px-4 py-2 rounded-lg bg-[#23b5b5] text-black font-semibold">
                            {plan.cta}
                          </button>
                        </a>
                        <a
                          href="#"
                          className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-2"
                        >
                          Learn more <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Contact Sales primary CTA */}
        <div className="mt-6">
          <a
            href="https://labs.explified.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-5 py-3 rounded-lg border border-[#2b3b3b] text-white bg-transparent hover:bg-[#0e2b2a] transition">
              Contact Sales
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
