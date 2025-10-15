import React, { useState, useEffect } from "react";

export default function Main() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans text-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl shadow-2xl mb-6 mx-auto transform hover:rotate-12 transition-transform duration-300">
              <span className="text-4xl sm:text-5xl">📊</span>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            FinTweet
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl mb-12 text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
            Sentiment-Driven Stock Insights Powered by 
            <span className="font-bold text-blue-600"> Social Media Analysis</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-blue-600 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl border-2 border-blue-200 hover:border-blue-400 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
              Watch Demo
            </button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm sm:text-base text-gray-600 px-4">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>Free Forever</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-600 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-gray-900">
              Why Choose <span className="text-blue-600">FinTweet?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Harness the power of social sentiment to make informed investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: "🎯",
                title: "Real-Time Sentiment",
                description: "Instantly understand market mood from Twitter data using cutting-edge AI sentiment models.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "📈",
                title: "Stock Correlation",
                description: "Discover how sentiment reflects and predicts stock price movements for strategic trading.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Get insights in milliseconds with our optimized real-time data processing pipeline.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                description: "Your data is encrypted and protected with enterprise-grade security measures.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: "📊",
                title: "Beautiful Dashboards",
                description: "Visualize complex data with stunning, interactive charts and comprehensive analytics.",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: "🎨",
                title: "Easy to Use",
                description: "Intuitive interface designed for both beginners and professional traders alike.",
                gradient: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-gray-900">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Four simple steps to smarter trading decisions
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Real-Time Data Mining",
                description: "Our advanced algorithms continuously scan Twitter for relevant financial discussions and market sentiment.",
                color: "blue"
              },
              {
                step: "02",
                title: "AI Sentiment Analysis",
                description: "VADER and TextBlob models process thousands of tweets to extract accurate sentiment scores.",
                color: "purple"
              },
              {
                step: "03",
                title: "Visual Correlation",
                description: "See sentiment data visualized alongside real stock price movements with interactive charts.",
                color: "cyan"
              },
              {
                step: "04",
                title: "Actionable Insights",
                description: "Receive personalized recommendations and alerts directly on your customizable dashboard.",
                color: "indigo"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group flex flex-col sm:flex-row gap-6 items-start bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-x-2"
              >
                <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl font-black text-white">{item.step}</span>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-gray-900">
              Loved by <span className="text-blue-600">Traders</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Join thousands of successful investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "FinTweet completely transformed my trading strategy. The sentiment analysis is incredibly accurate and has given me a real competitive edge in the market.",
                author: "Jane D.",
                role: "Day Trader",
                rating: 5
              },
              {
                quote: "The insights are surprisingly accurate and the interface is so intuitive. I can't imagine trading without FinTweet's real-time sentiment data anymore.",
                author: "Mark L.",
                role: "Investment Analyst",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">★</span>
                  ))}
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            Ready to Trade Smarter?
          </h2>
          <p className="text-xl sm:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Join thousands of traders making data-driven decisions with FinTweet
          </p>
          
          <button className="group relative px-10 py-5 bg-white text-blue-600 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <p className="mt-6 text-blue-100 text-sm">
            No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">FinTweet</h3>
              <p className="text-sm text-gray-400">
                Empowering traders with AI-driven sentiment analysis
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 FinTweet. All rights reserved. Made with ❤️ for traders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}