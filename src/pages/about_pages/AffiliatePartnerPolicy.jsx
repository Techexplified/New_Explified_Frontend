import React, { useState } from "react";
import {
  BarChart2,
  DollarSign,
  UserCheck,
  Settings,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { Card, CardBody, Accordion, AccordionItem } from "@heroui/react";
import NavBar from "../../reusable_components/NavBar";
import Footer from "../../reusable_components/Footer";

const AffiliatePartnerPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const policyDetails = [
    {
      icon: <UserCheck className="text-[#23b5b5] w-12 h-12" />,
      title: "Eligibility",
      content:
        "Partners and affiliates must be approved by Explified to join the program. You can promote our products, services, or both after successful application and review.",
    },
    {
      icon: <DollarSign className="text-[#23b5b5] w-12 h-12" />,
      title: "Commission Structure",
      content:
        "Earn competitive commissions through our structured program. Service project affiliates receive 20% commission on the first project. Recurring commissions are contract-specific and transparently outlined.",
    },
    {
      icon: <BookOpen className="text-[#23b5b5] w-12 h-12" />,
      title: "Payment Terms",
      content:
        "Commissions are processed after project completion or six months into a recurring contract. All payments are meticulously tracked and managed through our comprehensive affiliate dashboard.",
    },
  ];

  const handleToggleSection = (sectionTitle) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen text-white p-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Explified <span className="text-[#23b5b5]">Affliate</span> and{" "}
            <span className="text-[#23b5b5]"> Partner </span> Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {/* Partner with us and transform your network into a powerful revenue stream.
                        Earn competitive commissions while promoting innovative language learning solutions. */}
            Partner and Affliate Program Terms & Conditions
          </p>
          {/* <Button
                        color="primary"
                        className="mt-8 bg-[#23b5b5] hover:bg-[#318f8f]"
                    >
                        Apply Now
                    </Button> */}
        </div>

        {/* Policy Sections */}
        <div className="grid md:grid-cols-3 gap-8">
          {policyDetails.map((section, index) => (
            <Card
              key={index}
              className="bg-zinc-800 border border-gray-700 hover:border-[#23b5b5] transition-all duration-300"
              isPressable
              onPress={() => handleToggleSection(section.title)}
            >
              <CardBody className="flex flex-col items-center text-center p-6">
                {section.icon}
                <h2 className="text-2xl font-semibold mt-4 mb-2 text-[#23b5b5]">
                  {section.title}
                </h2>
                <p className="text-gray-300">
                  {expandedSection === section.title
                    ? section.content
                    : section.content.slice(0, 100) + "..."}
                </p>
                <div className="mt-4">
                  {expandedSection === section.title ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Detailed Terms Accordion */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Comprehensive{" "}
            <span className="text-[#23b5b5]">Program Details</span>
          </h2>
          <Accordion variant="splitted" className="max-w-4xl mx-auto">
            <AccordionItem
              key="1"
              aria-label="Tracking & Reporting"
              title="Tracking & Reporting"
              startContent={<BarChart2 className="text-[#23b5b5]" />}
            >
              Affiliates are provided with a unique link to track their
              referrals and commissions. The affiliate portal allows access to
              analytics.
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Responsibilities"
              title="Responsibilities"
              startContent={<UserCheck className="text-[#23b5b5]" />}
            >
              Partners and affiliates must promote Explified’s services
              ethically, ensuring brand alignment.
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Program Modifications"
              title="Program Modifications"
              startContent={<Settings className="text-[#23b5b5]" />}
            >
              Explified reserves the right to modify, suspend, or terminate the
              program. Any changes will be communicated.
            </AccordionItem>
            <AccordionItem
              key="4"
              aria-label="Privacy Compliance"
              title="Privacy Compliance"
              startContent={<Lock className="text-[#23b5b5]" />}
            >
              All affiliates must comply with applicable data privacy laws.
            </AccordionItem>
            <AccordionItem
              key="5"
              aria-label="Termination"
              title=" Termination"
              startContent={<ShieldCheck className="text-[#23b5b5]" />}
            >
              Affiliates violating the terms may have their accounts suspended
              or terminated.
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AffiliatePartnerPolicy;
