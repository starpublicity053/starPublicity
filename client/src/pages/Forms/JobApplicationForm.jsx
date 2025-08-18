import React, { useState, useRef, useEffect } from "react";
import { FaEnvelope, FaPhone, FaUpload, FaMapMarkerAlt } from "react-icons/fa";
import { useSubmitApplicationMutation } from "../../features/auth/jobApplicationApi";
import { motion, AnimatePresence } from "framer-motion";

const JobApplicationForm = ({ job, onClose, onSubmitSuccess }) => {
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    locationName: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email.";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    if (!formData.locationName.trim())
      newErrors.locationName = "Location is required.";
    if (!formData.resume) newErrors.resume = "Resume is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage(null);
    if (!validateForm()) {
      setSubmitMessage({ type: "error", text: "Please fix errors above." });
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("jobTitle", job.title);

    try {
      await submitApplication(data).unwrap();
      setSubmitMessage({ type: "success", text: "Application submitted!" });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        locationName: "",
        resume: null,
      });
      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Submission failed. Try again.",
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="w-full max-w-2xl bg-white/5 backdrop-blur-lg shadow-2xl border border-white/30
            rounded-3xl px-6 py-8 sm:px-10 sm:py-10 text-white relative overflow-y-auto
            max-h-[82vh] md:max-h-[78vh] my-14 md:my-20"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-white text-2xl hover:text-red-400 focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>

          <h3 className="text-3xl text-white mb-6">Apply for: {job.title}</h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 font-sans sm:grid-cols-2 gap-4 sm:gap-6"
          >
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
            <IconInputField
              label="Email"
              name="email"
              type="email"
              icon={<FaEnvelope className="text-[#1a2a80]" />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <IconInputField
              label="Phone"
              name="phone"
              type="tel"
              icon={<FaPhone className="text-[#1a2a80]" />}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <IconInputField
              label="Location"
              name="locationName"
              type="text"
              icon={<FaMapMarkerAlt className="text-[#1a2a80]" />}
              value={formData.locationName}
              onChange={handleChange}
              error={errors.locationName}
            />

            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Resume <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="resume"
                  className="cursor-pointer bg-[#1a2a80] text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-blue-700 transition"
                >
                  <FaUpload className="mr-2" />
                  Upload Resume
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {formData.resume && (
                  <span className="text-sm text-white truncate max-w-[calc(100%-150px)]">
                    {formData.resume.name}
                  </span>
                )}
              </div>
              {errors.resume && (
                <p className="text-red-400 text-xs mt-1">{errors.resume}</p>
              )}
            </div>

            {submitMessage && (
              <div
                className={`col-span-2 p-3 rounded-md text-center text-sm font-medium ${
                  submitMessage.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <div className="col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-[#1a2a80] to-blue-800 text-whitye px-6 py-3 rounded-full  font-bold font-serif shadow-lg hover:shadow-xl transition disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobApplicationForm;

// 🔤 Reusable Components
const InputField = ({ label, name, value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold mb-1">
      {label} <span className="text-red-400">*</span>
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full bg-white/10 text-white border ${
        error ? "border-red-500" : "border-white/30"
      } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2a80]`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const IconInputField = ({
  label,
  name,
  type,
  icon,
  value,
  onChange,
  error,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold mb-1">
      {label} <span className="text-red-400">*</span>
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </span>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-white/10 text-white border ${
          error ? "border-red-500" : "border-white/30"
        } rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2a80]`}
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);
