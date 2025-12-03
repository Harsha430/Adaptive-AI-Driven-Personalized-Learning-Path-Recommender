import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: "🎯",
      title: "Personalized Learning",
      description: "AI-powered paths tailored to your unique goals and learning style"
    },
    {
      icon: "📊",
      title: "Progress Analytics",
      description: "Detailed insights into your learning journey and achievements"
    },
    {
      icon: "🤖",
      title: "AI Content Generation",
      description: "Dynamic content creation based on your current skill level"
    },
    {
      icon: "🏆",
      title: "Gamified Experience",
      description: "Earn XP, maintain streaks, and compete on leaderboards"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Learners" },
    { number: "500+", label: "Learning Modules" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container-pro mx-auto px-6 grid lg:grid-cols-2 items-center gap-16">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-surface-800/50 border border-brand-500/30 text-brand-300 text-sm font-medium backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-400 mr-2 animate-pulse"></span>
              Next-Generation Learning Platform
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-tight">
              Master <span className="text-gradient-primary">Any Skill</span>
              <br />
              <span className="text-gradient-secondary">Intelligently</span>
            </h1>
            
            <p className="text-xl text-surface-200 max-w-2xl leading-relaxed">
              Experience the future of education with our AI-powered adaptive learning platform. 
              Personalized paths, real-time analytics, and intelligent content generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Start Learning Today
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/5">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl font-heading font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-surface-400 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
            <div className="glass-card p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div>
                    <div className="text-lg font-heading font-bold text-white">Learning Dashboard</div>
                    <div className="text-sm text-surface-400">Daily Overview</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-surface-300">Course Progress</span>
                      <span className="text-brand-300 font-bold">78%</span>
                    </div>
                    <div className="h-3 bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-teal-500 w-[78%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-800/50 rounded-xl p-4 border border-white/5">
                      <div className="text-2xl font-heading font-bold text-white mb-1">1,250</div>
                      <div className="text-xs text-surface-400 uppercase tracking-wider">XP Points</div>
                    </div>
                    <div className="bg-surface-800/50 rounded-xl p-4 border border-white/5">
                      <div className="text-2xl font-heading font-bold text-white mb-1">15</div>
                      <div className="text-xs text-surface-400 uppercase tracking-wider">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 glass-panel p-4 rounded-xl animate-float" style={{ animationDelay: '1.5s' }}>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-xl animate-float" style={{ animationDelay: '2.5s' }}>
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-pro">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-heading font-bold">
            Why Choose <span className="text-gradient-primary">EduFlow?</span>
          </h2>
          <p className="text-lg text-surface-300">
            Our platform combines cutting-edge AI technology with proven educational methodologies 
            to deliver an unparalleled learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-4xl mb-6 bg-surface-800/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-surface-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-pro">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="relative p-16 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-brand-100 max-w-2xl mx-auto">
              Join thousands of learners who have already discovered the power of adaptive AI education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl bg-white text-brand-700 font-bold text-lg hover:bg-brand-50 transition-colors shadow-xl shadow-black/20"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-colors"
              >
                I Have an Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;


