import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from "lucide-react";
import { useGetBlogsQuery } from '../features/auth/blogApi';
import { FaBlog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Framer Motion Variants for this section
const slideInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.1,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.2,
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const staggeredFadeInUp = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger delay for children
    },
  },
};

const LatestBlogsSection = () => {
  const { data: blogs, isLoading, isError } = useGetBlogsQuery();
  const sortedBlogs = useMemo(() => {
    return blogs ? [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
  }, [blogs]);

  const fallbackSummaries = [
    "Welcome to our hub for advertising insights! We explore the latest industry trends, share expert tips for creating memorable campaigns, and showcase success stories that inspire. Whether you're curious about outdoor media or looking for fresh branding ideas, our articles offer the strategic thinking you need to help your brand shine and truly connect with your audience.",
    "Dive into the world of effective advertising with our expert analysis. We break down what makes a campaign successful, from eye-catching visuals to strategic placements that capture attention. Discover tips and tricks to make your brand's message resonate with the right people.",
    "Curious about the latest in advertising? Our blog covers everything from emerging technologies to timeless strategies. Join us as we explore how innovative ideas and smart planning can create powerful connections between brands and their audiences, driving both engagement and growth."
  ];

  // Safely get a string snippet from the blog content, which might be an object/array
  const getContentSnippet = (content, length = 250, fallbackIndex = 0) => {
    if (typeof content === 'string') {
      return content.substring(0, length) + '...';
    }
    // Fallback for non-string content or if you want to handle structured content differently
    // For now, returning a default text.
    return fallbackSummaries[fallbackIndex % fallbackSummaries.length];
  };

  if (isLoading) return <div className="text-center py-16">Loading latest blogs...</div>;
  if (isError) return <div className="text-center py-16 text-red-500">Error loading blogs.</div>;

  return (
    <section className="bg-gray-50 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* === Clean & Themed Header Section === */}
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggeredFadeInUp}
        >
          <motion.p
            className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2"
            variants={slideInUp}
          >
            From Our Blog
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900"
            variants={slideInUp}
          >
            Latest Insights & Advertising Trends
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            variants={slideInUp}
          >
            Discover the latest articles, success stories, and expert analysis in the dynamic world of advertising.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {sortedBlogs.length > 0 && (
            <motion.div
              className="lg:w-3/5 bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideInLeft}
            >
              <Link to={`/resources/blogs/${sortedBlogs[0]._id}`} className="block">
                <div className="relative overflow-hidden">
                  <img
                    src={sortedBlogs[0].imageUrl}
                    alt={sortedBlogs[0].title}
                    className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-4 left-4 bg-[#3B38A0] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {sortedBlogs[0].category || 'NEWS'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#3B38A0] transition-colors duration-300">
                    {sortedBlogs[0].title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    By {sortedBlogs[0].author} - {new Date(sortedBlogs[0].createdAt).toLocaleDateString()}
                  </p> 
                  <p
                    className="text-gray-700 text-base leading-relaxed line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: getContentSnippet(sortedBlogs[0].summary || sortedBlogs[0].content, 400, 0) }}
                  />
                  <div className="mt-4 text-[#3B38A0] font-semibold flex items-center group-hover:underline">
                    READ MORE
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          <motion.div
            className="lg:w-2/5 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggeredFadeInUp}
          >
            {sortedBlogs.slice(1, 3).map((blog, index) => (
              <motion.div
                key={blog._id}
                className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between group hover:shadow-xl transition-shadow duration-300 ease-in-out"
                variants={slideInRight}
              >
                <Link to={`/resources/blogs/${blog._id}`} className="block">
                  <div className="relative overflow-hidden rounded-md mb-4">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#3B38A0] transition-colors duration-300">
                      {blog.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      By {blog.author} - {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <p
                      className="text-gray-700 text-sm leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: getContentSnippet(blog.summary || blog.content, 150, index + 1) }}
                    />
                  </div>
                  <div className="mt-4 text-[#3B38A0] font-semibold flex items-center group-hover:underline">
                    READ MORE
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;
