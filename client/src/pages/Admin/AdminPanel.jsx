import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  FaBars,
  FaBlog,
  FaBoxOpen,
  FaVideo,
  FaBriefcase,
  FaEnvelope,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaSearch,
  FaTrash,
  FaUpload,
  FaPen,
  FaTachometerAlt,
  FaChartBar,
  FaClock,
  FaUserShield,
  FaUserPlus,
  FaUsers,
  FaUserSlash,
  FaUserCheck,
  FaCalendarAlt,
  FaFire,
  FaSpinner,
  FaExclamationCircle,
  FaTimesCircle,
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown,
  FaReply,
  FaEye,
  FaCheckCircle, // New: For marking as read
  FaStickyNote, // New: For adding notes
  FaPlus, // New: For add note button
  FaFileDownload, // New: For the download button
  FaInfoCircle, // New: For inquiry details icon
  FaCalendarAlt as FaCalendarIcon,
  FaUser as FaUserIcon,
  FaEnvelope as FaEnvelopeIcon,
  FaPhone as FaPhoneIcon,
  FaMapMarkerAlt as FaLocationIcon,
  FaTag as FaTopicIcon,
  FaBriefcase as FaMarketIcon,
  FaLightbulb as FaStatusIcon,
  FaExternalLinkAlt as FaForwardIcon,
} from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa"; // New: For theme toggle

import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../features/auth/authSlice"; // Import the logout action
import { useNavigate } from "react-router-dom";
import {
  useGetJobsQuery,
  useDeleteJobMutation,
  useAddJobMutation,
} from "../../features/auth/jobApi";
import {
  useGetBlogsQuery,
  useAddBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from "../../features/auth/blogApi";
// Import the new contact API hooks and new mutations
import {
  useGetContactInquiriesQuery,
  useForwardContactInquiryMutation,
  useUpdateContactInquiryStatusMutation, // New mutation
  useAddContactInquiryNoteMutation, // New mutation
} from "../../features/auth/contactUs"; // Assuming contactUs.js is in auth feature folder

// New: Import user management API hooks (assuming they exist)
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminsQuery,
  useInviteAdminMutation,
  useUpdateAdminRoleMutation,
  useDeleteAdminMutation,
  useUpdateAdminStatusMutation,
} from "../../features/auth/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import libraries for Excel export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import useMediaQuery from "@mui/material/useMediaQuery";

// Define menu items for the sidebar
const menuItems = [
  { key: "blogs", label: "Blogs", icon: <FaBlog /> },
  { key: "products", label: "Products", icon: <FaBoxOpen /> },
  { key: "jobs", label: "Jobs", icon: <FaBriefcase /> },
  { key: "contact", label: "Contact", icon: <FaEnvelope /> },
  { key: "users", label: "Users", icon: <FaUsers /> },
];

// New: Define which tabs are searchable
const searchableTabs = ["jobs", "blogs", "contact", "users"];

// UPDATED: Initial state for job form with new structured fields
const initialJobFormData = {
  title: "",
  location: "",
  timeType: "",
  summary: "",
  responsibilities: [],
  requirements: [],
};

// Helper function to generate unique IDs for content blocks
const generateUniqueId = () => Date.now() + Math.random();

