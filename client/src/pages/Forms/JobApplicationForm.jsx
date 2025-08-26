import React, { useState, useRef, useEffect } from "react";
import { FaFilePdf, FaTimes, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useSubmitApplicationMutation } from "../../features/auth/jobApplicationApi";
import { motion, AnimatePresence } from "framer-motion";
// FIXED: Added FiUpload to the import list
import {
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiUser,
  FiPaperclip,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUpload,
} from "react-icons/fi";

// The main component with the new multi-step wizard design
const JobApplicationForm = ({ job, onClose, onSubmitSuccess }) => {
  // --- All backend logic and state management remain the same ---
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
  const [submitStatus, setSubmitStatus] = useState({ status: "idle" }); // idle, loading, success, error

  // --- New state for managing the form steps ---
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // --- Logic for handling form navigation and validation ---
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required.";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required.";
    } else if (step === 2) {
      if (!formData.email.trim()) newErrors.email = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email format.";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
      if (!formData.locationName.trim())
        newErrors.locationName = "Location is required.";
    } else if (step === 3) {
      if (!formData.resume) newErrors.resume = "A resume file is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, resume: file }));
    if (errors.resume) {
      setErrors((prev) => ({ ...prev, resume: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      // A final check to be safe
      alert("Please ensure all fields are filled correctly.");
      return;
    }

    setSubmitStatus({ status: "loading" });

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("jobTitle", job.title);

    try {
      await submitApplication(data).unwrap();
      setSubmitStatus({
        status: "success",
        text: "Application submitted successfully!",
      });
      onSubmitSuccess?.();
      setTimeout(onClose, 2000); // Close modal after success
    } catch (error) {
      setSubmitStatus({
        status: "error",
        text: "Submission failed. Please try again later.",
      });
    }
  };

  const slideVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* === Modal Header === */}
          <div className="p-6 text-center border-b border-slate-200 bg-white relative">
            <h3 className="text-xl font-bold text-slate-800">
              Apply for <span className="text-[#1a2a80]">{job.title}</span>
            </h3>
            <p className="text-sm text-slate-500">
              Please complete all steps to apply
            </p>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="p-8">
            {/* === Progress Bar === */}
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          {/* === Form Body with Animated Steps === */}
          <div
            className="px-8 pb-8 flex-grow overflow-y-auto"
            style={{ minHeight: "300px" }}
          >
            <AnimatePresence mode="wait">
              {submitStatus.status === "idle" && (
                <motion.div
                  key={currentStep}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.4,
                  }}
                >
                  {currentStep === 1 && (
                    <Step1
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3
                      resume={formData.resume}
                      error={errors.resume}
                      onFileChange={handleFileChange}
                    />
                  )}
                </motion.div>
              )}
              {submitStatus.status === "loading" && (
                <StatusScreen
                  icon={<FiLoader className="animate-spin" />}
                  title="Submitting Application..."
                />
              )}
              {submitStatus.status === "success" && (
                <StatusScreen
                  icon={<FiCheckCircle className="text-green-500" />}
                  title="Success!"
                  message={submitStatus.text}
                />
              )}
              {submitStatus.status === "error" && (
                <StatusScreen
                  icon={<FiAlertCircle className="text-red-500" />}
                  title="Oops!"
                  message={submitStatus.text}
                />
              )}
            </AnimatePresence>
          </div>

          {/* === Modal Footer with Dynamic Buttons === */}
          {submitStatus.status === "idle" && (
            <div className="p-6 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg font-semibold text-white bg-[#1a2a80] hover:bg-[#1a2a80]/90 transition flex items-center gap-2"
                >
                  Next <FaArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// =============================================
// 🧩 Helper Components for Steps & UI
// =============================================

const Step1 = ({ formData, errors, handleChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <FiUser className="mx-auto text-4xl text-indigo-500 mb-2" />
      <h3 className="font-semibold text-lg text-slate-700">
        Personal Information
      </h3>
      <p className="text-sm text-slate-500">Let's start with your name.</p>
    </div>
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
  </div>
);

const Step2 = ({ formData, errors, handleChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <FiMail className="mx-auto text-4xl text-indigo-500 mb-2" />
      <h3 className="font-semibold text-lg text-slate-700">Contact Details</h3>
      <p className="text-sm text-slate-500">
        How can we get in touch with you?
      </p>
    </div>
    <IconInputField
      label="Email Address"
      name="email"
      type="email"
      icon={<FiMail />}
      value={formData.email}
      onChange={handleChange}
      error={errors.email}
    />
    <IconInputField
      label="Phone Number"
      name="phone"
      type="tel"
      icon={<FiPhone />}
      value={formData.phone}
      onChange={handleChange}
      error={errors.phone}
    />
    <IconInputField
      label="Current Location"
      name="locationName"
      type="text"
      icon={<FiMapPin />}
      value={formData.locationName}
      onChange={handleChange}
      error={errors.locationName}
    />
  </div>
);

const Step3 = ({ resume, error, onFileChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <FiPaperclip className="mx-auto text-4xl text-indigo-500 mb-2" />
      <h3 className="font-semibold text-lg text-slate-700">
        Upload Your Resume
      </h3>
      <p className="text-sm text-slate-500">
        Please provide your latest resume.
      </p>
    </div>
    <FileInput
      selectedFile={resume}
      onFileChange={onFileChange}
      error={error}
    />
  </div>
);

const ProgressBar = ({ currentStep, totalSteps }) => {
  const steps = [
    { icon: <FiUser />, name: "Personal" },
    { icon: <FiMail />, name: "Contact" },
    { icon: <FiPaperclip />, name: "Resume" },
  ];
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center w-1/3"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentStep > index
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-slate-300 text-slate-400"
              }`}
            >
              {step.icon}
            </div>
            <p
              className={`mt-1 text-xs font-semibold transition-all duration-300 ${
                currentStep > index ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              {step.name}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <motion.div
          className="bg-indigo-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

const StatusScreen = ({ icon, title, message }) => (
  <motion.div
    className="flex flex-col items-center justify-center text-center h-full"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
    {message && <p className="text-slate-500 mt-2">{message}</p>}
  </motion.div>
);

// --- Reusable Form Field Components (Styling updated for new theme) ---
const InputField = ({ label, name, value, onChange, error }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-700 mb-1"
    >
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full bg-white border ${
        error ? "border-red-400" : "border-slate-300"
      } rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-700 mb-1"
    >
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
        {icon}
      </span>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-white border ${
          error ? "border-red-400" : "border-slate-300"
        } rounded-lg pl-10 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// --- Drag-and-Drop File Input Component ---
const FileInput = ({ selectedFile, onFileChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {selectedFile ? (
        <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center gap-3">
            <FaFilePdf className="text-indigo-500" size={20} />
            <span className="text-sm font-medium text-slate-700 truncate">
              {selectedFile.name}
            </span>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-slate-500 hover:text-red-600"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 ${
            isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300"
          } ${
            error ? "border-red-400" : ""
          } border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition`}
        >
          <FiUpload className="text-3xl text-slate-400 mb-2" />
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-indigo-600">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-slate-500">PDF, DOC, or DOCX</p>
          <input
            type="file"
            ref={fileInputRef}
            id="resume"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default JobApplicationForm;