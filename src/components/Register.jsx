import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../stores/authStore';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const { isAuthenticated, currentUser } = useAuth();

  // If already authenticated, redirect to dashboard immediately
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const dashboardPath = currentUser.role === 'USER' ? '/user-dashboard' 
                         : currentUser.role === 'AUTHOR' ? '/author-dashboard' 
                         : '/admin-dashboard';
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const onSubmit = async (newUser) => {
    setLoading(true);
    const formData = new FormData();
    let { role, profileImageUrl, ...userObj } = newUser;

    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    
    if (profileImageUrl && profileImageUrl[0]) {
      formData.append("profileImageUrl", profileImageUrl[0]);
    }

    try {
      if (role === "USER") {
        await api.post(`/user-api/users`, formData);
        toast.success("Account created! You can now login.");
        navigate('/login');
      } else if (role === "AUTHOR") {
        await api.post(`/author-api/users`, formData);
        toast.success("Author account created! You can now login.");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const onSelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPG or PNG allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <NavLink to="/" className="inline-block mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
              B
            </div>
          </NavLink>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-slate-500 mt-2">Join our community of writers and readers</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  {...register("firstName", { required: "First name is required", minLength: 2 })}
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName.message}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="input-field"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    {...register("profileImageUrl")}
                    onChange={onSelectImage}
                  />
                </div>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>

                  </div>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Join as a</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" value="USER" {...register("role", { required: "Role is required" })} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">Reader</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" value="AUTHOR" {...register("role", { required: "Role is required" })} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">Writer</span>
                </label>
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-2 font-medium">{errors.role.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <NavLink to="/login" className="font-bold text-primary hover:underline">
                Sign in instead
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}