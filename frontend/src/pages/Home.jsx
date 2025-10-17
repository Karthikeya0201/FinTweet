import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Brain, BarChart3, Shield, Zap, Globe, MessageSquare, FileText, Bell, ChevronRight, Twitter, Check, Star, Code } from 'lucide-react';

// --- Reusable Custom Hook for Scroll Animation ---
const useOnScreen = (ref, rootMargin = '0px') => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // We only set it to true once it enters to trigger the animation
        if (entry.isIntersecting) {
          setIntersecting(true);
          // Optional: Disconnect after first intersection
          // observer.unobserve(ref.current);
        }
      },
      { rootMargin }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, rootMargin]);

  return isIntersecting;
};
// ------------------------------------------------

// Placeholder for an imaginary image component or mock visual
const MockupVisual = () => (
  <div className="relative w-full max-w-4xl mx-auto mt-16 p-4 rounded-xl shadow-2xl bg-slate-900 border border-blue-500/30 transform transition-transform duration-1000 group-hover:scale-[1.02]">
    <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
    <div className="relative border-4 border-slate-700 rounded-lg overflow-hidden h-96 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm"></div>
      <div className="text-center p-8 z-10">
        <Twitter className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin-slow" />
        <p className="text-xl font-mono text-green-400">
          $TSLA <span className="text-red-400">Sentiment: -0.85</span> (Strong Sell)
        </p>
        <p className="text-lg text-gray-300 mt-2">
          Real-time stream of VADER analysis visualized.
        </p>
      </div>
    </div>
    <div className="flex justify-between text-sm text-gray-500 mt-2">
      <span>Data Ingestion Rate: 340M+/day</span>
      <span>AI Model: Gemini + VADER/TextBlob</span>
    </div>
  </div>
);

