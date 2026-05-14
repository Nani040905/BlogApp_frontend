import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../stores/authStore';
import { useNavigate, NavLink } from 'react-router';
import toast from 'react-hot-toast';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useAuth((state) => state.login);
  const loading = useAuth((state) => state.loading);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard immediately
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const dashboardPath = currentUser.role === 'USER' ? '/user-dashboard' 
                         : currentUser.role === 'AUTHOR' ? '/author-dashboard' 
                         : '/admin-dashboard';
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const onLoginSubmit = async (userCredentials) => {
    try {
      await login(userCredentials);
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <NavLink to="/" className="inline-block mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
              B
            </div>
          </NavLink>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } })}
                className={`input-field ${errors.email ? 'border-red-500 ring-red-500/10' : ''}`}
                placeholder="name@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <NavLink to="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</NavLink>
              </div>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className={`input-field ${errors.password ? 'border-red-500 ring-red-500/10' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <NavLink to="/register" className="font-bold text-primary hover:underline">
                Create an account
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;