// Initial state for blog form with content blocks
const initialBlogFormData = {
  blogTitle: "",
  blogAuthor: "",
  tags: [],
  keyHighlightsTitle: "What you'll learn in this blog", // Default title for highlights section
  keyHighlights: [],
  contentBlocks: [{ id: generateUniqueId(), type: "paragraph", text: "" }], // Start with an empty paragraph block
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[100] px-4 py-8"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-slate-900 rounded-2xl p-8 md:p-10 shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100 border border-slate-200">
        <div className="flex items-center text-red-500 mb-6">
          <FaTrash size={40} />
          <h3 className="text-xl md:text-3xl font-extrabold ml-6 text-slate-900">
            {title}
          </h3>
        </div>
        <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5"
            disabled={isLoading}
          >
            {isLoading && (
              <FaSpinner className="animate-spin inline-block mr-2" />
            )}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// New: Custom hook to calculate the average inquiries for the ReferenceLine
const useAverageInquiries = (inquiryDataOverTime) => {
  return useMemo(() => {
    if (!inquiryDataOverTime || inquiryDataOverTime.length === 0) {
      return 0;
    }
    const totalInquiries = inquiryDataOverTime.reduce(
      (sum, entry) => sum + entry.Inquiries,
      0
    );
    // Average over the full 12-month period for a more stable metric.
    // This gives a clear view of average monthly performance over the year.
    return totalInquiries / 12;
  }, [inquiryDataOverTime]);
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-slate-200">
        <p className="label font-bold text-slate-800">{`${label}`}</p>
        <p className="intro text-teal-600">{`Inquiries : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// New AddNoteModal Component
const AddNoteModal = ({ isOpen, onClose, onConfirm, isLoading, inquiryId }) => {
  const [noteContent, setNoteContent] = useState("");
  const noteInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setNoteContent("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteContent.trim()) {
      onConfirm(inquiryId, noteContent);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[100] px-4 py-8"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-slate-900 rounded-2xl p-8 md:p-10 shadow-xl w-full max-w-lg mx-4 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-extrabold text-slate-800">Add Note</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800"
          >
            <FaTimesCircle size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="noteContent"
              className="block text-sm font-medium text-slate-600 mb-2"
            >
              Note Content
            </label>
            <textarea
              ref={noteInputRef}
              id="noteContent"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter your note here..."
              rows="5"
              required
              className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y text-slate-800"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && (
                <FaSpinner className="animate-spin inline-block mr-2" />
              )}
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Updated InquiryDetailModal component to match the new backend model
const InquiryDetailModal = ({
  isOpen,
  onClose,
  inquiry,
  onForwardClick,
  onAddNoteClick,
}) => {
  if (!isOpen || !inquiry) return null;

  const DetailItem = ({ icon, label, value, className = "" }) => (
    <div
      className={`flex items-start p-4 bg-slate-50 rounded-lg shadow-sm ${className}`}
    >
      <span className="text-blue-400 mr-3 mt-1 text-lg">{icon}</span>
      <div>
        <strong className="block text-sm font-semibold text-slate-600">
          {label}:
        </strong>
        <span className="text-slate-800 text-base break-words">{value}</span>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[100] px-4 py-8"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-slate-900 rounded-2xl p-6 md:p-10 shadow-xl w-full max-w-4xl mx-4 transform transition-all duration-300 scale-100 opacity-100 overflow-y-auto max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-200">
          <div className="flex items-center">
            <FaInfoCircle className="text-blue-400 text-3xl md:text-4xl mr-4" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">
              Inquiry Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 transition-colors duration-200"
            aria-label="Close"
          >
            <FaTimesCircle size={28} />
          </button>
        </div>

        {/* Inquiry Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <DetailItem icon={<FaUserIcon />} label="Name" value={inquiry.name} />
          <DetailItem
            icon={<FaEnvelopeIcon />}
            label="Email"
            value={inquiry.email}
          />
          <div className="flex items-start p-4 bg-slate-50 rounded-lg shadow-sm">
            <span className="text-blue-400 mr-3 mt-1 text-lg"><FaStatusIcon /></span>
            <div>
              <strong className="block text-sm font-semibold text-slate-600">Status:</strong>
              <span className={`text-base break-words font-semibold capitalize ${inquiry.status === 'read' ? 'text-green-400' : 'text-yellow-400'}`}>{inquiry.status}</span>
            </div>
          </div>
          <DetailItem
            icon={<FaCalendarIcon />}
            label="Received Date"
            value={new Date(inquiry.createdAt).toLocaleString()}
          />
        </div>

        {/* Message Section */}
        <div className="bg-slate-100 p-6 rounded-xl shadow-inner mb-8">
          <strong className="block text-lg font-bold text-slate-800 mb-3 flex items-center">
            <FaEnvelope className="mr-2 text-blue-400" /> Message:
          </strong>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {inquiry.message}
          </p>
        </div>

        {/* Inquiry Notes Section */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
            <FaStickyNote className="text-purple-400 mr-3" /> Notes
          </h4>
          {inquiry.notes && inquiry.notes.length > 0 ? (
            <ul className="space-y-4">
              {inquiry.notes.map((note, index) => (
                <li
                  key={index}
                  className="bg-purple-100 p-4 rounded-lg shadow-sm border border-purple-200"
                >
                  <p className="text-purple-900 text-base leading-snug">
                    {note.content}
                  </p>
                  <span className="block text-xs text-slate-400 mt-2">
                    Added on: {new Date(note.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic text-center py-4">
              No notes for this inquiry yet. Be the first to add one!
            </p>
          )}
          <button
            onClick={() => onAddNoteClick(inquiry._id)}
            className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition duration-200 flex items-center justify-center gap-2 text-base shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add New Note
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4 border-t pt-6 border-slate-200">
          <button
            onClick={() => onForwardClick(inquiry)}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
          >
            <FaReply /> Forward Inquiry
          </button>
        </div>
      </div>
    </div>
  );
};

// New ForwardInquiryModal component
const ForwardInquiryModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  forwardEmail,
  setForwardEmail,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[100] px-4 py-8"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-slate-900 rounded-2xl p-8 md:p-10 shadow-xl w-full max-w-lg mx-4 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-extrabold text-slate-800">
            Forward Inquiry
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800"
          >
            <FaTimesCircle size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="forwardEmail"
              className="block text-sm font-medium text-slate-600 mb-2"
            >
              Recipient Email
            </label>
            <input
              type="email"
              id="forwardEmail"
              value={forwardEmail}
              onChange={(e) => setForwardEmail(e.target.value)}
              placeholder="Enter recipient email"
              required
              className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && (
                <FaSpinner className="animate-spin inline-block mr-2" />
              )}
              Forward
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to format time since an event
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 5) return "just now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

// Helper for email validation
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const AdminPanel = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  // --- State Management ---
  const [activeTab, setActiveTab] = useState("welcome");
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [existingImageId, setExistingImageId] = useState(null); // For hero image updates

  // +++ ADD THESE TWO LINES +++
  const [showJobForm, setShowJobForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Responsive Sidebar State ---
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  // New: Theme and Quick Actions state
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const quickActionsRef = useRef(null);
  const quickActionsButtonRef = useRef(null);

  // --- Theme Management ---
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // --- Quick Actions Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        quickActionsRef.current &&
        !quickActionsRef.current.contains(event.target) &&
        quickActionsButtonRef.current &&
        !quickActionsButtonRef.current.contains(event.target)
      ) {
        setIsQuickActionsOpen(false);
      }
    };
    if (isQuickActionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isQuickActionsOpen]);

  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap(); // Optional: Call backend logout endpoint
    } catch (error) {
      console.error("Server logout failed, proceeding with client-side logout.", error);
    }
    dispatch(logoutAction());
    // The SessionManager in App.jsx will now handle the redirect to /login
  }, [dispatch, logoutMutation]);

  // Form data states
  const [jobFormData, setJobFormData] = useState(initialJobFormData);
  // NEW: State for individual responsibility and requirement inputs
  const [currentResponsibility, setCurrentResponsibility] = useState("");
  const [currentRequirement, setCurrentRequirement] = useState("");

  const [blogData, setBlogData] = useState(initialBlogFormData);
  const [heroImageFile, setHeroImageFile] = useState(null); // For hero image file
  const [heroImagePreview, setHeroImagePreview] = useState(null); // For hero image preview

  // New state for the current tag input field
  const [currentTagInput, setCurrentTagInput] = useState("");

  // Search states
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [blogSearchTerm, setBlogSearchTerm] = useState("");
  const [contactSearchTerm, setContactSearchTerm] = useState(""); // New: for Contact
  const [userSearchTerm, setUserSearchTerm] = useState(""); // New: for Users

  // Confirmation modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'job', 'blog', or 'reel'
  const [modalId, setModalId] = useState(null);

  // +++ Notification System State +++
  const [notifications, setNotifications] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const notificationPanelRef = useRef(null);
  const notificationButtonRef = useRef(null);

  // New states for Contact Management
  const [isInquiryDetailModalOpen, setIsInquiryDetailModalOpen] =
    useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [forwardEmail, setForwardEmail] = useState("");
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false); // New: for add note modal
  const [selectedInquiryForNote, setSelectedInquiryForNote] = useState(null); // New: stores ID of inquiry to add note to

  // New states for Inquiry Filtering and Sorting
  const [inquiryFilter, setInquiryFilter] = useState("all"); // 'all', 'read', 'unread'
  const [inquirySortBy, setInquirySortBy] = useState("latest"); // 'latest', 'oldest', 'name'

  // New state for User Management
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState("admin"); // New: State for the role

  // Helper derived state
  const isEditingBlog = useMemo(() => editingBlogId !== null, [editingBlogId]);

  // --- RTK Query Hooks ---

  const {
    data: jobs = [],
    isLoading: isJobsLoading,
    isError: isJobsError,
    refetch: refetchJobs,
  } = useGetJobsQuery();
  const [addJob, { isLoading: isAddingJob }] = useAddJobMutation();
  const [deleteJob, { isLoading: isDeletingJob }] = useDeleteJobMutation();

  const {
    data: blogPosts = [],
    isLoading: isBlogsLoading,
    isError: isBlogsError,
    refetch: refetchBlogs,
  } = useGetBlogsQuery();

  const [addBlogMutation, { isLoading: isAddingBlog }] = useAddBlogMutation();
  const [deleteBlogMutation, { isLoading: isDeletingBlog }] =
    useDeleteBlogMutation();
  const [updateBlogMutation, { isLoading: isUpdatingBlog }] =
    useUpdateBlogMutation();

  // New: RTK Query hooks for Contact Inquiries
  const {
    data: inquiries = [],
    isLoading: isInquiriesLoading,
    isError: isInquiriesError,
    refetch: refetchInquiries,
  } = useGetContactInquiriesQuery();

  const [forwardContactInquiry, { isLoading: isForwardingInquiry }] =
    useForwardContactInquiryMutation();

  const [updateContactInquiryStatus, { isLoading: isUpdatingInquiryStatus }] = // New
    useUpdateContactInquiryStatusMutation();

  const [addContactInquiryNote, { isLoading: isAddingInquiryNote }] = // New
    useAddContactInquiryNoteMutation(); // New: RTK Query hooks for User Management

  const {
    data: admins = [],
    isLoading: isAdminLoading,
    isError: isAdminError,
    refetch: refetchAdmins,
  } = useGetAdminsQuery();
  const [inviteAdmin, { isLoading: isInvitingAdmin }] = useInviteAdminMutation();
  const [updateAdminRole, { isLoading: isUpdatingAdminRole }] =
    useUpdateAdminRoleMutation();
  const [deleteAdmin, { isLoading: isDeletingAdmin }] = useDeleteAdminMutation();
  const [updateAdminStatus, { isLoading: isUpdatingAdminStatus }] =
    useUpdateAdminStatusMutation();

  // --- Authentication and Navigation Effects ---
  // --- Notification System ---
  const handleNotificationPanelToggle = () => {
    setIsNotificationPanelOpen((prev) => {
      const willBeOpen = !prev;
      // When opening the panel
      if (willBeOpen) {
        // We move the new notifications to the history
        if (notifications.length > 0) {
          setNotificationHistory((prevHistory) => {
            const combined = [...notifications, ...prevHistory];
            // Remove duplicates by id, keeping the newest
            const unique = Array.from(
              new Map(combined.map((item) => [item.id, item])).values()
            );
            return unique.slice(0, 15); // Keep last 15 for history
          });
          // And clear the new notifications to remove the badge
          setNotifications([]);
        }
        // Then we update the timestamp for future checks
        localStorage.setItem("lastNotificationCheck", Date.now().toString());
      }
      return willBeOpen;
    });
  };

  // Effect to detect new items and create notifications
  useEffect(() => {
    if (isJobsLoading || isBlogsLoading || isInquiriesLoading) return;

    const lastChecked = localStorage.getItem("lastNotificationCheck");

    let checkTimestamp;
    if (!lastChecked) {
      // First time loading after login. Check for all items created today.
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      checkTimestamp = startOfToday.getTime();
    } else {
      checkTimestamp = parseInt(lastChecked, 10);
    }

    const newFoundNotifications = [];

    jobs.forEach((job) => {
      if (new Date(job.createdAt).getTime() > checkTimestamp) {
        newFoundNotifications.push({
          id: `job-${job._id}`, icon: <FaBriefcase className="text-blue-500" />, message: `New job posted: "${job.title}"`, timestamp: job.createdAt, link: "jobs",
        });
      }
    });
    blogPosts.forEach((blog) => {
      if (new Date(blog.createdAt).getTime() > checkTimestamp) {
        newFoundNotifications.push({
          id: `blog-${blog._id}`, icon: <FaBlog className="text-orange-500" />, message: `New blog published: "${blog.title}"`, timestamp: blog.createdAt, link: "blogs",
        });
      }
    });
    inquiries.forEach((inquiry) => {
      if (new Date(inquiry.createdAt).getTime() > checkTimestamp) {
        newFoundNotifications.push({
          id: `inquiry-${inquiry._id}`, icon: <FaEnvelope className="text-teal-500" />, message: `New inquiry from: "${inquiry.name}"`, timestamp: inquiry.createdAt, link: "contact",
        });
      }
    });

    if (newFoundNotifications.length > 0) {
      const existingIds = new Set(notifications.map((n) => n.id));
      const trulyNew = newFoundNotifications.filter((n) => !existingIds.has(n.id));
      if (trulyNew.length > 0) {
        setNotifications((prev) => [...prev, ...trulyNew].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      }
    }
  }, [jobs, blogPosts, inquiries, isJobsLoading, isBlogsLoading, isInquiriesLoading]);

  // Effect to close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setIsNotificationPanelOpen(false);
      }
    };
    if (isNotificationPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationPanelOpen]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    toast.info("Refreshing data...");

    try {
      switch (activeTab) {
        case "jobs":
          await refetchJobs();
          break;
        case "blogs":
          await refetchBlogs();
          break;
        case "contact":
          await refetchInquiries();
          break;
        case "users":
          await refetchAdmins();
          break;
        case "welcome":
          // Refresh all data for the dashboard
          await Promise.all([refetchJobs(), refetchBlogs(), refetchInquiries()]);
          break;
        default:
          // No data to refresh for 'products' tab yet
          break;
      }
      toast.success("Data refreshed!");
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data.");
    } finally {
      setIsRefreshing(false);
    }
  }, [activeTab, refetchJobs, refetchBlogs, refetchInquiries, isRefreshing]);

  const getAvatarUrl = useCallback(
    (name, size) => {
      const defaultName =
        userInfo?.role === "superAdmin" ? "Super Admin" : "Admin";
      const avatarName =
        name || userInfo?.name || userInfo?.email || defaultName;
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        avatarName
      )}&background=1d4ed8&color=fff&size=${size}`;
    },
    [userInfo]
  );

  // --- Search and Filtering Logic ---

  const handleSearchChange = (e) => {
    const { value } = e.target;
    switch (activeTab) {
      case "jobs":
        setJobSearchTerm(value);
        break;
      case "blogs":
        setBlogSearchTerm(value);
        break;
      case "contact":
        setContactSearchTerm(value);
        break;
      case "users":
        setUserSearchTerm(value);
        break;
      default:
        // No search for welcome or products tab
        break;
    }
  };

  const getCurrentSearchTerm = () => {
    switch (activeTab) {
      case "jobs":
        return jobSearchTerm;
      case "blogs":
        return blogSearchTerm;
      case "contact":
        return contactSearchTerm;
      case "users":
        return userSearchTerm;
      default:
        return "";
    }
  };

  // --- Search and Filtering Logic ---

  const filteredJobs = useMemo(() => {
    if (!jobSearchTerm) return jobs;
    const lowerSearch = jobSearchTerm.toLowerCase();
    return jobs.filter(
      (job) =>
        (job.title || "").toLowerCase().includes(lowerSearch) ||
        (job.location || "").toLowerCase().includes(lowerSearch) ||
        (job.timeType || "").toLowerCase().includes(lowerSearch)
    );
  }, [jobs, jobSearchTerm]);

  const filteredBlogPosts = useMemo(() => {
    if (!blogSearchTerm) return blogPosts;
    const lowerSearch = blogSearchTerm.toLowerCase();
    return blogPosts.filter(
      (blog) =>
        (blog.title || "").toLowerCase().includes(lowerSearch) ||
        (blog.author || "").toLowerCase().includes(lowerSearch) ||
        (blog.content &&
          typeof blog.content === "string" &&
          blog.content.toLowerCase().includes(lowerSearch)) ||
        blog.tags?.some((tag) => (tag || "").toLowerCase().includes(lowerSearch))
    );
  }, [blogPosts, blogSearchTerm]);

  // New: Filtered Contact Inquiries
  const filteredInquiries = useMemo(() => {
    let filtered = inquiries;

    // Apply filter by read/unread status
    if (inquiryFilter === "read") {
      filtered = filtered.filter((inquiry) => inquiry.status === "read");
    } else if (inquiryFilter === "unread") {
      filtered = filtered.filter((inquiry) => inquiry.status === "unread");
    }

    // Apply search term
    if (contactSearchTerm) {
      const lowerSearch = contactSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (inquiry) =>
          (inquiry.name || "").toLowerCase().includes(lowerSearch) ||
          (inquiry.email || "").toLowerCase().includes(lowerSearch) ||
          (inquiry.message || "").toLowerCase().includes(lowerSearch)
      );
    }
    return filtered;
  }, [inquiries, contactSearchTerm, inquiryFilter]);

  // New: Sorted Contact Inquiries
  const sortedInquiries = useMemo(() => {
    let sorted = [...filteredInquiries];
    if (inquirySortBy === "latest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (inquirySortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (inquirySortBy === "name") {
      sorted.sort((a, b) => {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }
    return sorted;
  }, [filteredInquiries, inquirySortBy]);

  // New: Filtered Admins
  const filteredAdmins = useMemo(() => {
    if (!userSearchTerm) return admins;
    const lowerSearch = userSearchTerm.toLowerCase();
    return admins.filter(
      (admin) =>
        (admin.name || "").toLowerCase().includes(lowerSearch) ||
        (admin.email || "").toLowerCase().includes(lowerSearch)
    );
  }, [admins, userSearchTerm]);
  // --- Job Management Handlers ---

  const handleJobChange = useCallback((e) => {
    setJobFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // NEW: Handler to add a responsibility
  const handleAddResponsibility = () => {
    if (currentResponsibility.trim() !== "") {
      setJobFormData((prev) => ({
        ...prev,
        responsibilities: [
          ...prev.responsibilities,
          currentResponsibility.trim(),
        ],
      }));
      setCurrentResponsibility(""); // Clear input
    }
  };

  // NEW: Handler to remove a responsibility
  const handleRemoveResponsibility = (indexToRemove) => {
    setJobFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // NEW: Handler to add a requirement
  const handleAddRequirement = () => {
    if (currentRequirement.trim() !== "") {
      setJobFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()],
      }));
      setCurrentRequirement(""); // Clear input
    }
  };

  // NEW: Handler to remove a requirement
  const handleRemoveRequirement = (indexToRemove) => {
    setJobFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const resetJobForm = useCallback(() => {
    setJobFormData(initialJobFormData);
    setCurrentResponsibility("");
    setCurrentRequirement("");
  }, []);

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await addJob(jobFormData).unwrap();
      resetJobForm();
      toast.success("Job posted successfully!");
    } catch (error) {
      console.error("Failed to add job:", error);
      toast.error("Failed to post job.");
    }
  };

  const openDeleteModal = (type, id) => {
    setModalType(type);
    setModalId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!modalType || !modalId) return;

    try {
      if (modalType === "job") await deleteJob(modalId).unwrap();
      else if (modalType === "blog") await deleteBlogMutation(modalId).unwrap();
      else if (modalType === "user") await deleteAdmin(modalId).unwrap();

      toast.success(
        `${
          modalType.charAt(0).toUpperCase() + modalType.slice(1)
        } deleted successfully!`
      );
    } catch (err) {
      console.error(`Error deleting ${modalType}:`, err);
      toast.error(`Failed to delete ${modalType}.`);
    } finally {
      setIsModalOpen(false);
      setModalId(null);
      setModalType(null);
    }
  };

  // Calculate job metrics for the dashboard summary
  const jobMetrics = useMemo(
    () => ({
      totalJobs: jobs.length,
      fullTime: jobs.filter(
        (job) => job.timeType?.toLowerCase() === "full-time"
      ).length,
      partTime: jobs.filter(
        (job) => job.timeType?.toLowerCase() === "part-time"
      ).length,
    }),
    [jobs]
  );

  // New: Process inquiry data for the chart
  const inquiryDataOverTime = useMemo(() => {
    if (isInquiriesLoading || !inquiries || inquiries.length === 0) {
      return [];
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = {};

    // Initialize the last 12 months to ensure a consistent timeline
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      const monthName = `${monthNames[d.getMonth()]} '${d.getFullYear().toString().slice(-2)}`;
      monthlyData[monthKey] = { name: monthName, Inquiries: 0 };
    }

    // Populate with actual inquiry counts
    inquiries.forEach(inquiry => {
      const date = new Date(inquiry.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].Inquiries += 1;
      }
    });

    return Object.values(monthlyData);
  }, [inquiries, isInquiriesLoading]);

  const averageInquiries = useAverageInquiries(inquiryDataOverTime);

  // --- Blog Management Handlers ---

  const handleBlogChange = useCallback((e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleHeroImageChange = useCallback((e) => {
    const file = e.target.files[0];
    setHeroImageFile(file);
    if (file) {
      setHeroImagePreview(URL.createObjectURL(file)); // Create URL for preview
    } else {
      setHeroImagePreview(null);
    }
  }, []);

  // Handler for updating the current tag input
  const handleCurrentTagInputChange = useCallback((e) => {
    setCurrentTagInput(e.target.value);
  }, []);

  // Modified handler for adding a tag
  const handleAddTag = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === ",") {
        // Add tag on Enter or Comma
        e.preventDefault(); // Prevent default form submission if Enter is pressed
        const inputTags = currentTagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");

        if (inputTags.length > 0) {
          setBlogData((prev) => {
            let newTags = [...prev.tags];
            inputTags.forEach((tag) => {
              if (!newTags.includes(tag)) {
                // Prevent duplicates
                newTags.push(tag);
              }
            });
            return { ...prev, tags: newTags };
          });
          setCurrentTagInput(""); // Clear the input field after adding tags
        }
      }
    },
    [currentTagInput]
  ); // Depend on currentTagInput to get its latest value

  const handleRemoveTag = useCallback((tagToRemove) => {
    setBlogData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  // Modified handler for adding a key highlight
  const handleAddHighlight = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form submission
      if (e.target.value.trim() !== "") {
        const newHighlight = e.target.value.trim();
        setBlogData((prev) => ({
          ...prev,
          keyHighlights: [...prev.keyHighlights, newHighlight],
        }));
        e.target.value = ""; // Clear input
      }
    }
  }, []);

  // Handler for removing a key highlight
  const handleRemoveHighlight = useCallback((highlightToRemove) => {
    setBlogData((prev) => ({
      ...prev,
      keyHighlights: prev.keyHighlights.filter(
        (highlight) => highlight !== highlightToRemove
      ),
    }));
  }, []);

  // --- Content Block Management ---

  const addContentBlock = useCallback((type) => {
    setBlogData((prev) => {
      let newBlock;
      switch (type) {
        case "paragraph":
          newBlock = { id: generateUniqueId(), type: "paragraph", text: "" };
          break;
        case "heading":
          newBlock = {
            id: generateUniqueId(),
            type: "heading",
            level: 2,
            text: "",
          }; // Default to H2
          break;
        case "image":
          newBlock = {
            id: generateUniqueId(),
            type: "image",
            file: null,
            url: "",
            caption: "",
          };
          break;
        case "quote":
          newBlock = {
            id: generateUniqueId(),
            type: "quote",
            text: "",
            author: "",
          };
          break;
        default:
          return prev;
      }
      return { ...prev, contentBlocks: [...prev.contentBlocks, newBlock] };
    });
  }, []);

  const updateContentBlock = useCallback((id, key, value) => {
    setBlogData((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map((block) =>
        block.id === id ? { ...block, [key]: value } : block
      ),
    }));
  }, []);

  const handleContentBlockFileChange = useCallback((id, e) => {
    const file = e.target.files[0];
    setBlogData((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map((block) =>
        block.id === id
          ? { ...block, file: file, url: file ? URL.createObjectURL(file) : "" }
          : block
      ),
    }));
  }, []);

  const removeContentBlock = useCallback((id) => {
    setBlogData((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter((block) => block.id !== id),
    }));
  }, []);

  const moveContentBlock = useCallback((id, direction) => {
    setBlogData((prev) => {
      const blocks = [...prev.contentBlocks];
      const index = blocks.findIndex((block) => block.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return prev;

      const [movedBlock] = blocks.splice(index, 1);
      blocks.splice(newIndex, 0, movedBlock);
      return { ...prev, contentBlocks: blocks };
    });
  }, []);

  const handleBlogSubmit = async (e) => {
    e.preventDefault();

    if (!isEditingBlog && !heroImageFile) {
      toast.error("Please select a featured image for a new blog post.");
      return;
    }

    const formData = new FormData();
    formData.append("title", blogData.blogTitle);
    formData.append("author", blogData.blogAuthor);
    formData.append("tags", JSON.stringify(blogData.tags));
    formData.append("keyHighlightsTitle", blogData.keyHighlightsTitle);
    formData.append("keyHighlights", JSON.stringify(blogData.keyHighlights));

    if (heroImageFile) {
      formData.append("image", heroImageFile);
    } else if (isEditingBlog && existingImageId) {
      formData.append("imageId", existingImageId);
    }

    blogData.contentBlocks.forEach((block) => {
      if (block.type === "image" && block.file) {
        formData.append(block.id, block.file); // Use a unique identifier like block.id as the key
      }
    });

    formData.append(
      "content",
      JSON.stringify(
        blogData.contentBlocks.map((block) => {
          if (block.type === "image" && block.file) {
            // Replace the local URL with a placeholder that the backend can recognize
            return { ...block, file: null, url: `placeholder:${block.id}` };
          }
          return block;
        })
      )
    );

    try {
      if (isEditingBlog) {
        await updateBlogMutation({ id: editingBlogId, formData }).unwrap();
        toast.success("Blog post updated successfully!");
      } else {
        await addBlogMutation(formData).unwrap();
        toast.success("Blog post published successfully!");
      }
      resetBlogForm();
    } catch (error) {
      console.error(
        `Error ${isEditingBlog ? "updating" : "publishing"} blog:`,
        error
      );
      toast.error(
        `Failed to ${isEditingBlog ? "update" : "publish"} blog post.`,
        "error"
      );
    }
  };

  const resetBlogForm = useCallback(() => {
    setBlogData(initialBlogFormData);
    setHeroImageFile(null);
    setEditingBlogId(null);
    setExistingImageId(null);
    setHeroImagePreview(null);
    setCurrentTagInput(""); // Reset current tag input

    const heroFileInput = document.getElementById("blog-hero-image-input");
    if (heroFileInput) heroFileInput.value = "";
  }, []);

  const handleEditBlog = useCallback((blog) => {
    setShowBlogForm(true);
    setEditingBlogId(blog._id);
    setExistingImageId(blog.imageId);
    setHeroImageFile(null); // Clear potential new hero image selection
    setHeroImagePreview(blog.imageUrl || null); // Set preview to existing hero image URL
    setCurrentTagInput(""); // Clear tag input when editing a blog

    const heroFileInput = document.getElementById("blog-hero-image-input");
    if (heroFileInput) heroFileInput.value = "";

    let parsedBlocks = [];
    try {
      if (typeof blog.content === "string") {
        parsedBlocks = JSON.parse(blog.content); // If backend sends as stringified JSON
      } else if (Array.isArray(blog.content)) {
        parsedBlocks = blog.content; // If backend sends as direct array of objects
      } else {
        parsedBlocks = [
          {
            id: generateUniqueId(),
            type: "paragraph",
            text: blog.content || "",
          },
        ];
      }
    } catch (e) {
      console.error("Error parsing blog content during edit:", e);
      parsedBlocks = [
        { id: generateUniqueId(), type: "paragraph", text: blog.content || "" },
      ];
    }

    parsedBlocks = parsedBlocks.map((block) => {
      if (block.type === "image") {
        return { ...block, file: null, url: block.url || "" }; // Ensure url exists
      }
      return block;
    });

    setBlogData({
      blogTitle: blog.title,
      blogAuthor: blog.author,
      tags: blog.tags || [],
      keyHighlightsTitle:
        blog.keyHighlightsTitle || initialBlogFormData.keyHighlightsTitle,
      keyHighlights: blog.keyHighlights || [],
      contentBlocks:
        parsedBlocks.length > 0
          ? parsedBlocks
          : [{ id: generateUniqueId(), type: "paragraph", text: "" }], // Ensure at least one block
    });
  }, []);

  // Calculate blog metrics for the dashboard summary
  const blogMetrics = useMemo(() => {
    const uniqueAuthors = new Set(blogPosts.map((blog) => blog.author)).size;
    return {
      totalBlogs: blogPosts.length,
      uniqueAuthors: uniqueAuthors,
    };
  }, [blogPosts]);

  // Calculate contact metrics for the dashboard summary
  const contactMetrics = useMemo(
    () => ({
      totalInquiries: inquiries.length,
    }),
    [inquiries]
  );

  // Sort blog posts by creation date for "Recent Activity" on the dashboard
  const recentBlogPosts = useMemo(() => {
    return [...blogPosts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [blogPosts]);

  // --- Contact Management Handlers ---
  const handleViewInquiry = useCallback(
    async (inquiry) => {
      // Set the selected inquiry first so the modal can open
      setSelectedInquiry(inquiry);
      setIsInquiryDetailModalOpen(true);
      // If the inquiry is 'unread', dispatch an update to mark it as 'read'
      if (inquiry.status === "unread") {
        try {
          await updateContactInquiryStatus({
            id: inquiry._id,
            status: "read",
          }).unwrap();
          // Since RTK Query automatically refetches and updates the cache,
          // the UI will update on its own. We just need to show a success toast.
          toast.info("Inquiry marked as read.");
        } catch (error) {
          console.error("Failed to update inquiry status to read:", error);
        }
      }
    },
    [updateContactInquiryStatus]
  );

  const handleForwardInquiryClick = useCallback((inquiry) => {
    setSelectedInquiry(inquiry);
    setForwardEmail(""); // Clear previous email
    setIsInquiryDetailModalOpen(false); // Close detail modal if it was open
    setIsForwardModalOpen(true);
  }, []);

  const confirmForwardInquiry = async () => {
    if (!selectedInquiry || !forwardEmail) {
      toast.error(
        "Please select an inquiry and provide a forwarding email.",
        "error"
      );
      return;
    }
    try {
      await forwardContactInquiry({
        id: selectedInquiry._id,
        forwardingEmail: forwardEmail,
      }).unwrap();
      toast.success("Inquiry forwarded successfully!");
      setIsForwardModalOpen(false);
      setSelectedInquiry(null);
      setForwardEmail("");
    } catch (error) {
      console.error("Failed to forward inquiry:", error);
      toast.error(
        `Failed to forward inquiry: ${error?.data?.message || "Server error"}`,
      );
    }
  };

  // New: Handle marking inquiry as read/unread
  const handleToggleReadStatus = useCallback(
    async (inquiryId, currentStatus) => {
      const newStatus = currentStatus === "read" ? "unread" : "read";
      try {
        await updateContactInquiryStatus({
          id: inquiryId,
          status: newStatus,
        }).unwrap();
        toast.info(`Inquiry marked as ${newStatus}.`);
      } catch (error) {
        console.error(
          `Failed to update inquiry status to ${newStatus}:`,
          error
        );
        toast.error(`Failed to mark inquiry as ${newStatus}.`);
      }
    },
    [updateContactInquiryStatus]
  );

  // New: Handle opening Add Note Modal
  const handleAddNoteClick = useCallback((inquiryId) => {
    setSelectedInquiryForNote(inquiryId);
    setIsAddNoteModalOpen(true);
  }, []);

  // New: Confirm adding a note
  const confirmAddNote = async (inquiryId, content) => {
    try {
      const result = await addContactInquiryNote({
        id: inquiryId,
        content,
      }).unwrap();
      toast.success("Note added successfully!");
      setIsAddNoteModalOpen(false);
      setSelectedInquiryForNote(null);
      // Update the selected inquiry state with the new notes array from the response
      setSelectedInquiry(result.data);
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error(
        `Failed to add note: ${error?.data?.message || "Server error"}`
      );
    }
  };

  // --- User Management Handlers ---
  const handleInviteAdmin = async (e) => {
    e.preventDefault();

    // --- Enhanced Client-Side Validation ---
    if (!inviteName.trim() || !inviteEmail.trim() || !invitePassword) {
      toast.error("Name, email, and password are required.");
      return;
    }
    if (!validateEmail(inviteEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (invitePassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    // The data object that will be sent to the server
    const adminData = {
      name: inviteName.trim(),
      email: inviteEmail.trim().toLowerCase(),
      password: invitePassword,
      role: inviteRole, // Include the role in the request
    };

    try {
      await inviteAdmin(adminData).unwrap();
      toast.success(`Admin account created for ${adminData.name}`);
      // Reset all form fields
      setInviteName("");
      setInviteEmail("");
      setInvitePassword("");
      setInviteRole("admin");
    } catch (error) {
      console.error("Failed to invite admin:", error);

      // Provide a specific error message to the user
      const errorMessage =
        error?.data?.message ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      await updateAdminRole({ id, role: newRole }).unwrap();
      toast.success("User role updated successfully.");
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error(error?.data?.message || "Failed to update role.");
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await updateAdminStatus({ id, status: newStatus }).unwrap();
      toast.success(`User status updated to ${newStatus}.`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(error?.data?.message || "Failed to update status.");
    }
  };

  // --- New: Handler for downloading inquiries as Excel ---
  const handleDownloadExcel = useCallback(() => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const formattedData = sortedInquiries.map((inquiry) => {
      // Combine notes into a single string
      const notes =
        inquiry.notes && inquiry.notes.length > 0
          ? inquiry.notes
              .map(
                (note) =>
                  `${note.content} (on ${new Date(
                    note.createdAt
                  ).toLocaleString()})`
              )
              .join("\n")
          : "No notes";
      return {
        "Full Name": inquiry.name, // Use the 'name' field
        Email: inquiry.email,
        Message: inquiry.message,
        Status: inquiry.status,
        "Received Date": new Date(inquiry.createdAt).toLocaleString(),
        Notes: notes,
      };
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, "ContactInquiries" + fileExtension);
  }, [sortedInquiries]);

  // --- Rendered Component (JSX) ---
  return (
    <div
      className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 overflow-hidden relative isolate"
      style={{ backgroundImage: `radial-gradient(at 20% 80%, hsla(212,100%,50%,0.05) 0px, transparent 50%), radial-gradient(at 80% 20%, hsla(289,100%,50%,0.05) 0px, transparent 50%), radial-gradient(at 80% 80%, hsla(180,100%,50%,0.05) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(26, 42, 128, 0.07) 0px, transparent 50%)` }}
    >
      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-2xl
          w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center h-20 px-6 border-b border-slate-200 dark:border-slate-700">
          <FaUserCircle className="text-blue-400 text-3xl mr-3" />
          <h2 className="text-xl font-black tracking-wider text-slate-900 dark:text-white">
            Star<span className="font-light">Publicity</span>
          </h2>
        </div>
        <nav className="flex flex-col mt-4 flex-grow px-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("welcome");
              if (!isDesktop) setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 dark:text-slate-400 ${
              activeTab === "welcome"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-500 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-white"
            }`}
          >
            <span className="w-6 text-center text-lg"><FaTachometerAlt /></span>
            Dashboard
          </button>
          {menuItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                if (!isDesktop) setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-4 px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 dark:text-slate-400 ${
                activeTab === key
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-500 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-white"
              }`}
            >
              <span className="w-6 text-center text-lg">{icon}</span> {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex flex-col flex-grow overflow-hidden min-h-screen transition-all duration-300 ease-in-out ${
          isDesktop ? "md:ml-64" : ""
        }`}
    >
      <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg flex items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        {isMobileSearchVisible && !isDesktop ? (
          <div className="relative w-full flex items-center">
            <FaSearch className="absolute left-3.5 text-slate-500 text-base" />
            <input
              type="search"
              placeholder={`Search in ${activeTab}...`}
              className="pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-sm"
              value={getCurrentSearchTerm()}
              onChange={handleSearchChange}
              autoFocus
            />
            <button
              onClick={() => setIsMobileSearchVisible(false)}
              className="absolute right-2 text-slate-500 hover:text-slate-900"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <button
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white md:hidden mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars size={24} />
              </button>
              <h1 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight capitalize truncate">
                {activeTab === "welcome"
                  ? "Dashboard"
                  : `${activeTab} Management`}
              </h1>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              {searchableTabs.includes(activeTab) && (
                <div className="relative hidden md:block group">
                  <input
                    type="search"
                    placeholder={`Search in ${activeTab}...`}
                    className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-40 md:w-64 text-sm shadow-inner transition-all duration-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-600"
                    value={getCurrentSearchTerm()}
                    onChange={handleSearchChange}
                  />
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-base" />
                </div>
              )}

              {searchableTabs.includes(activeTab) && (
                <button
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white md:hidden"
                  onClick={() => setIsMobileSearchVisible(true)}
                >
                  <FaSearch size={20} />
                </button>
              )}

              {/* NEW: Quick Actions Dropdown */}
              <div className="relative" ref={quickActionsButtonRef}>
                <button
                  onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                  className="relative text-slate-500 hover:text-slate-900 transition-all duration-300 p-2 rounded-full hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700"
                  title="Quick Actions"
                >
                  <FaPlus size={20} />
                </button>
                {isQuickActionsOpen && (
                  <div
                    ref={quickActionsRef}
                    className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in-down"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setActiveTab("jobs");
                          setShowJobForm(true);
                          setIsQuickActionsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                      >
                        <FaBriefcase className="text-blue-500" /> Post New Job
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("blogs");
                          setShowBlogForm(true);
                          setIsQuickActionsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                      >
                        <FaBlog className="text-orange-500" /> Create New Blog
                      </button>
                      {userInfo?.role === 'superAdmin' && (
                        <button
                          onClick={() => {
                            setActiveTab("users");
                            setIsQuickActionsOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                        >
                          <FaUserPlus className="text-green-500" /> Invite New Admin
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* NEW: Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="relative text-slate-500 hover:text-slate-900 transition-all duration-300 p-2 rounded-full hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700"
                title="Toggle Theme"
              >
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="relative text-slate-500 hover:text-slate-900 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 p-2 rounded-full hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700"
                title="Refresh Data"
              >
                <FaSyncAlt
                  size={20}
                  className={`${
                    isRefreshing ? "animate-spin" : ""
                  } transition-transform group-hover:rotate-180 duration-500`}
                />
              </button>

              {/* Notification Bell */}
              <div className="relative" ref={notificationButtonRef}>
                <button
                  onClick={handleNotificationPanelToggle}
                  className="relative text-slate-500 hover:text-slate-900 transition-all duration-300 p-2 rounded-full hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700"
                >
                  <FaBell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">
                        {notifications.length}
                      </span>
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                {isNotificationPanelOpen && (
                  <div
                    ref={notificationPanelRef}
                    className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in-down"
                  >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        Notifications
                      </h4>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notificationHistory.length > 0 ? (
                        <ul>
                          {notificationHistory.map((notification) => (
                            <li
                              key={notification.id}
                              className="border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                            >
                              <button
                                onClick={() => {
                                  setActiveTab(notification.link);
                                  setIsNotificationPanelOpen(false);
                                }}
                                className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-start gap-4"
                              >
                                <span className="mt-1">
                                  {notification.icon}
                                </span>
                                <div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    {timeSince(notification.timestamp)}
                                  </p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-8 text-center">
                          <FaBell
                            size={32}
                            className="mx-auto text-slate-300"
                          />
                          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            You have no new notifications.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={getAvatarUrl(userInfo?.name, 32)}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full object-cover shadow-lg border-2 border-white dark:border-slate-700"
                />
                <span className="hidden sm:inline font-semibold text-sm text-slate-700 dark:text-slate-300">
                  {userInfo?.name ||
                    userInfo?.email ||
                    (userInfo?.role === "superAdmin"
                      ? "Super Admin"
                      : "Admin")}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 hover:bg-red-500/10 dark:hover:bg-red-500/20 px-3 py-2 rounded-lg"
                title="Log Out"
              >
                <FaSignOutAlt size={18} />
                <span className="hidden md:inline font-semibold text-sm">
                  Log Out
                </span>
              </button>
            </div>
          </>
        )}
      </header>

        {/* Content Sections */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-10 custom-scrollbar">
          {/* Welcome Section */}
          {activeTab === "welcome" && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Welcome,{" "}
                <span className="truncate">
                  {userInfo?.name ||
                    userInfo?.email ||
                    (userInfo?.role === "superAdmin" ? "Super Admin" : "Admin")}
                </span>
                !
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30 rounded-full p-4">
                    <FaBriefcase size={28} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Total Jobs</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">
                      {isJobsLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        jobMetrics.totalJobs
                      )}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
                  <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-lg shadow-green-500/30 rounded-full p-4">
                    <FaClock size={28} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Full-time</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">
                      {isJobsLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        jobMetrics.fullTime
                      )}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 rounded-full p-4">
                    <FaClock size={28} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Part-time</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">
                      {isJobsLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        jobMetrics.partTime
                      )}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 rounded-full p-4">
                    <FaBlog size={28} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Total Blogs</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">
                      {isBlogsLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        blogMetrics.totalBlogs
                      )}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 rounded-full p-4">
                    <FaEnvelope size={28} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Inquiries</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">
                      {isInquiriesLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        contactMetrics.totalInquiries
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Contact Inquiries Chart */}
              <section className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <FaChartBar className="text-teal-500 mr-3" /> Contact Inquiries
                  Over Time
                </h3>
                {isInquiriesLoading ? (
                  <div className="text-center py-20 h-[300px] flex flex-col justify-center items-center">
                    <FaSpinner className="animate-spin text-4xl text-teal-500 mx-auto" />
                    <p className="text-slate-500 mt-3">
                      Loading chart data...
                    </p>
                  </div>
                ) : inquiryDataOverTime.every((d) => d.Inquiries === 0) ? (
                  <div className="text-center py-20 h-[300px] flex flex-col justify-center items-center">
                    <FaChartBar className="text-4xl text-slate-300 mx-auto" />
                    <p className="text-slate-500 mt-3">
                      No inquiry data available for the last 12 months.
                    </p>
                  </div>
                ) : (
                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={inquiryDataOverTime}
                        margin={{ top: 20, right: 30, left: 0, bottom: isDesktop ? 5 : 50 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorInquiries"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#14b8a6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#0d9488"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                        <XAxis
                          dataKey="name"
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          angle={isDesktop ? 0 : -45}
                          textAnchor={isDesktop ? "middle" : "end"}
                          interval={0}
                        />
                        <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ fill: "rgba(20, 184, 166, 0.1)" }}
                        />
                        <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }} />
                        <ReferenceLine
                          y={averageInquiries}
                          label={{
                            value: `Avg: ${averageInquiries.toFixed(1)}`,
                            position: 'insideTopRight',
                            fill: '#ef4444',
                            fontSize: 12,
                            fontWeight: 'bold',
                            dy: -10,
                          }}
                          stroke="#ef4444"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                        />
                        <Bar
                          dataKey="Inquiries"
                          fill="url(#colorInquiries)"
                          barSize={isDesktop ? 20 : 15}
                          radius={[4, 4, 0, 0]}
                          activeBar={{ fill: '#14b8a6', stroke: '#0f766e', strokeWidth: 1, fillOpacity: 1 }}
                        >
                          <LabelList
                            dataKey="Inquiries"
                            position="top"
                            style={{ fill: "#0f766e", fontSize: "12px", fontWeight: "bold" }}
                            formatter={(value) => (value > 0 ? value : "")}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              {/* Secondary Stats & Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Blog Posts */}
                <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <FaFire className="text-red-500 mr-3" /> Recent Blog Activity
                  </h3>
                  {isBlogsLoading ? (
                    <div className="text-center py-10">
                      <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto" />
                      <p className="text-slate-500 mt-3">
                        Loading recent blogs...
                      </p>
                    </div>
                  ) : isBlogsError ? (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl relative">
                      <strong className="font-bold">Error!</strong>
                      <span className="block sm:inline ml-2">
                        Failed to load recent blog posts.
                      </span>
                    </div>
                  ) : recentBlogPosts.length > 0 ? (
                    <div className="overflow-hidden">
                      <ul className="divide-y divide-slate-200">
                        {recentBlogPosts.map((blog) => (
                          <li
                            key={blog._id}
                            className="py-3 hover:bg-slate-50 transition-colors duration-200 group -mx-6 px-6"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <div>
                                <p className="text-base font-semibold text-slate-800">
                                  {blog.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                  by {blog.author} on{" "}
                                  {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  handleEditBlog(blog);
                                  setActiveTab("blogs");
                                }}
                                className="text-indigo-600 hover:text-indigo-500 font-medium text-sm flex items-center gap-1 self-end sm:self-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <FaPen size={14} /> <span>View/Edit</span>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl relative">
                      <strong className="font-bold">Info!</strong>
                      <span className="block sm:inline ml-2">
                        No recent blog posts to display.
                      </span>
                    </div>
                  )}
                </section>
                <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-center gap-6">
                    <div className="bg-orange-100 text-orange-600 rounded-full p-4">
                      <FaBlog size={28} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium">Total Blogs</p>
                      <h3 className="text-3xl font-extrabold text-slate-800">
                        {isBlogsLoading ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          blogMetrics.totalBlogs
                        )}
                      </h3>
                    </div>
                  </div>
                  <div className="absolute -top-5 -right-5 text-8xl text-orange-500/10">
                    <FaBlog />
                  </div>
                </div>
                <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-center gap-6">
                    <div className="bg-teal-100 text-teal-600 rounded-full p-4">
                      <FaEnvelope size={28} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium">Inquiries</p>
                      <h3 className="text-3xl font-extrabold text-slate-800">
                        {isInquiriesLoading ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          contactMetrics.totalInquiries
                        )}
                      </h3>
                    </div>
                  </div>
                  <div className="absolute -top-5 -right-5 text-8xl text-teal-500/10">
                    <FaEnvelope />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Management Section */}
          {activeTab === "jobs" && (
            <section className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
                Job Listings
              </h2>

              {/* Button to show/hide Job Creation Form */}
              <button
                onClick={() => setShowJobForm(!showJobForm)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2 mb-6 transform hover:-translate-y-0.5"
              >
                {showJobForm ? "Hide Job Form" : "Post a New Job"}
              </button>

              {/* Job Creation Form - UPDATED */}
              {showJobForm && (
                <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-inner mb-10 border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">
                    Post a New Job
                  </h3>
                  <form onSubmit={handleJobSubmit} className="space-y-6">
                    {/* Job Title */}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Job Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={jobFormData.title}
                        onChange={handleJobChange}
                        placeholder="e.g., Senior React Developer"
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                    </div>
                    {/* Location */}
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={jobFormData.location}
                        onChange={handleJobChange}
                        placeholder="e.g., Remote, New York, USA"
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                    </div>
                    {/* Employment Type */}
                    <div>
                      <label
                        htmlFor="timeType"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Employment Type
                      </label>
                      <select
                        id="timeType"
                        name="timeType"
                        value={jobFormData.timeType}
                        onChange={handleJobChange}
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      >
                        <option value="">Select employment type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    {/* Job Summary */}
                    <div>
                      <label
                        htmlFor="summary"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Job Summary
                      </label>
                      <textarea
                        id="summary"
                        name="summary"
                        value={jobFormData.summary}
                        onChange={handleJobChange}
                        placeholder="Provide a brief summary of the job..."
                        rows="4"
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y text-slate-800"
                      ></textarea>
                    </div>
                    {/* Responsibilities */}
                    <div>
                      <label
                        htmlFor="responsibility-input"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Roles & Responsibilities
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="responsibility-input"
                          value={currentResponsibility}
                          onChange={(e) =>
                            setCurrentResponsibility(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddResponsibility();
                            }
                          }}
                          placeholder="Add one responsibility and press Enter or click Add"
                          className="flex-grow px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleAddResponsibility}
                          className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {jobFormData.responsibilities.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-slate-200 p-2 rounded-lg text-sm"
                          >
                            <span className="text-slate-700">{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveResponsibility(index)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <FaTimesCircle />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Requirements */}
                    <div>
                      <label
                        htmlFor="requirement-input"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Requirements
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="requirement-input"
                          value={currentRequirement}
                          onChange={(e) =>
                            setCurrentRequirement(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddRequirement();
                            }
                          }}
                          placeholder="Add one requirement and press Enter or click Add"
                          className="flex-grow px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleAddRequirement}
                          className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {jobFormData.requirements.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-slate-200 p-2 rounded-lg text-sm"
                          >
                            <span className="text-slate-700">{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRequirement(index)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <FaTimesCircle />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      disabled={isAddingJob}
                    >
                      {isAddingJob ? (
                        <FaSpinner className="animate-spin inline-block mr-2" />
                      ) : (
                        <FaPlus />
                      )}
                      {isAddingJob ? "Posting Job..." : "Post Job"}
                    </button>
                  </form>
                </div>
              )}

              {/* Job Listings Table / Cards */}
              <div className="bg-slate-50 p-4 md:p-8 rounded-2xl shadow-inner border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">
                  Existing Jobs
                </h3>
                {isJobsLoading ? (
                  <div className="text-center py-10">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
                    <p className="text-slate-500 mt-3">Loading jobs...</p>
                  </div>
                ) : isJobsError ? (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl relative">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">
                      Failed to load jobs.
                    </span>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl relative">
                    <strong className="font-bold">Info!</strong>
                    <span className="block sm:inline ml-2">No jobs found.</span>
                  </div>
                ) : (
                  <div>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {filteredJobs.map((job) => (
                        <div
                          key={job._id}
                          className="bg-white p-4 rounded-xl shadow-md border border-slate-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg text-slate-100">
                                {job.title}
                              </h4>
                              <p className="text-sm text-slate-400">
                                {job.location} 
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full whitespace-nowrap">
                              {job.timeType}
                            </span>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                            {userInfo?.role === "superAdmin" && (
                              <button
                                onClick={() => openDeleteModal("job", job._id)}
                                className="text-red-500 hover:text-red-400 transition-colors duration-200 flex items-center gap-2 text-sm"
                                title="Delete Job"
                              >
                                <FaTrash size={16} /> Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="border-b-2 border-slate-200">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Location
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Type
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/70 bg-white">
                          {filteredJobs.map((job) => (
                            <tr key={job._id} className="hover:bg-slate-100">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                {job.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {job.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {job.timeType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                {userInfo?.role === "superAdmin" && (
                                  <button
                                    onClick={() =>
                                      openDeleteModal("job", job._id)
                                    }
                                    className="text-red-500 hover:text-red-400 ml-4 transition-colors duration-200"
                                    title="Delete Job"
                                  >
                                    <FaTrash size={18} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Blog Management Section */}
          {activeTab === "blogs" && (
            <section className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
                Blog Management
              </h2>

              {/* Button to show/hide Blog Creation Form */}
              <button
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2 mb-6 transform hover:-translate-y-0.5"
              >
                {showBlogForm ? "Hide Blog Form" : "Create New Blog Post"}
              </button>

              {/* Blog Creation/Edit Form */}
              {showBlogForm && (
                <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-inner mb-10 border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">
                    {isEditingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                  </h3>
                  <form onSubmit={handleBlogSubmit} className="space-y-6">
                    {/* Blog Title */}
                    <div>
                      <label
                        htmlFor="blogTitle"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Blog Title
                      </label>
                      <input
                        type="text"
                        id="blogTitle"
                        name="blogTitle"
                        value={blogData.blogTitle}
                        onChange={handleBlogChange}
                        placeholder="Enter blog title"
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                    </div>

                    {/* Blog Author */}
                    <div>
                      <label
                        htmlFor="blogAuthor"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Author
                      </label>
                      <input
                        type="text"
                        id="blogAuthor"
                        name="blogAuthor"
                        value={blogData.blogAuthor}
                        onChange={handleBlogChange}
                        placeholder="Enter author name"
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                    </div>

                    {/* Hero Image Upload */}
                    <div>
                      <label
                        htmlFor="blog-hero-image-input"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Featured Image
                      </label>
                      <input
                        type="file"
                        id="blog-hero-image-input"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="block w-full text-sm text-slate-500 border border-slate-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                      />
                      {(heroImagePreview || blogData.imageUrl) && (
                        <div className="mt-4 w-48 h-32 relative group">
                          <img
                            src={heroImagePreview || blogData.imageUrl}
                            alt="Hero Preview"
                            className="w-full h-full object-cover rounded-lg border border-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setHeroImagePreview(null);
                              setHeroImageFile(null);
                              setExistingImageId(null);
                              const fileInput = document.getElementById(
                                "blog-hero-image-input"
                              );
                              if (fileInput) fileInput.value = "";
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Remove image"
                          >
                            <FaTimesCircle size={16} />
                          </button>
                        </div>
                      )}
                      {isEditingBlog &&
                        !heroImagePreview &&
                        !blogData.imageUrl && ( // This condition seems wrong, but keeping it as is.
                          <p className="text-sm text-yellow-400 mt-2">
                            No new image selected, existing image will be kept.
                            If you want to remove it, upload a new one.
                          </p>
                        )}
                    </div>

                    {/* Tags Input */}
                    <div>
                      <label
                        htmlFor="blogTags"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Tags (Press Enter or comma to add)
                      </label>
                      <input
                        type="text"
                        id="blogTags"
                        value={currentTagInput} // Bind to new state
                        onChange={handleCurrentTagInputChange} // Update new state
                        onKeyDown={handleAddTag} // Use new handler
                        placeholder="e.g., technology, AI, programming"
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {blogData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                              title="Remove tag"
                            >
                              <FaTimesCircle size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Highlights Section */}
                    <div>
                      <label
                        htmlFor="keyHighlightsTitle"
                        className="block text-sm font-medium text-slate-600 mb-2"
                      >
                        Key Highlights Section Title
                      </label>
                      <input
                        type="text"
                        id="keyHighlightsTitle"
                        name="keyHighlightsTitle"
                        value={blogData.keyHighlightsTitle}
                        onChange={handleBlogChange}
                        placeholder="e.g., What you'll learn in this blog"
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                      <label className="block text-sm font-medium text-slate-600 mt-3 mb-2">
                        Key Highlights (Press Enter to add)
                      </label>
                      <input
                        type="text"
                        id="keyHighlight"
                        onKeyDown={handleAddHighlight}
                        placeholder="e.g., Understand React Hooks"
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                      <ul className="mt-3 space-y-2">
                        {blogData.keyHighlights.map((highlight, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-slate-200 p-3 rounded-lg"
                          >
                            <span className="text-slate-700 text-sm">
                              {highlight}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveHighlight(highlight)}
                              className="text-red-500 hover:text-red-400"
                              title="Remove highlight"
                            >
                              <FaTimesCircle size={18} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Content Blocks Section */}
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-4">
                        Blog Content
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => addContentBlock("paragraph")}
                          className="px-3 py-2 bg-green-600/80 text-white rounded-md hover:bg-green-600 transition-all duration-200 text-sm flex items-center gap-1 transform hover:-translate-y-0.5"
                        >
                          <FaPlus /> Paragraph
                        </button>
                        <button
                          type="button"
                          onClick={() => addContentBlock("heading")}
                          className="px-3 py-2 bg-yellow-600/80 text-white rounded-md hover:bg-yellow-600 transition-all duration-200 text-sm flex items-center gap-1 transform hover:-translate-y-0.5"
                        >
                          <FaPlus /> Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => addContentBlock("image")}
                          className="px-3 py-2 bg-purple-600/80 text-white rounded-md hover:bg-purple-600 transition-all duration-200 text-sm flex items-center gap-1 transform hover:-translate-y-0.5"
                        >
                          <FaPlus /> Image
                        </button>
                        <button
                          type="button"
                          onClick={() => addContentBlock("quote")}
                          className="px-3 py-2 bg-indigo-600/80 text-white rounded-md hover:bg-indigo-600 transition-all duration-200 text-sm flex items-center gap-1 transform hover:-translate-y-0.5"
                        >
                          <FaPlus /> Quote
                        </button>
                      </div>

                      <div className="space-y-6">
                        {blogData.contentBlocks.map((block, index) => (
                          <div
                            key={block.id}
                            className="p-4 border border-slate-300 rounded-lg bg-slate-100 relative group"
                          >
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    moveContentBlock(block.id, "up")
                                  }
                                  className="p-1 bg-slate-300 rounded-full hover:bg-slate-400 text-slate-700"
                                  title="Move up"
                                >
                                  <FaArrowUp size={14} />
                                </button>
                              )}
                              {index < blogData.contentBlocks.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    moveContentBlock(block.id, "down")
                                  }
                                  className="p-1 bg-slate-300 rounded-full hover:bg-slate-400 text-slate-700"
                                  title="Move down"
                                >
                                  <FaArrowDown size={14} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeContentBlock(block.id)}
                                className="p-1 bg-red-600 text-white rounded-full hover:bg-red-500"
                                title="Remove block"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>

                            {block.type === "paragraph" && (
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                  Paragraph Content
                                </label>
                                <textarea
                                  value={block.text}
                                  onChange={(e) =>
                                    updateContentBlock(
                                      block.id,
                                      "text",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter paragraph text"
                                  rows="4"
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                                ></textarea>
                              </div>
                            )}

                            {block.type === "heading" && (
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                  Heading Text
                                </label>
                                <input
                                  type="text"
                                  value={block.text}
                                  onChange={(e) =>
                                    updateContentBlock(
                                      block.id,
                                      "text",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter heading text"
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                                />
                                <label className="block text-sm font-medium text-slate-600 mt-3 mb-2">
                                  Heading Level
                                </label>
                                <select
                                  value={block.level}
                                  onChange={(e) =>
                                    updateContentBlock(
                                      block.id,
                                      "level",
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                                >
                                  <option value={1}>H1</option>
                                  <option value={2}>H2</option>
                                  <option value={3}>H3</option>
                                  <option value={4}>H4</option>
                                  <option value={5}>H5</option>
                                  <option value={6}>H6</option>
                                </select>
                              </div>
                            )}

                            {block.type === "image" && (
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                  Image File
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleContentBlockFileChange(block.id, e)
                                  }
                                  className="block w-full text-sm text-slate-500 border border-slate-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                />
                                {block.url && (
                                  <div className="mt-4 w-48 h-32">
                                    <img
                                      src={block.url}
                                      alt="Block Preview"
                                      className="w-full h-full object-cover rounded-lg border border-slate-300"
                                    />
                                  </div>
                                )}
                                <label className="block text-sm font-medium text-slate-600 mt-3 mb-2">
                                  Caption (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={block.caption}
                                  onChange={(e) =>
                                    updateContentBlock(
                                      block.id,
                                      "caption",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter image caption"
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                                />
                              </div>
                            )}

                            {block.type === "quote" && (
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                  Quote Text
                                </label>
                                <textarea
                                  value={block.text}
                                  onChange={(e) =>
                                    updateContentBlock(
                                      block.id,
                                      "text",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter quote text"
                                  rows="3"
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                                ></textarea>
                                <label className="block text-sm font-medium text-slate-600 mt-3 mb-2">
                                  Quote Author (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={block.author}
                                  onChange={(e) =>
                                    updateContentBlock(
                                      block.id,
                                      "author",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter quote author"
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      {isEditingBlog && (
                        <button
                          type="button"
                          onClick={resetBlogForm}
                          className="px-6 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition duration-200"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        disabled={isAddingBlog || isUpdatingBlog}
                      >
                        {isAddingBlog || isUpdatingBlog ? (
                          <FaSpinner className="animate-spin inline-block mr-2" />
                        ) : isEditingBlog ? (
                          "Update Blog"
                        ) : (
                          "Publish Blog"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Blog Listings Table */}
              <div className="bg-slate-50 p-4 md:p-8 rounded-2xl shadow-inner border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">
                  Existing Blog Posts
                </h3>
                {isBlogsLoading ? (
                  <div className="text-center py-10">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
                    <p className="text-slate-500 mt-3">Loading blog posts...</p>
                  </div>
                ) : isBlogsError ? (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl relative">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">
                      Failed to load blog posts.
                    </span>
                  </div>
                ) : filteredBlogPosts.length === 0 ? (
                  <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl relative">
                    <strong className="font-bold">Info!</strong>
                    <span className="block sm:inline ml-2">
                      No blog posts found.
                    </span>
                  </div>
                ) : (
                  <div>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {filteredBlogPosts.map((blog) => (
                        <div
                          key={blog._id}
                          className="bg-white p-4 rounded-xl shadow-md border border-slate-200"
                        >
                          <h4 className="font-bold text-lg text-slate-100">
                            {blog.title}
                          </h4>
                          <p className="text-sm text-slate-400">
                            by {blog.author}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end items-center gap-4">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 text-sm"
                              title="Edit Blog"
                            >
                              <FaPen size={16} /> Edit
                            </button>
                            {userInfo?.role === "superAdmin" && (
                              <button
                                onClick={() =>
                                  openDeleteModal("blog", blog._id)
                                }
                                className="text-red-500 hover:text-red-400 transition-colors duration-200 flex items-center gap-2 text-sm"
                                title="Delete Blog"
                              >
                                <FaTrash size={16} /> Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="border-b-2 border-slate-200">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Author
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/70 bg-white">
                          {filteredBlogPosts.map((blog) => (
                            <tr key={blog._id} className="hover:bg-slate-100">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                {blog.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {blog.author}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right flex justify-end items-center gap-2">
                                <button
                                  onClick={() => handleEditBlog(blog)}
                                  className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-all duration-200"
                                  title="Edit Blog"
                                >
                                  <FaPen size={16} />
                                </button>
                                {userInfo?.role === "superAdmin" && (
                                  <button
                                    onClick={() =>
                                      openDeleteModal("blog", blog._id)
                                    }
                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-all duration-200"
                                    title="Delete Blog"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Contact Management Section */}
          {activeTab === "contact" && (
            <section className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
                Contact Inquiries
              </h2>

              {/* Filtering and Sorting for Inquiries */}
              <div className="bg-slate-50 p-4 md:p-6 rounded-2xl shadow-inner mb-10 border border-slate-200 flex flex-col sm:flex-row flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="inquiryFilter"
                    className="text-slate-600 font-medium text-sm"
                  >
                    Status:
                  </label>
                  <select
                    id="inquiryFilter"
                    value={inquiryFilter}
                    onChange={(e) => setInquiryFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="inquirySortBy"
                    className="text-slate-600 font-medium text-sm"
                  >
                    Sort by:
                  </label>
                  <select
                    id="inquirySortBy"
                    value={inquirySortBy}
                    onChange={(e) => setInquirySortBy(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 text-sm"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                <button
                  onClick={handleDownloadExcel}
                  className="w-full sm:w-auto sm:ml-auto px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-green-600/40"
                >
                  <FaFileDownload /> Export to Excel
                </button>
              </div>

              {/* Inquiry Listings Table */}
              <div className="bg-slate-50 p-4 md:p-8 rounded-2xl shadow-inner border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">
                  All Inquiries
                </h3>
                {isInquiriesLoading ? (
                  <div className="text-center py-10">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
                    <p className="text-slate-500 mt-3">Loading inquiries...</p>
                  </div>
                ) : isInquiriesError ? (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl relative">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">
                      Failed to load inquiries.
                    </span>
                  </div>
                ) : sortedInquiries.length === 0 ? (
                  <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl relative">
                    <strong className="font-bold">Info!</strong>
                    <span className="block sm:inline ml-2">
                      No inquiries found matching your criteria.
                    </span>
                  </div>
                ) : (
                  <div>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {sortedInquiries.map((inquiry) => (
                        <div
                          key={inquiry._id}
                          className="bg-white p-4 rounded-xl shadow-md border border-slate-200"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-bold text-lg text-slate-100">
                                {inquiry.name}
                              </h4>
                              <p className="text-sm text-slate-400 break-all">
                                {inquiry.email}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap capitalize ${
                                inquiry.status === "read"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {inquiry.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(inquiry.createdAt).toLocaleString()}
                          </p>
                          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end items-center gap-3 flex-wrap">
                            <button
                              onClick={() => handleViewInquiry(inquiry)}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleReadStatus(
                                  inquiry._id,
                                  inquiry.status
                                )
                              }
                              className={`ml-4 ${
                                inquiry.status === "read"
                                  ? "text-yellow-500 hover:text-yellow-400"
                                  : "text-green-500 hover:text-green-400"
                              } transition-colors duration-200`}
                              title={
                                inquiry.status === "read"
                                  ? "Mark as Unread"
                                  : "Mark as Read"
                              }
                            >
                              {inquiry.status === "read" ? (
                                <FaTimesCircle size={18} />
                              ) : (
                                <FaCheckCircle size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => handleForwardInquiryClick(inquiry)}
                              className="text-purple-400 hover:text-purple-300 transition-colors duration-200 ml-4"
                              title="Forward Inquiry"
                            >
                              <FaReply size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="border-b-2 border-slate-200">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Message
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/70 bg-white">
                          {sortedInquiries.map((inquiry) => (
                            <tr key={inquiry._id} className="hover:bg-slate-100">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                {inquiry.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {inquiry.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 max-w-xs truncate">
                                {inquiry.message.length > 50
                                  ? `${inquiry.message.substring(0, 50)}...`
                                  : inquiry.message}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {new Date(
                                  inquiry.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                    inquiry.status === "read"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {inquiry.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right flex justify-end items-center gap-2">
                                <button
                                  onClick={() => handleViewInquiry(inquiry)}
                                  className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-all duration-200"
                                  title="View Details"
                                >
                                  <FaEye size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleToggleReadStatus(
                                      inquiry._id,
                                      inquiry.status
                                    )
                                  }
                                  className={`p-2 rounded-full transition-all duration-200 ${
                                    inquiry.status === "read"
                                      ? "text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100"
                                      : "text-green-500 hover:text-green-700 hover:bg-green-100"
                                  }`}
                                  title={
                                    inquiry.status === "read"
                                      ? "Mark as Unread"
                                      : "Mark as Read"
                                  }
                                >
                                  {inquiry.status === "read" ? (
                                    <FaTimesCircle size={16} />
                                  ) : (
                                    <FaCheckCircle size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleForwardInquiryClick(inquiry)
                                  }
                                  className="text-purple-500 hover:text-purple-700 p-2 rounded-full hover:bg-purple-100 transition-all duration-200"
                                  title="Forward Inquiry"
                                >
                                  <FaReply size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Products Section - Add your content here */}
          {activeTab === "products" && (
            <section className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
                Products Coming Soon!
              </h2>
              <p className="text-lg text-slate-500">
                We're actively working on bringing you exciting features for
                product management. Stay tuned!
              </p>
              <div className="mt-8">
                <FaBoxOpen className="mx-auto text-blue-500/20" size={100} />
              </div>
            </section>
          )}
          {/* User Management Section */}
          {activeTab === "users" && userInfo?.role === "superAdmin" && (
            <section className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
                User Management
              </h2>

              {/* Invite User Form */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-inner mb-10 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">
                  Invite New Admin
                </h3>
                <form
                  onSubmit={handleInviteAdmin}
                  className="space-y-6"
                >
                  {/* Grid container for inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* User Name Input */}
                    <div className="lg:col-span-1">
                      <label htmlFor="inviteName" className="block text-sm font-medium text-slate-600 mb-2">
                        User Name
                      </label>
                      <input
                        type="text"
                        id="inviteName"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="Enter user's full name"
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                    </div>

                    {/* User Email Input */}
                    <div className="lg:col-span-1">
                      <label htmlFor="inviteEmail" className="block text-sm font-medium text-slate-600 mb-2">
                        User Email
                      </label>
                      <input
                        type="email"
                        id="inviteEmail"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Enter user's email"
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                    </div>

                    {/* Set Password Input */}
                    <div className="lg:col-span-1">
                      <label htmlFor="invitePassword" className="block text-sm font-medium text-slate-600 mb-2">
                        Set Initial Password
                      </label>
                      <input
                        type="password"
                        id="invitePassword"
                        value={invitePassword}
                        onChange={(e) => setInvitePassword(e.target.value)}
                        placeholder="Enter a secure password"
                        required
                        minLength="6"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      />
                    </div>
                    
                    {/* NEW: Role Selection Dropdown */}
                    <div className="lg:col-span-1">
                      <label htmlFor="inviteRole" className="block text-sm font-medium text-slate-600 mb-2">
                        Role
                      </label>
                      <select
                        id="inviteRole"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-800"
                      >
                        <option value="admin">Admin</option>
                        <option value="superAdmin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      disabled={isInvitingAdmin}
                    >
                      {isInvitingAdmin ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaUserPlus />
                      )}
                      {isInvitingAdmin ? "Creating..." : "Create Admin"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Users Table */}
              <div className="bg-slate-50 p-4 md:p-8 rounded-2xl shadow-inner border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Existing Admins
                  </h3>
                  <span className="text-sm font-semibold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                    {admins.length} {admins.length === 1 ? "User" : "Users"}
                  </span>
                </div>
                {isAdminLoading ? (
                  <div className="text-center py-10">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
                    <p className="text-slate-500 mt-3">Loading users...</p>
                  </div>
                ) : isAdminError ? (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl relative">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">
                      Failed to load users.
                    </span>
                  </div>
                ) : filteredAdmins.length === 0 ? (
                  <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl relative">
                    <strong className="font-bold">Info!</strong>
                    <span className="block sm:inline ml-2">No users found.</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="border-b-2 border-slate-200">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
                          <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/70 bg-white">
                        {filteredAdmins.map((admin) => (
                          <tr key={admin._id} className="hover:bg-slate-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-4">
                              <img src={getAvatarUrl(admin.name || admin.email, 40)} alt={`${admin.name || admin.email}'s avatar`} className="w-10 h-10 rounded-full object-cover" />
                              <p className="font-bold text-slate-800">{admin.name || admin.email}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {/* Only show email here if a name exists to avoid duplication */}
                              {admin.name ? admin.email : '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${admin.role === 'superAdmin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {admin.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {admin.status || 'active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {admin.lastActive ? timeSince(admin.lastActive) : 'Never'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                              {admin._id !== userInfo._id && ( // Can't edit self
                                <div className="flex justify-end items-center gap-2">
                                  <button
                                    onClick={() => handleUpdateRole(admin._id, admin.role === 'superAdmin' ? 'admin' : 'superAdmin')}
                                    disabled={isUpdatingAdminRole || isUpdatingAdminStatus}
                                    className={`p-2 rounded-full transition-all duration-200 ${admin.role === 'superAdmin' ? 'text-yellow-500 hover:bg-yellow-100' : 'text-green-500 hover:bg-green-100'}`}
                                    title={admin.role === 'superAdmin' ? 'Demote to Admin' : 'Promote to Super Admin'}
                                  >
                                    <FaUserShield size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(admin._id, admin.status || 'active')}
                                    disabled={isUpdatingAdminRole || isUpdatingAdminStatus}
                                    className={`p-2 rounded-full transition-all duration-200 ${(admin.status || 'active') === 'active' ? 'text-red-500 hover:bg-red-100' : 'text-green-500 hover:bg-green-100'}`}
                                    title={(admin.status || 'active') === 'active' ? 'Suspend User' : 'Activate User'}
                                  >
                                    {(admin.status || 'active') === 'active' ? <FaUserSlash size={18} /> : <FaUserCheck size={18} />}
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal('user', admin._id)}
                                    disabled={isDeletingAdmin || isUpdatingAdminStatus}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-all duration-200"
                                    title="Delete User"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
          {activeTab === 'users' && userInfo?.role !== 'superAdmin' && (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8">
                  <FaExclamationCircle className="mx-auto text-red-500/50" size={80} />
                  <h2 className="text-3xl font-extrabold text-slate-900 mt-6 mb-4">Access Denied</h2>
                  <p className="text-lg text-slate-500">You do not have permission to view or manage users.</p>
              </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title={
          modalType === "job"
            ? "Confirm Job Deletion"
            : modalType === "blog"
            ? "Confirm Blog Deletion"
            : "Confirm User Deletion"
        }
        message={
          modalType === "job"
            ? "Are you sure you want to delete this job? This action cannot be undone."
            : modalType === "blog"
            ? "Are you sure you want to delete this blog post? This action cannot be undone."
            : "Are you sure you want to delete this user? This will revoke their access permanently."
        }
        isLoading={isDeletingJob || isDeletingBlog || isDeletingAdmin}
      />

      <InquiryDetailModal
        isOpen={isInquiryDetailModalOpen}
        onClose={() => setIsInquiryDetailModalOpen(false)}
        inquiry={selectedInquiry}
        onForwardClick={handleForwardInquiryClick}
        onAddNoteClick={handleAddNoteClick} // Pass the handler
      />

      <ForwardInquiryModal
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        onConfirm={confirmForwardInquiry}
        isLoading={isForwardingInquiry}
        forwardEmail={forwardEmail}
        setForwardEmail={setForwardEmail}
      />

      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onConfirm={confirmAddNote}
        isLoading={isAddingInquiryNote}
        inquiryId={selectedInquiryForNote}
      />
    </div>
  );
};

export default AdminPanel;