// Placeholder for a simple count-up animation hook
const useCountUp = (end, duration) => {
  const [count, setCount] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(1, elapsed / duration);
      // Ensure we don't start counting until the section is visible (checked in StatCard)
      if (progress < 1) {
        setCount(Math.floor(progress * end));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it hits the final value
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return count;
};


export default function Main() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Refs for Scroll Animations
  const problemRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const innovationsRef = useRef(null);
  const ctaRef = useRef(null);

  const isProblemVisible = useOnScreen(problemRef, '-100px');
  const isFeaturesVisible = useOnScreen(featuresRef, '-150px');
  const isStatsVisible = useOnScreen(statsRef, '-100px');
  const isInnovationsVisible = useOnScreen(innovationsRef, '-150px');
  const isCTAVisible = useOnScreen(ctaRef, '-100px');


  // Scroll logic for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-cycle for features section (only runs if section is visible)
  useEffect(() => {
    if (!isFeaturesVisible) return;
    
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 4000); // Slower cycle for better viewing
    return () => clearInterval(interval);
  }, [isFeaturesVisible]); // Depend on visibility


  // Data definitions (kept same)
  const features = [
    { icon: <TrendingUp className="w-6 h-6" />, title: "Real-Time Sentiment Dashboard", description: "Live Twitter sentiment updates using Python AI models (VADER/TextBlob)" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Personalized Portfolio Tracker", description: "Add stock holdings, receive AI-driven profit/loss predictions" },
    { icon: <FileText className="w-6 h-6" />, title: "News & Earnings Analysis", description: "Predictive stock impact using advanced AI models" },
    { icon: <MessageSquare className="w-6 h-6" />, title: "AI Chatbot for Investors", description: "Interactive chatbot powered by Gemini AI with Google OAuth" },
    { icon: <FileText className="w-6 h-6" />, title: "Automated Report Generation", description: "Download personalized market reports instantly" },
    { icon: <Zap className="w-6 h-6" />, title: "AI-Driven Trading Signals", description: "Buy, hold, sell recommendations backed by Gemini AI" }
  ];

  const statsData = [
    { value: 87.6, suffix: "%", label: "Prediction Accuracy", duration: 2500 },
    { value: 340, suffix: "M+", label: "Tweets Analyzed Daily", duration: 3000 },
    { value: 90, suffix: "%", label: "Latency Reduction", duration: 2000 },
    { value: 80, suffix: "%", label: "Investor Adoption", duration: 2500 }
  ];

  const innovations = [
    { icon: <Brain className="w-8 h-8" />, title: "Explainable AI (XAI)", description: "Top 5 contributing sources for each prediction, ensuring trust." },
    { icon: <BarChart3 className="w-8 h-8" />, title: "Multi-Stock Comparison", description: "Analyze 10+ stocks simultaneously with side-by-side sentiment analysis." },
    { icon: <MessageSquare className="w-8 h-8" />, title: "Interactive Gemini Chatbot", description: "Natural language queries with instant, context-aware financial answers." },
    { icon: <Bell className="w-8 h-8" />, title: "Custom Portfolio Alerts", description: "100% portfolio tracking with risk alerts based on sentiment shifts." },
    { icon: <Zap className="w-8 h-8" />, title: "Real-Time Micro-Signals", description: "Buy/Hold/Sell signals updated instantly as new tweets are analyzed." },
    { icon: <Globe className="w-8 h-8" />, title: "Multi-Source Sentiment", description: "Twitter, influencer network, and news sentiment integration for richer data." }
  ];

  // Component for an individual Stat
  const StatCard = ({ value, suffix, label, duration, index }) => {
    const displayValue = isStatsVisible ? useCountUp(value, duration) : 0;
    const finalValue = value.toString().includes('.') ? displayValue.toFixed(1) : displayValue;

    const animationClasses = isStatsVisible ? `opacity-100 translate-y-0 transition-all duration-1000 delay-${index * 200}` : 'opacity-0 translate-y-12';

    return (
      <div className={`p-6 rounded-xl border border-blue-600/20 bg-slate-900/50 transform hover:scale-105 transition-all duration-300 ${animationClasses}`}>
        <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {finalValue}{suffix}
        </p>
        <p className="mt-2 text-lg text-gray-300">{label}</p>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white overflow-hidden font-sans">
      {/* Animated Background: More subtle and defined orbits */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-orbit-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-orbit-slow delay-2000"></div>
        <div className="absolute top-0 w-full h-px bg-blue-500/20 opacity-20 animate-bg-fade"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-lg shadow-2xl shadow-blue-900/30 border-b border-blue-900/50' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-widest">FIN-TWEET</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-blue-400 transition transform hover:translate-y-[-2px]">Features</a>
            <a href="#innovations" className="hover:text-blue-400 transition transform hover:translate-y-[-2px]">Innovations</a>
            <a href="#stats" className="hover:text-blue-400 transition transform hover:translate-y-[-2px]">Impact</a>
            <a href="/login">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-full font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all transform hover:scale-105">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Always visible, animated on load (placeholder classes) */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center justify-center min-h-[90vh] group">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-8xl font-extrabold leading-tight animate-fade-in-down">
            Mining Tweets to
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Forecast{" "}
            </span>
            Stock Movements
          </h1>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto animate-fade-in-up delay-300">
            Harness the power of social sentiment with <strong className="text-blue-400">MERN + AI</strong>. Predict market movements
            with <strong className="text-blue-400 font-semibold">87.6% accuracy</strong> using real-time Twitter analysis.
          </p>

          <div className="flex flex-wrap gap-6 justify-center animate-fade-in-up delay-600">
            <a href="/login">
              <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden">
                Start Predicting <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity mix-blend-overlay"></div>
              </button>
            </a>
            <button className="border-2 border-blue-500/50 px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              View Tech Stack
            </button>
          </div>
        </div>
        
        {/* Mockup Visual - Always visible, animated on load (placeholder classes) */}
        <div className="animate-fade-in-up delay-800">
             <MockupVisual />
        </div>
      </section>

      {/* Horizontal Rule */}
      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-t border-slate-800" />
      </div>
      
      {/* Problem Statement Section - SCROLL ANIMATION ADDED */}
      <section ref={problemRef} className="py-24 px-6 bg-slate-900/30">
        <div className={`max-w-7xl mx-auto text-center space-y-6 transition-all duration-1000 ${isProblemVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">The Market Challenge</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Financial markets are deeply influenced by public sentiment, with platforms like Twitter shaping investor behavior in real-time. Traditional forecasting systems <strong className="text-red-400">ignore social media mood</strong>, resulting in less accurate and delayed predictions.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className={`bg-red-500/10 border border-red-500/30 p-8 rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-red-500/10 ${isProblemVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-12'}`}>
              <h3 className="text-2xl font-bold mb-3 text-red-400 flex items-center justify-center gap-2">Outdated Data <Shield className="w-6 h-6" /></h3>
              <p className="text-gray-300">Traditional tools can't capture real-time market sentiment.</p>
            </div>
            <div className={`bg-orange-500/10 border border-orange-500/30 p-8 rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10 ${isProblemVisible ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-12'}`}>
              <h3 className="text-2xl font-bold mb-3 text-orange-400 flex items-center justify-center gap-2">Fragmented Analysis <BarChart3 className="w-6 h-6" /></h3>
              <p className="text-gray-300">Social sentiment and stock data remain separately analyzed.</p>
            </div>
            <div className={`bg-yellow-500/10 border border-yellow-500/30 p-8 rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/10 ${isProblemVisible ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-12'}`}>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400 flex items-center justify-center gap-2">AI Access Gap <Brain className="w-6 h-6" /></h3>
              <p className="text-gray-300">Retail investors lack institutional-grade AI insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Rule */}
      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-t border-slate-800" />
      </div>

      {/* Features Section - SCROLL ANIMATION ADDED */}
      <section id="features" ref={featuresRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center space-y-4 mb-16 transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-4xl md:text-6xl font-bold">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need for intelligent stock market predictions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveFeature(idx)}
                onFocus={() => setActiveFeature(idx)}
                className={`group bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border transition-all duration-500 cursor-pointer hover:shadow-2xl ${activeFeature === idx
                  ? 'border-blue-500 shadow-blue-500/30 scale-[1.03] ring-4 ring-blue-500/20'
                  : 'border-slate-700 hover:border-blue-500/50'
                  } ${isFeaturesVisible ? `opacity-100 translate-y-0 delay-${idx * 150}` : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: isFeaturesVisible ? `${idx * 150}ms` : '0ms' }}
              >
                <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                {activeFeature === idx && (
                  <div className="mt-4 flex items-center text-blue-400 font-semibold animate-pulse-slow">
                    <Check className="w-4 h-4 mr-2" /> Live in Dashboard
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - SCROLL ANIMATION ADDED */}
      <section id="stats" ref={statsRef} className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-4xl md:text-6xl font-bold mb-12 transition-all duration-1000 ${isStatsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>The Impact of AI-Driven Insight</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {statsData.map((stat, idx) => (
              <StatCard key={idx} {...stat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Rule */}
      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-t border-slate-800" />
      </div>

      {/* Innovations Section - SCROLL ANIMATION ADDED */}
      <section id="innovations" ref={innovationsRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center space-y-4 mb-16 transition-all duration-1000 ${isInnovationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-4xl md:text-6xl font-bold">Unique Innovations</h2>
            <p className="text-xl text-gray-300">What sets <span className="text-purple-400 font-semibold">FinTweet</span> apart from the competition</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {innovations.map((innovation, idx) => (
              <div key={idx} className={`group ${isInnovationsVisible ? `opacity-100 translate-y-0 delay-${idx * 150}` : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: isInnovationsVisible ? `${idx * 150}ms` : '0ms' }}>
                <div className="h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-3xl border border-blue-500/20 transition-all duration-300 hover:border-blue-500/70 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:translate-y-[-5px]">
                  <div className="text-blue-400 mb-4 bg-purple-500/20 p-3 rounded-full w-fit group-hover:scale-110 transition-transform">
                    {innovation.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{innovation.title}</h3>
                  <p className="text-gray-400">{innovation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - SCROLL ANIMATION ADDED */}
      <section ref={ctaRef} className="py-24 px-6 text-center">
        <div className={`max-w-5xl mx-auto bg-slate-900/70 p-12 rounded-3xl border border-blue-500/30 shadow-3xl shadow-blue-900/50 transition-all duration-1000 ${isCTAVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Ready to See the Future of Trading? 🚀</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join the new era of financial decision-making, powered by real-time social data and Google's Gemini AI.</p>
            <div className="flex flex-wrap gap-6 justify-center">
                {/* Primary Glowing Button */}
                <a href="/register" className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                    <button className="relative px-12 py-4 rounded-full text-lg font-bold text-white bg-slate-900 transition-all duration-300 border-2 border-transparent group-hover:bg-transparent">
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            <Star className="w-5 h-5 text-yellow-300" />
                            Start Free Trial Today
                        </div>
                    </button>
                </a>

                {/* Outline Button with Pulse */}
                <button className="group relative border-2 border-blue-500/50 px-12 py-4 rounded-full text-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="relative z-10 flex items-center justify-center gap-2 group-hover:text-blue-300">
                        <Twitter className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                        Follow Our Journey
                    </div>
                </button>
            </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">FinTweet</span>
            </div>
            <div className="text-center md:text-right space-y-2">
              <p className="text-gray-400">Powered by Gemini AI and cutting-edge MERN stack architecture.</p>
              <p className="text-sm text-gray-500">© 2025 FinTweet. All rights reserved. Built by Team Tristar.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}