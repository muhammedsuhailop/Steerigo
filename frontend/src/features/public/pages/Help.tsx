// @/features/public/pages/HelpPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdSearch,
  MdExpandMore,
  MdExpandLess,
  MdHelp,
  MdPhone,
  MdEmail,
  MdWarning,
  MdCheckCircle,
} from "react-icons/md";
import Card from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

interface ContactMethod {
  id: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQId, setExpandedFAQId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: "1",
      category: "Getting Started",
      question: "How do I create an account?",
      answer:
        "To create an account, navigate to SteeriGo.in, tap 'Sign Up', enter your email , verify your identity. You'll be ready to book rides in minutes!",
      icon: <MdCheckCircle className="text-blue-500 text-xl" />,
    },
    {
      id: "2",
      category: "Getting Started",
      question: "What information do I need to provide?",
      answer:
        "You'll need your name, email address, phone number. For security, we may ask for additional verification.",
      icon: <MdCheckCircle className="text-blue-500 text-xl" />,
    },
    {
      id: "3",
      category: "Booking & Rides",
      question: "How do I book a ride?",
      answer:
        "Open this app, enter your pickup location and destination, select your vehicle type, transmission type and confirm your booking. A nearby driver will accept your request within minutes.",
      icon: <MdCheckCircle className="text-blue-500 text-xl" />,
    },
    {
      id: "4",
      category: "Booking & Rides",
      question: "Can I schedule a ride in advance?",
      answer:
        "Yes! Use the 'Schedule' option when booking to reserve a ride for a future date and time. Pre-booking ensures availability and gives drivers adequate notice.",
      icon: <MdCheckCircle className="text-blue-500 text-xl" />,
    },
    {
      id: "5",
      category: "Booking & Rides",
      question: "What if I need to cancel my ride?",
      answer:
        "You can cancel free of charge if you cancel before the driver arrives. Cancellations after the driver has started toward you may incur a cancellation fee.",
      icon: <MdWarning className="text-orange-500 text-xl" />,
    },
    {
      id: "6",
      category: "Safety & Security",
      question: "How safe is SteeriGo?",
      answer:
        "We prioritize your safety through driver background checks, real-time GPS tracking, ride sharing features, and 24/7 customer support.",
      icon: <MdCheckCircle className="text-green-500 text-xl" />,
    },
    {
      id: "7",
      category: "Safety & Security",
      question: "Can I share my ride details with friends?",
      answer:
        "Absolutely! You can share your live location and ride details with trusted contacts using the 'Share' feature in the app.",
      icon: <MdCheckCircle className="text-green-500 text-xl" />,
    },
    {
      id: "8",
      category: "Payments",
      question: "What payment methods are accepted?",
      answer:
        "We accept credit cards, debit cards, digital wallets (Apple Pay, Google Pay), and in-app credits. You can also pay cash to driver in hand.",
      icon: <MdCheckCircle className="text-blue-500 text-xl" />,
    },
    {
      id: "9",
      category: "Payments",
      question: "How is the ride fare calculated?",
      answer:
        "Fares are based on distance, time, and demand. The estimated fare is shown before you book. Surge pricing may apply during peak hours.",
      icon: <MdCheckCircle className="text-blue-500 text-xl" />,
    },
    {
      id: "10",
      category: "Account & Profile",
      question: "How can I update my profile?",
      answer:
        "Go to Settings > Profile to update your name, email, phone number, profile picture.",
      icon: <MdCheckCircle className="text-blue-500 text-xl" />,
    },
    {
      id: "11",
      category: "Account & Profile",
      question: "Can I have multiple accounts?",
      answer: "Each phone number can only have one account. However",
      icon: <MdWarning className="text-orange-500 text-xl" />,
    },
    {
      id: "12",
      category: "Issues & Support",
      question: "What should I do if I forgot something in the car?",
      answer:
        "Contact your driver through the app immediately. If unsuccessful, reach out to our support team with your ride details, and we'll help locate your item.",
      icon: <MdWarning className="text-orange-500 text-xl" />,
    },
  ];

  const contactMethods: ContactMethod[] = [
    {
      id: "1",
      icon: <MdPhone className="text-3xl text-gray-600" />,
      title: "Call Support",
      value: "+91 9090901010",
      description: "Available 24/7 for urgent assistance",
    },
    {
      id: "2",
      icon: <MdEmail className="text-3xl text-gray-600" />,
      title: "Email Support",
      value: "support@steerigo.com",
      description: "Response within 24 hours",
    },
    {
      id: "3",
      icon: <MdHelp className="text-3xl text-gray-600" />,
      title: "Live Chat",
      value: "In-app Chat",
      description: "Available during business hours",
    },
  ];

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFAQItem = (id: string) => {
    setExpandedFAQId(expandedFAQId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 mb-6">
          <div className="flex items-center gap-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Go back"
            >
              <MdArrowBack className="text-2xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Help & Support
              </h1>
              <p className="text-sm text-gray-600">
                Find answers and get support
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8 shadow-sm">
          <div className="p-6">
            <div className="relative">
              <MdSearch className="absolute left-3 top-3.5 text-2xl text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
        </Card>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === null
                ? "bg-blue-500 text-white shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Topics
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-blue-500 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-12">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQItem(item.id)}
                  className="w-full p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors duration-150 text-left"
                >
                  <div className="pt-1 flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 leading-tight">
                      {item.question}
                    </h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-gray-400 pt-1 flex-shrink-0">
                    {expandedFAQId === item.id ? (
                      <MdExpandLess className="text-2xl" />
                    ) : (
                      <MdExpandMore className="text-2xl" />
                    )}
                  </div>
                </button>

                {expandedFAQId === item.id && (
                  <div className="px-5 pb-5 border-t border-gray-200 bg-gray-50 animate-in fade-in duration-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <MdSearch className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </Card>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Still need help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactMethods.map((method) => (
              <Card
                key={method.id}
                className="p-6 text-center hover:shadow-lg transition-shadow duration-200 hover:border-blue-200"
              >
                <div className="flex justify-center mb-4">{method.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{method.value}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-100">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Report an Issue
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If you've experienced an issue during your ride, we're here to
              help. Report it and our team will investigate.
            </p>
            <Button variant="primary" size="lg">
              Report Issue
            </Button>
          </div>
        </Card>

      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;
