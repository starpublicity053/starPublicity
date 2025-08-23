import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaKey, FaLock } from 'react-icons/fa';
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

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">
            {otpSent ? 'Reset Your Password' : 'Forgot Password'}
          </h2>
          <p className="text-slate-500 mt-2">
            {otpSent
              ? 'Enter the OTP from your email and a new password.'
              : "Enter your email and we'll send you an OTP to reset your password."}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Email address"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSendingOtp ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="otp" className="sr-only">OTP</label>
              <div className="relative">
                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="otp" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Enter OTP" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="password" name="password" type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="New Password" />
              </div>
            </div>
            <button type="submit" disabled={isResetting} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-blue-400 disabled:cursor-not-allowed">
              {isResetting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        <div className="text-center">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;