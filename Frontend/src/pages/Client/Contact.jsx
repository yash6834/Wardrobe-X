import React from "react";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import { assets } from "../../assets/frontend_assets/assets";
import PolicySection from "../../components/Policy";

const Contact = () => {

  const { t } = useTranslation();

  return (
    <main className="pt-28 px-6 bg-white min-h-screen">

      {/* HEADER */}

      <div className="text-center mb-16">

        <div className="inline-block pb-2">
          <Title text1={t("get_in")} text2={t("touch")} />
        </div>

        <p className="mt-4 text-gray-400 max-w-lg mx-auto text-base font-light italic">
          {t("contact_description")}
        </p>

      </div>


      {/* MAIN SECTION */}

      <section className="max-w-7xl mx-auto mb-24 flex flex-col lg:flex-row items-stretch gap-0 rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">

        {/* IMAGE */}

        <div className="lg:w-1/2 w-full relative min-h-[400px]">

          <img
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            src={assets.contact_img}
            alt="Contact"
          />

          <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500"></div>

        </div>


        {/* CONTACT INFO */}

        <div className="lg:w-1/2 w-full bg-[#fdfdfd] p-10 md:p-16 flex flex-col justify-center space-y-10">

          {/* OFFICE */}

          <div>

            <h3 className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-bold mb-4">
              {t("flagship_store")}
            </h3>

            <div className="space-y-2">

              <p className="text-2xl font-light text-gray-900 leading-tight">
                Wardrobe X{" "}
                <span className="font-semibold italic">
                  {t("office_location")}
                </span>
              </p>

              <p className="text-gray-500 text-lg font-light leading-relaxed">

                {t("address_line1")} <br />
                {t("address_line2")} <br />
                {t("address_line3")}

              </p>

            </div>

          </div>


          {/* DIVIDER */}

          <div className="w-full h-[1px] bg-gradient-to-r from-gray-200 to-transparent"></div>


          {/* CONTACT DETAILS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="space-y-1">

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                {t("support_line")}
              </p>

              <p className="text-lg text-gray-800 hover:text-yellow-600 transition-colors cursor-pointer">
                +91 8780800578
              </p>

            </div>


            <div className="space-y-1">

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                {t("inquiries")}
              </p>

              <p className="text-lg text-gray-800 hover:text-yellow-600 transition-colors cursor-pointer underline underline-offset-4 decoration-gray-200">
                wardrobex@gmail.com
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* POLICY */}

      <div className="border-t border-gray-50 pt-10">
        <PolicySection />
      </div>

    </main>
  );

};

export default Contact;