import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, BarChart3, Shield, Zap, Globe, MessageSquare, FileText, Bell, ChevronRight, Twitter, Check, Star } from 'lucide-react';
import Image1 from '../assets/image.png';
export default function Main() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real-Time Sentiment Dashboard",
      description: "Live Twitter sentiment updates using Python AI models (VADER/TextBlob)"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Personalized Portfolio Tracker",
      description: "Add stock holdings, receive AI-driven profit/loss predictions"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "News & Earnings Analysis",
      description: "Predictive stock impact using advanced AI models"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Chatbot for Investors",
      description: "Interactive chatbot powered by Gemini AI with Google OAuth"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Automated Report Generation",
      description: "Download personalized market reports instantly"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Driven Trading Signals",
      description: "Buy, hold, sell recommendations backed by Gemini AI"
    }
  ];

  const stats = [
    { value: "87.6%", label: "Prediction Accuracy" },
    { value: "340M+", label: "Tweets Analyzed Daily" },
    { value: "90%", label: "Latency Reduction" },
    { value: "80%", label: "Investor Adoption" }
  ];

  const innovations = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Explainable AI",
      description: "Top 5 contributing sources for each prediction"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Multi-Stock Comparison",
      description: "Analyze 10+ stocks simultaneously"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Interactive Chatbot",
      description: "Natural language queries with instant answers"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Custom Alerts",
      description: "100% portfolio tracking with risk alerts"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Insights",
      description: "Buy/Hold/Sell signals in seconds"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Source Sentiment",
      description: "Twitter, influencer, and news integration"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-lg shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FinTweet</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#innovations" className="hover:text-blue-400 transition">Innovations</a>
            <a href="#tech" className="hover:text-blue-400 transition">Technology</a>
            <a href="/login"><button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
              Get Started
            </button></a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/30">
                  AI-Powered Stock Forecasting
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Mining Tweets to
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Forecast </span>
                Stock Movements
              </h1>
              <p className="text-xl text-gray-300">
                Harness the power of social sentiment with MERN + AI. Predict market movements with 87.6% accuracy using real-time Twitter analysis.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/login"><button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2">
                  Start Predicting <ChevronRight className="w-5 h-5" />
                </button></a>
                <button className="border border-blue-500/50 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-500/10 transition-all">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-2xl ml-auto w-100 border border-blue-500/30 backdrop-blur-sm">
                <img src={Image1} alt="Description" className="w-100 h-100 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">The Problem</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Financial markets are deeply influenced by public sentiment, with platforms like Twitter shaping investor behavior in real-time. Traditional forecasting systems ignore social media mood, resulting in less accurate and delayed predictions.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-red-400">Challenge 1</h3>
              <p className="text-gray-300">Capturing real-time market sentiment is hard with traditional tools</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-orange-400">Challenge 2</h3>
              <p className="text-gray-300">Social sentiment and stock data remain separately analyzed</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Challenge 3</h3>
              <p className="text-gray-300">Retail investors lack institutional-grade AI insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need for intelligent stock market predictions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeFeature === idx 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105' 
                    : 'border-slate-700 hover:border-blue-500/50'
                }`}
              >
                <div className="bg-blue-500/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovations Section */}
      <section id="innovations" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Unique Innovations</h2>
            <p className="text-xl text-gray-300">What sets FinTweet apart from the competition</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {innovations.map((innovation, idx) => (
              <div key={idx} className="group">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                    {innovation.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{innovation.title}</h3>
                  <p className="text-gray-400">{innovation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-12 rounded-3xl border border-blue-500/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Trading?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of investors using AI-powered sentiment analysis to make smarter decisions
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                Start Free Trial
              </button>
              <button className="border border-blue-500/50 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-500/10 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">FinTweet</span>
            </div>
            <div className="text-center md:text-right space-y-2">
              <p className="text-gray-400">Built by Team Tristar - CBIT DSC</p>
              <p className="text-sm text-gray-500">© 2025 FinTweet. Making investment decisions smarter.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}