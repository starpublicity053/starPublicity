import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../features/auth/userApi'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('An OTP has been sent to your email address.');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !password) {
      toast.error('Please enter the OTP and your new password.');
      return;
    }
    try {
      await resetPassword({ otp, password }).unwrap();
      toast.success('Password has been reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to reset password. OTP may be invalid or expired.');
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

  const KeyIcon = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  );

  const LockIcon = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl ring-1 ring-gray-900/5"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {otpSent ? 'Reset Your Password' : 'Forgot Password'}
          </h2>
          <p className="text-gray-600 mt-2">
            {otpSent
              ? 'Enter the OTP from your email and a new password.'
              : "Enter your email and we'll send you an OTP to reset your password."}
          </p>
        </motion.div>

        {!otpSent ? (
          <motion.form variants={itemVariants} onSubmit={handleRequestOtp} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#3B38A0] sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <button
              type="submit"
              disabled={isSendingOtp}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#3B38A0] hover:bg-[#4c49c3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#3B38A0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingOtp ? 'Sending...' : 'Send OTP'}
            </button>
          </motion.form>
        ) : (
          <motion.form variants={itemVariants} onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input id="otp" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="appearance-none rounded-lg relative block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#3B38A0] sm:text-sm" placeholder="Enter OTP" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input id="password" name="password" type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none rounded-lg relative block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#3B38A0] sm:text-sm" placeholder="New Password" />
            </div>
            <button type="submit" disabled={isResetting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#3B38A0] hover:bg-[#4c49c3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#3B38A0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isResetting ? 'Resetting...' : 'Reset Password'}
            </button>
          </motion.form>
        )}
        <motion.div variants={itemVariants} className="text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            &larr; Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordForm;