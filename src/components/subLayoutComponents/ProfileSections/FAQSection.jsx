import React, { useState } from "react";
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQSection = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const faqs = [
    {
      id: "1",
      category: "Account",
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on your profile settings, go to Security, and select 'Reset Password'. You'll receive an email with instructions to create a new password. Make sure to check your spam folder if you don't see the email.",
      tags: ["password", "security", "account"],
    },
    {
      id: "2",
      category: "Account",
      question: "How can I change my email address?",
      answer:
        "Navigate to Account Settings > Email Address. Enter your new email and verify it by clicking the link sent to your new email address. Your old email will continue to work for 30 days during the transition period.",
      tags: ["email", "account", "settings"],
    },
    {
      id: "3",
      category: "Account",
      question: "Can I have multiple accounts?",
      answer:
        "Each user is allowed one primary account. However, you can create team accounts if you have an enterprise plan. Contact our support team for more details about team management.",
      tags: ["account", "teams", "enterprise"],
    },
    {
      id: "4",
      category: "Workflows",
      question: "What is a workflow and how do I create one?",
      answer:
        "A workflow is a series of automated actions that help you complete tasks efficiently. To create one, go to Workflows > Create New. Choose a template or start from scratch, configure your triggers and actions, then save and activate it.",
      tags: ["workflows", "automation", "getting-started"],
    },
    {
      id: "5",
      category: "Workflows",
      question: "Can I share workflows with my team?",
      answer:
        "Yes! In your workflow settings, click 'Share' and select team members. You can grant them view-only or edit permissions. Shared workflows appear in their workflow library automatically.",
      tags: ["workflows", "sharing", "teams"],
    },
    {
      id: "6",
      category: "Workflows",
      question: "How do I debug a failing workflow?",
      answer:
        "Check the workflow logs by clicking 'View Logs' in your workflow details. You'll see each step's execution status and any error messages. Enable 'Debug Mode' for more detailed logging information.",
      tags: ["workflows", "debugging", "troubleshooting"],
    },
    {
      id: "7",
      category: "Integrations",
      question: "Which apps and services can I integrate?",
      answer:
        "We support 500+ integrations including Slack, GitHub, Zapier, Google Workspace, Microsoft 365, and many more. Check our Integrations page to see the full list and connect your favorite tools.",
      tags: ["integrations", "apps", "tools"],
    },
    {
      id: "8",
      category: "Integrations",
      question: "How do I connect a new integration?",
      answer:
        "Go to Settings > Integrations, search for the app you want to connect, and click 'Connect'. You'll be guided through the authentication process. Once connected, you can use it in your workflows.",
      tags: ["integrations", "setup", "getting-started"],
    },
    {
      id: "9",
      category: "Integrations",
      question: "Is my data safe when using integrations?",
      answer:
        "Yes, we use OAuth 2.0 for secure authentication and encrypt all credentials. We never store your passwords and comply with major security standards including SOC 2 Type II and GDPR.",
      tags: ["integrations", "security", "privacy"],
    },
    {
      id: "10",
      category: "Social",
      question: "Why should I connect my social accounts?",
      answer:
        "Connecting social accounts allows you to easily share your profile, schedule posts across platforms, and integrate social data into your workflows. It streamlines your social media management.",
      tags: ["social", "sharing", "profiles"],
    },
    {
      id: "11",
      category: "Social",
      question: "Can I disconnect my social accounts anytime?",
      answer:
        "Absolutely! Go to Settings > Social Accounts and click 'Disconnect' next to any account. Your data will be removed immediately, and any workflows using that integration will be paused.",
      tags: ["social", "privacy", "account"],
    },
    {
      id: "12",
      category: "Billing",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts. All payments are processed securely through Stripe.",
      tags: ["billing", "payment", "enterprise"],
    },
    {
      id: "13",
      category: "Billing",
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel anytime from your Billing Settings. Your access will continue until the end of your current billing period. No questions asked refunds are available within 30 days of purchase.",
      tags: ["billing", "subscription", "cancellation"],
    },
    {
      id: "14",
      category: "Billing",
      question: "Do you offer discounts for annual plans?",
      answer:
        "Yes! Annual plans come with a 20% discount compared to monthly billing. Enterprise customers can receive custom pricing. Contact our sales team for details.",
      tags: ["billing", "pricing", "discounts"],
    },
  ];

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory = !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-400">Find answers to common questions about your account and services</p>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0d1418] border border-[#23b5b5]/40 rounded-lg text-white focus:outline-none focus:border-[#23b5b5] transition-colors duration-200 placeholder:text-gray-600"
          />
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mb-8"
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === null
                ? "bg-[#23b5b5] text-white"
                : "bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-gray-300 hover:text-[#23b5b5]"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            All
          </motion.button>

          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-[#23b5b5] text-white"
                  : "bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-gray-300 hover:text-[#23b5b5]"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-3 mb-8"
      >
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-lg overflow-hidden hover:border-[#23b5b5]/40 transition-all duration-200"
            >
              <motion.button
                onClick={() =>
                  setExpandedId(expandedId === faq.id ? null : faq.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#23b5b5]/5 transition-colors duration-200"
                whileHover={{ backgroundColor: "rgba(35, 181, 181, 0.05)" }}
              >
                <div className="flex items-center gap-3 text-left flex-1">
                  <HelpCircle className="w-5 h-5 text-[#23b5b5] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{faq.question}</p>
                    <p className="text-xs text-gray-500 mt-1">{faq.category}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </motion.button>

              {/* Expanded Answer */}
              <AnimatePresence>
                {expandedId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#23b5b5]/20 bg-[#23b5b5]/5 px-6 py-4"
                  >
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {faq.answer}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {faq.tags.map((tag) => (
                        <motion.span
                          key={tag}
                          className="px-3 py-1 bg-[#23b5b5]/15 border border-[#23b5b5]/30 text-[#23b5b5] text-xs rounded-full"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-lg p-8 text-center"
          >
            <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
            <p className="text-gray-400">No FAQs found matching your search.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Still Need Help? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-[#23b5b5]/30 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#23b5b5]" />
          Still have questions?
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Can't find what you're looking for? Our support team is here to help!
        </p>
        <div className="flex flex-wrap gap-3">
          <motion.a
            href="mailto:support@explified.com"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#23b5b5] text-white rounded-lg hover:bg-[#23b5b5]/80 transition-all duration-200 font-medium text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail className="w-4 h-4" />
            Email Support
          </motion.a>
          <motion.button
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-[#23b5b5] rounded-lg hover:bg-[#23b5b5]/25 transition-all duration-200 font-medium text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4" />
            Live Chat
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FAQSection;
