// src/pages/Signup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle, User, Check, Plus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

// Configure axios
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    portfolio: [{ company: '', quantity: '', purchaseDate: '' }],
    useToday: true,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [companies, setCompanies] = useState([]);

  // Fetch companies
  useEffect(() => {
    axios
      .get('/companies')
      .then((res) => {
        console.log('Fetched companies:', res.data);
        if (Array.isArray(res.data)) {
          setCompanies(res.data);
        } else if (res.data.companies && Array.isArray(res.data.companies)) {
          setCompanies(res.data.companies);
        } else {
          console.log('Unexpected response format:', res.data);
          setCompanies([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch companies:', err);
        setCompanies([]);
      });
  }, []);

  // Google OAuth Setup
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: '179697965717-5f5n39r2i4g2nlh8scq736pd2kjdk85c.apps.googleusercontent.com',
        callback: handleGoogleResponse,
      });
      google.accounts.id.renderButton(document.getElementById('googleSignUpDiv'), {
        theme: 'outline',
        size: 'large',
        width: '100%',
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const userObject = jwtDecode(response.credential);
      console.log('Google user:', userObject);
      const payload = {
        username: userObject.name,
        email: userObject.email,
        portfolio: [],
        useToday: true,
      };
      console.log('Submitting Google signup payload:', payload);
      const res = await axios.post('/register', payload);
      console.log('Registration response:', res.data);
      alert('Signed up with Google successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google signup error:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        alert(`Error: ${err.response.data.detail}`);
      } else {
        alert('Error signing up with Google');
      }
    }
  };

  const handleChange = (e, index = null) => {
    const { name, value, type, checked } = e.target;
    if (name === 'useToday') {
      setForm((prev) => ({
        ...prev,
        useToday: checked,
        portfolio: checked
          ? prev.portfolio.map((item) => ({
              ...item,
              purchaseDate: new Date().toISOString().split('T')[0],
            }))
          : prev.portfolio,
      }));
    } else if (['company', 'quantity', 'purchaseDate'].includes(name)) {
      setForm((prev) => {
        const updatedPortfolio = [...prev.portfolio];
        updatedPortfolio[index] = {
          ...updatedPortfolio[index],
          [name]: type === 'number' ? Number(value) : value,
        };
        return { ...prev, portfolio: updatedPortfolio };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name] || errors[`portfolio[${index}].${name}`]) {
      setErrors((prev) => ({ ...prev, [name]: '', [`portfolio[${index}].${name}`]: '' }));
    }
  };

  const addPortfolioItem = () => {
    setForm((prev) => ({
      ...prev,
      portfolio: [
        ...prev.portfolio,
        {
          company: '',
          quantity: 0,
          purchaseDate: prev.useToday ? new Date().toISOString().split('T')[0] : '',
        },
      ],
    }));
  };

  const removePortfolioItem = (index) => {
    if (form.portfolio.length > 1) {
      setForm((prev) => ({
        ...prev,
        portfolio: prev.portfolio.filter((_, i) => i !== index),
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const { confirmPassword, ...payload } = form;
      console.log('Submitting email signup payload:', payload);
      const res = await axios.post('/register', payload);
      console.log('Registration response:', res.data);
      alert('Registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        alert(`Error: ${err.response.data.detail}`);
      } else {
        alert('Error submitting form');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const pwd = form.password;
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Section */}
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
            Start Your Investment Journey
          </h1>
          <p className="text-xl text-gray-300">
            Join thousands of investors using AI-powered sentiment analysis to make smarter trading decisions.
          </p>
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <span>87.6% prediction accuracy</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Check className="w-4 h-4 text-purple-400" />
              </div>
              <span>Real-time market insights</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="bg-pink-500/20 p-2 rounded-full">
                <Check className="w-4 h-4 text-pink-400" />
              </div>
              <span>Free 30-day trial included</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Start trading smarter with AI insights</p>
          </div>

          <div className="space-y-3 mb-6">
            <div id="googleSignUpDiv"></div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-gray-400">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Username"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
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
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password strength</span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.label === 'Weak'
                          ? 'text-red-400'
                          : passwordStrength.label === 'Fair'
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-slate-800/50 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Portfolio Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Portfolio</h3>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  name="useToday"
                  checked={form.useToday}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Use today's date for all purchases</span>
              </label>

              {form.portfolio.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4 p-4 bg-slate-800/30 rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                    <select
                      name="company"
                      value={item.company}
                      onChange={(e) => handleChange(e, idx)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select Company</option>
                      {companies.map((c) => (
                        <option key={c.ticker} value={c.ticker}>
                          {c.name} ({c.ticker})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleChange(e, idx)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={item.purchaseDate}
                      onChange={(e) => handleChange(e, idx)}
                      className="w-full bg-slate-800/50 border calendar-white border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                      disabled={form.useToday}
                    />
                  </div>
                  {form.portfolio.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePortfolioItem(idx)}
                      className="md:col-span-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addPortfolioItem}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add Another Company
              </button>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: '' }));
                    }
                  }}
                  className="w-5 h-5 mt-0.5 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
