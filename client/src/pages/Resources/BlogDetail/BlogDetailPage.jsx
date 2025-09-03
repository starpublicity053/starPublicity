import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaClock,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoShareSocialSharp, IoMailOpenOutline } from "react-icons/io5";

import {
  useGetBlogByIdQuery,
  useGetBlogsQuery,
  useSubmitContactFormMutation,
} from "../../../features/auth/blogApi";

// Helper function to transform Cloudinary URLs for optimization
const getOptimizedCloudinaryUrl = (url, isFullWidth = false) => {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }
  const transformations = isFullWidth
    ? "f_auto,q_auto,w_1200"
    : "f_auto,q_auto,w_500,h_300,c_thumb,g_face";
  return url.replace("/image/upload/", `/image/upload/${transformations}/`);
};

// Helper function to generate HTML from content blocks
const generateContentHTML = (blocks) => {
  if (!Array.isArray(blocks)) {
    return `<p>${blocks}</p>`;
  }

  let html = "";
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];

    if (
      block.type === "image" &&
      i + 1 < blocks.length &&
      blocks[i + 1].type === "image"
    ) {
      const image1 = block;
      const image2 = blocks[i + 1];
      html += `
        <div class="flex flex-col sm:flex-row gap-4 my-10">
          <figure class="flex-1 text-center">
            <img src="${getOptimizedCloudinaryUrl(image1.url)}" alt="${image1.caption || "Blog content image"
        }" class="rounded-2xl shadow-lg" /> 
            ${image1.caption
          ? `<figcaption class="text-gray-600 text-sm italic mt-2 font-serif">${image1.caption}</figcaption>`
          : ""
        }
          </figure>
          <figure class="flex-1 text-center">
            <img src="${getOptimizedCloudinaryUrl(image2.url)}" alt="${image2.caption || "Blog content image"
        }" class="rounded-2xl shadow-lg" /> 
            ${image2.caption
          ? `<figcaption class="text-gray-600 text-sm italic mt-2 font-serif">${image2.caption}</figcaption>`
          : ""
        }
          </figure>
        </div>
      `;
      i += 2;
      continue;
    }

    switch (block.type) {
      case "heading":
        const headingClasses = {
          1: "text-4xl font-extrabold mt-10 mb-4 text-gray-900",
          2: "text-3xl font-bold mt-10 mb-4 text-gray-900",
          3: "text-2xl font-bold mt-10 mb-4 text-gray-900",
          4: "text-xl font-bold mt-10 mb-4 text-gray-900",
          5: "text-lg font-semibold mt-8 mb-3 text-gray-900",
          6: "text-base font-semibold mt-8 mb-3 text-gray-900",
        };
        const level = block.level || 2;
        const classes = headingClasses[level] || headingClasses[2];
        html += `<h${level} class="${classes}">${block.text}</h${level}>`;
        break;
      case "paragraph":
        html += `<p class="text-gray-900">${block.text}</p>`;
        break;
      case "image":
        html += `
          <figure class="my-10 text-center">
            <img src="${getOptimizedCloudinaryUrl(block.url)}" alt="${block.caption || "Blog content image"
          }" class="rounded-2xl shadow-lg mx-auto" />
            ${block.caption
            ? `<figcaption class="text-gray-600 text-sm italic mt-2 font-serif">${block.caption}</figcaption>`
            : ""
          }
          </figure>`;
        break;
      case "quote":
        html += `
          <blockquote>
            <p>${block.text}</p>
            ${block.author ? `<cite>— ${block.author}</cite>` : ""}
          </blockquote>`;
        break;
      default:
        html += `<p class="text-gray-900">${block.text || ""}</p>`;
        break;
    }
    i++;
  }
  return html;
};

// Helper function to calculate read time
const calculateReadTime = (blocks) => {
  if (!Array.isArray(blocks)) return 1;

  let wordCount = 0;
  blocks.forEach((block) => {
    let text = "";
    if (["paragraph", "heading", "quote"].includes(block.type)) {
      text = block.text;
    } else if (block.type === "image") {
      text = block.caption;
    }
    if (text) {
      wordCount += text.split(/\s+/).filter(Boolean).length;
    }
  });

  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes > 0 ? minutes : 1;
};

