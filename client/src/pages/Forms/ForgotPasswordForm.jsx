import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// NOTE: This is a placeholder for your actual forgot password mutation hook.
// You should replace this with your own implementation from RTK Query or another library.
const useForgotPasswordMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const forgotPassword = async ({ email }) => {
    setIsLoading(true);
    // Simulate an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (email.includes('@')) {
          resolve({ data: { message: 'Password reset link sent to your email.' } });
        } else {
          reject({ data: { message: 'Could not find an account with that email.' } });
        }
      }, 1500);
    });
  };
  return [forgotPassword, { isLoading }];
};

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      toast.success('If an account exists for this email, a reset link has been sent.');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const MailIcon = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl ring-1 ring-gray-900/5"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-gray-600">
            No worries, we'll send you reset instructions.
          </p>
        </motion.div>

        <motion.form variants={itemVariants} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#3B38A0] sm:text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <motion.div variants={itemVariants} className="flex items-center justify-end">
            <div className="text-sm">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Back to Login
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#1a2a80] hover:bg-[#4c49c3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#3B38A0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </motion.div>
        </motion.form>
        
        <motion.p variants={itemVariants} className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-white hover:text-indigo-500">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;