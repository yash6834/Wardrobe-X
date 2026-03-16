import React from "react";
import { useTranslation } from "react-i18next";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";
import PolicySection from "../../components/Policy";

const About = () => {

  const { t } = useTranslation();

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-stone-800 selection:bg-stone-800 selection:text-white font-sans">

      {/* HERO SECTION */}

      <section className="pt-32 pb-24 px-6 lg:px-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        <div className="lg:w-1/2 space-y-8 z-10">

          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-400">
            {t("about_story")}
          </span>

          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-900 leading-[1.1]">

            {t("about_title_1")} <br />

            <span className="font-serif italic text-stone-500">
              {t("about_title_2")}
            </span>{" "}

            {t("about_title_3")}

          </h1>

          <p className="text-lg text-stone-600 leading-relaxed max-w-md font-light">
            {t("about_description")}
          </p>

          <div className="pt-4">
            <Link
              to="/collection"
              className="inline-flex items-center justify-center px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white bg-stone-900 rounded-full hover:bg-stone-700 transition-colors duration-500"
            >
              {t("explore_collection")}
            </Link>
          </div>

        </div>

        {/* IMAGE */}

        <div className="md:w-1/3 w-full relative">

          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-300/50 aspect-[4/5] md:aspect-square lg:aspect-[4/5] group">

            <img
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              src={assets.about_img}
              alt="About"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>

          </div>

          <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-stone-200/50 backdrop-blur-md">

            <p className="text-3xl font-serif italic text-stone-800">
              {t("established")}
            </p>

          </div>

        </div>

      </section>


      {/* CORE PHILOSOPHY */}

      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16 space-y-4">

            <h2 className="text-3xl font-light text-stone-900">
              {t("core_philosophy")}
            </h2>

            <p className="text-stone-500 font-light">
              {t("core_subtitle")}
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

            {/* Vision */}

            <div className="text-center space-y-5">

              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                {t("vision")}
              </h4>

              <p className="text-sm text-stone-500 leading-relaxed font-light px-4">
                {t("vision_desc")}
              </p>

            </div>


            {/* Quality */}

            <div className="text-center space-y-5">

              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                {t("quality")}
              </h4>

              <p className="text-sm text-stone-500 leading-relaxed font-light px-4">
                {t("quality_desc")}
              </p>

            </div>


            {/* Ethics */}

            <div className="text-center space-y-5">

              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                {t("ethics")}
              </h4>

              <p className="text-sm text-stone-500 leading-relaxed font-light px-4">
                {t("ethics_desc")}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* QUOTE */}

      <section className="py-32 px-6 bg-stone-900 text-center">

        <div className="max-w-4xl mx-auto">

          <p className="text-3xl md:text-5xl font-serif italic leading-snug text-stone-200">
            {t("fashion_quote")}
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">

            <div className="h-[1px] w-12 bg-stone-600"></div>

            <p className="text-xs uppercase tracking-[0.3em] text-stone-400 font-semibold">
              Wardrobe X
            </p>

            <div className="h-[1px] w-12 bg-stone-600"></div>

          </div>

        </div>

      </section>

      <div className="bg-[#FAF9F6]">
        <PolicySection />
      </div>

    </main>
  );

};

export default About;