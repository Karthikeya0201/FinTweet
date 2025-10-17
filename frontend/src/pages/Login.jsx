import React, { useState, useEffect } from 'react';
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ====== Google OAuth Setup ======
  useEffect(() => {
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "179697965717-5f5n39r2i4g2nlh8scq736pd2kjdk85c.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    try {
      // Decode the Google JWT
      const userObject = jwtDecode(response.credential);
      console.log("Decoded Google JWT:", userObject);

      // Extract user email
      const { email } = userObject;

      // Send email to backend /login endpoint
      const backendResponse = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: "" // Include empty password for Google login
        }),
      });

      const backendData = await backendResponse.json();

      if (!backendResponse.ok) {
        if (backendResponse.status === 401) {
          throw new Error(backendData.detail || 'Invalid email. Please register first.');
        } else if (backendResponse.status === 422) {
          throw new Error('Invalid request format. Please try again.');
        } else {
          throw new Error(backendData.detail || 'Failed to sign in with Google');
        }
      }

      // Store the JWT token
      localStorage.setItem('token', backendData.access_token);
      alert(`Signed in with Google successfully!\nEmail: ${email}`);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      setErrors({ general: error.message || 'Failed to process Google sign-in. Please try again or register first.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    if (provider === 'Google') {
      // Google button is handled by Google's SDK
      setIsLoading(false);
    } else if (provider === 'Twitter') {
      setTimeout(() => {
        setIsLoading(false);
        alert(`Login with ${provider} initiated! (Not implemented)`);
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) {
      setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(data.detail || 'Invalid email or password');
        } else if (response.status === 422) {
          throw new Error('Invalid request format. Please try again.');
        } else {
          throw new Error(data.detail || 'Login failed');
        }
      }

      // Store the JWT token
      localStorage.setItem('token', data.access_token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: error.message || 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="hidden md:block space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FinTweet
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Welcome Back to Smart Trading
          </h1>
          <p className="text-xl text-gray-300">
            Access AI-powered stock predictions with 87.6% accuracy. Make informed decisions with real-time sentiment analysis.
          </p>
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Real-time Twitter sentiment analysis</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>AI-driven trading signals</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Personalized portfolio tracking</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-gray-400">Enter your credentials to access your account</p>
          </div>

          {errors.general && (
            <div className="flex items-center gap-2 mb-4 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div id="googleSignInDiv"></div>

            <button
              onClick={() => handleOAuthLogin('Twitter')}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Continue with Twitter
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-slate-800/50 border ${
                    errors.email ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-slate-800/50 border ${
                    errors.password ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}