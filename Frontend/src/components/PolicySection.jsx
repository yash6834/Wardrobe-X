import React from "react";
import { RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const PolicySection = () => {
  const policies = [
    {
      icon: <RefreshCw strokeWidth={1.5} />,
      title: "Easy Exchange",
      description: "Seamless exchanges designed for your convenience.",
    },
    {
      icon: <ShieldCheck strokeWidth={1.5} />,
      title: "7 Days Return",
      description: "Confidence in every purchase with 7-day free returns.",
    },
    {
      icon: <Headphones strokeWidth={1.5} />,
      title: "Expert Support",
      description: "Our dedicated team is here to assist you 24/7.",
    },
  ];

  return (
    <section className="relative w-full py-24 overflow-hidden bg-white">
      {/* Decorative Background Blobs for the blur to interact with */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-100/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {policies.map((item, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-[40px] border border-white/40 
                         bg-white/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]
                         hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500
                         flex flex-col items-center text-center"
            >
              {/* Glass Icon Container */}
              <div className="mb-8 relative">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl 
                                bg-white/60 backdrop-blur-md border border-white/80 shadow-sm
                                group-hover:bg-black group-hover:text-white group-hover:-rotate-12
                                transition-all duration-500 ease-in-out">
                  {React.cloneElement(item.icon, { size: 28 })}
                </div>
                {/* Subtle glow behind icon on hover */}
                <div className="absolute inset-0 bg-black/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>

              {/* Content */}
              <h3 className="text-sm font-bold tracking-[0.15em] uppercase mb-3 text-gray-900">
                {item.title}
              </h3>
              
              <p className="text-gray-500 text-sm font-light leading-relaxed max-w-[220px]">
                {item.description}
              </p>

              {/* Aesthetic indicator */}
              <div className="mt-6 flex gap-1">
                <div className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-black transition-colors" />
                <div className="w-4 h-1 rounded-full bg-gray-200 group-hover:bg-black transition-all duration-500" />
                <div className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-black transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PolicySection;