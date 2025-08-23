import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../features/auth/userApi";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const ForgotPasswordForm = () => {
  const [feedback, setFeedback] = useState({ message: "", isError: false });
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setFeedback({ message: "", isError: false });
    try {
      const response = await forgotPassword(data).unwrap();
      setFeedback({ message: response.message, isError: false });
    } catch (err) {
      // To prevent user enumeration, show a generic success message even on failure.
      setFeedback({
        message: err.data?.message || "If an account with that email exists, an OTP has been sent.",
        isError: false, // Always show as success on the frontend for security
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
        <p className="text-sm text-center text-gray-600">
          Enter your email, and we'll send you an OTP to reset your password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          {feedback.message && (
            <p className={`text-sm text-center ${feedback.isError ? 'text-red-600' : 'text-green-600'}`}>
              {feedback.message}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Remembered your password?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;