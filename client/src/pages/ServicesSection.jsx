import React from "react";
import { motion } from "framer-motion";

const ServicesSection = () => {
  const services = [
    {
      title: "ATL MARKETING ",
      description:
        "From dynamic bus branding to eye-catching wall wraps, we help your brand stand out in high-traffic spots, making a notable impact across the market.",
      image: "/assets/HomePageImages/ATL marketing.png",
      link: "/media/atl",
    },
    {
      title: "BTL MARKETING",
      description:
        "We create direct, targeted campaigns using event branding and seminar promotions to engage your audience and drive quick results.",
      image: "/assets/HomePageImages/BTL marketing.png",
      link: "/media/btl",
    },
    {
      title: "TTL MARKETING",
      description:
        "Integrates social media ads, email campaigns, and more to deliver an impactful brand message to engage specific audiences.",
      image: "/assets/HomePageImages/TTL marketing.png",
      link: "/media/ttl",
    },
  ];

  return (
    <section className="w-full bg-white pb-24 px-6 font-serif lg:px-28">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {services.map((service, index) => (
          <motion.a
            key={index}
            href={service.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="overflow-hidden">
              <motion.img
                src={service.image}
                alt={service.title}
                className="w-full h-[250px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-5 transition-colors duration-300 group-hover:bg-gray-50">
              <h4 className="text-xl font-bold text-[#1A2A80] group-hover:text-[#1A2A80] transition-colors duration-300">
                {" "}
                {/* Changed group-hover:text-blue-900 */}
                {service.title}
              </h4>
              <p className="text-base mt-2 text-gray-700">
                {service.description}
              </p>
              <span className="text-2xl mt-4 inline-block text-[#1A2A80] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#1A2A80]">
                {" "}
                {/* Changed group-hover:text-blue-900 */}
                →
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;