// ## Reusable Sidebar Component to avoid code duplication
const SidebarContent = ({
  post,
  relatedPosts,
  handleTagClick,
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  isSubmitSuccess,
  formSubmitted,
  submitMessage,
  isSubmitError,
  feedbackRef,
}) => (
  <>
    <div
      id="contact-form"
      className="relative p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-200 mb-8 sticky top-8 overflow-hidden bg-white dark:bg-gray-800 before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50 before:to-indigo-100 before:opacity-80 dark:before:from-gray-900 dark:before:to-blue-950 before:z-0"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-300 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-blob z-10"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 z-10"></div>

      <div className="relative z-20 text-center mb-8">
        <IoMailOpenOutline className="text-[#1A2A80] dark:text-blue-400 text-5xl sm:text-6xl mx-auto mb-4 animate-bounce-subtle" />
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1A2A80] dark:text-white drop-shadow-sm leading-tight">
          Let's Connect!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-sm mx-auto text-sm">
          We'd love to hear about your advertising goals.
        </p>
      </div>

      {formSubmitted && submitMessage && (
        <div
          ref={feedbackRef}
          className={`relative z-20 px-4 py-3 rounded-lg text-center animate-fade-in mb-4 ${isSubmitSuccess
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
            }`}
          role="alert"
          aria-live="polite"
        >
          <strong className="font-bold">
            {isSubmitSuccess ? "Success!" : "Error!"}
          </strong>
          <span className="block sm:inline ml-2">{submitMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative z-20 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 text-left"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1A2A80] focus:border-[#1A2A80] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 text-left"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1A2A80] focus:border-[#1A2A80] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 text-left"
          >
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1A2A80] focus:border-[#1A2A80] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 text-left"
          >
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1A2A80] focus:border-[#1A2A80] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="serviceOfInterest"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 text-left"
          >
            Service of Interest
          </label>
          <select
            name="serviceOfInterest"
            id="serviceOfInterest"
            value={formData.serviceOfInterest}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1A2A80] focus:border-[#1A2A80] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select a service</option>
            <option value="OOH Advertising">OOH Advertising</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Creative Design">Creative Design</option>
            <option value="Market Research">Market Research</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 text-left"
          >
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1A2A80] focus:border-[#1A2A80] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isSubmitSuccess}
          className="w-full bg-[#1A2A80] text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.03] active:scale-100 border border-blue-700 tracking-wide text-lg relative overflow-hidden group hover:shadow-xl"
        >
          <span className="absolute inset-0 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          <span className="relative z-10 flex items-center justify-center">
            {isSubmitting
              ? "Submitting..."
              : isSubmitSuccess
                ? "Submitted!"
                : "Submit Inquiry"}
          </span>
        </button>
      </form>
    </div>

    {relatedPosts.length > 0 && (
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          More Like This
        </h3>
        <ul className="space-y-6">
          {relatedPosts.map((relatedPost) => (
            <li key={relatedPost._id}>
              <Link
                to={`/resources/blogs/${relatedPost._id}`}
                className="flex items-center group"
              >
                <img
                  src={relatedPost.imageUrl}
                  alt={relatedPost.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md mr-4 flex-shrink-0 border border-gray-200 group-hover:scale-105 transition-transform duration-200"
                />
                <span className="text-base sm:text-lg text-gray-800 font-medium group-hover:text-[#1A2A80] leading-tight">
                  {relatedPost.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Explore by Topic
      </h3>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {post.tags &&
          post.tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="px-4 py-2 bg-blue-100 text-[#1A2A80] text-sm sm:text-base font-medium rounded-full hover:bg-blue-200 hover:text-blue-800 transition-colors duration-200 shadow-sm cursor-pointer"
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  </>
);


const BlogDetailPage = () => {
  const { id: blogId } = useParams();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyShare, setShowStickyShare] = useState(false);
  const contentRef = useRef(null);
  const feedbackRef = useRef(null);

  const { data: post, isLoading, isError } = useGetBlogByIdQuery(blogId);
  const { data: allBlogs = [] } = useGetBlogsQuery();
  const [
    submitContactForm,
    { isLoading: isSubmitting, isSuccess, isError: submitError },
  ] = useSubmitContactFormMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    serviceOfInterest: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const totalScroll = scrollHeight - clientHeight;
      setScrollProgress(totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0);

      if (contentRef.current) {
        const contentBottom = contentRef.current.getBoundingClientRect().bottom;
        const viewportHeight = window.innerHeight;
        setShowStickyShare(
          scrollTop > viewportHeight * 0.4 &&
          contentBottom > viewportHeight * 0.5
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContactForm(formData).unwrap();
      setSubmitMessage("Your message has been sent. Thank you!");
      setIsSubmitSuccess(true);
      setFormData({ name: "", email: "", company: "", phone: "", serviceOfInterest: "", message: "" });
    } catch (err) {
      console.error("Failed to submit form:", err);
      setSubmitMessage("Failed to send message. Please try again.");
      setIsSubmitSuccess(false);
    } finally {
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 5000);
      if (feedbackRef.current) {
        feedbackRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/resources/blogs?tag=${encodeURIComponent(tag)}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-bold text-blue-600">Loading Post...</div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Post Not Found</h2>
        <p className="text-lg text-gray-700">
          The blog post you are looking for does not exist or could not be loaded.
        </p>
        <Link
          to="/resources/blogs"
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
        >
          Back to All Blogs
        </Link>
      </div>
    );
  }

  let parsedContentBlocks = [];
  if (post && post.content) {
    try {
      parsedContentBlocks =
        typeof post.content === "string"
          ? JSON.parse(post.content)
          : Array.isArray(post.content)
            ? post.content
            : [{ type: "paragraph", text: String(post.content) }];
    } catch (error) {
      console.error("Error parsing blog content:", error);
      parsedContentBlocks = [{ type: "paragraph", text: post.content }];
    }
  }

  const contentHTML = generateContentHTML(parsedContentBlocks);
  const readTime = calculateReadTime(parsedContentBlocks);
  const relatedPosts = allBlogs.filter((b) => b._id !== post._id).slice(0, 3);
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sidebarProps = {
    post,
    relatedPosts,
    handleTagClick,
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    isSubmitSuccess,
    formSubmitted,
    submitMessage,
    isSubmitError: submitError,
    feedbackRef,
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <div
        className="fixed top-0 left-0 h-1 bg-[#1A2A80] z-50 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden mb-12">
        <img
          src={getOptimizedCloudinaryUrl(post.imageUrl, true)}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover object-center animate-fade-in"
          key={post.imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-white animate-slide-in-down">
          <div className="max-w-7xl mx-auto">
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-lg mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-lg md:text-xl text-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#7A85C1]" />
                  <span className="font-semibold">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-lg sm:text-xl text-[#7A85C1]" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-lg sm:text-xl text-[#7A85C1]" />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <main className="lg:col-span-2" ref={contentRef}>
            <article className="prose prose-lg max-w-none prose-p:leading-relaxed prose-p:mb-5 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:font-medium prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-blue-800 prose-blockquote:bg-blue-50 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-md prose-blockquote:shadow-sm prose-li:mb-2 prose-ul:list-disc prose-ul:pl-5 prose-ul:marker:text-blue-500 prose-ol:list-decimal prose-ol:pl-5 prose-ol:marker:text-blue-500 prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2A80]focus:ring-opacity-50">
              <div dangerouslySetInnerHTML={{ __html: contentHTML }} />
              {post.keyHighlights && post.keyHighlights.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8 rounded-md shadow-sm">
                  <p className="text-[#1A2A80] text-lg font-semibold mb-2">
                    {post.keyHighlightsTitle || "Key Highlights"}:
                  </p>
                  <ul className="list-none space-y-2 pl-0">
                    {post.keyHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#1A2A80] font-bold mr-2">&#10003;</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            <section className="mt-16 bg-blue-50 p-6 sm:p-8 rounded-xl shadow-lg border border-blue-100 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1A2A80] mb-6 leading-tight">
                Ready to Boost Your Brand with OOH?
              </h3>
              <p className="text-base sm:text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
                Discover how our strategic insights and innovative solutions can elevate your next outdoor advertising campaign.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-[#1A2A80] text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-base sm:text-lg"
              >
                Let’s Talk Outdoor Strategy
              </a>
            </section>
          </main>

          {/* ## Sidebar for large screens */}
          <aside className="lg:col-span-1 hidden lg:block">
            <SidebarContent {...sidebarProps} />
          </aside>
        </div>

        {/* ## Sidebar content for small and medium screens, stacked below main content */}
        <div className="lg:hidden mt-16">
          <SidebarContent {...sidebarProps} />
        </div>
      </div>

      <div className={`fixed bottom-8 right-4 sm:right-8 z-40 bg-white p-3 sm:p-4 rounded-full shadow-xl transition-all duration-300 ${showStickyShare
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
        } hidden md:flex flex-col space-y-3 sm:space-y-4 border border-blue-100`}>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1A2A80] hover:text-blue-800 transition-colors duration-200 transform hover:scale-110"
          aria-label="Share on LinkedIn"
        >
          <FaLinkedinIn className="w-6 h-6 sm:w-8 sm:h-8" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1A2A80] hover:text-blue-800 transition-colors duration-200 transform hover:scale-110"
          aria-label="Share on X (formerly Twitter)"
        >
          <FaXTwitter className="w-6 h-6 sm:w-8 sm:h-8" />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1A2A80] hover:text-blue-800 transition-colors duration-200 transform hover:scale-110"
          aria-label="Share on Facebook"
        >
          <FaFacebookF className="w-6 h-6 sm:w-8 sm:h-8" />
        </a>
      </div>
    </div>
  );
};

export default BlogDetailPage;