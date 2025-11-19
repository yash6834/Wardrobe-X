import React from "react";
import { RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const PolicySection = () => {
  const policies = [
    {
      icon: <RefreshCw size={40} className="text-black" />,
      title: "Easy Exchange Policy",
      description: "We offer hassle free exchange policy",
    },
    {
      icon: <ShieldCheck size={40} className="text-black" />,
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy",
    },
    {
      icon: <Headphones size={40} className="text-black" />,
      title: "Best Customer Support",
      description: "We provide 24/7 customer support",
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
        {policies.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PolicySection;
