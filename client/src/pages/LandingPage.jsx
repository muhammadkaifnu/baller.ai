import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Trophy, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { getTeamLogo } from '../utils/teamLogos';

const LandingPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured matches (first 3)
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/matches?limit=3');
        const data = await response.json();
        setMatches(data.data?.matches || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Football Hub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white transition font-medium">Sign In</Link>
            <Link
              to="/login"
              state={{ isSignup: true }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-5 py-2 rounded-full font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] -z-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 text-sm font-medium mb-6 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Live AI Predictions Available
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Football Analytics
                </span>
              </h1>

              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience football like never before with real-time scores, advanced statistics, and AI-powered match predictions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/login"
                  state={{ isSignup: true }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg hover:shadow-cyan-500/25 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/matches"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-bold text-slate-300 hover:bg-slate-700 transition flex items-center justify-center gap-2"
                >
                  View Matches
                </Link>
              </div>
            </div>

            {/* Hero Visual / Animation */}
            <div className="lg:w-1/2 relative">
              <div className="relative w-full max-w-lg mx-auto aspect-square">
                {/* Orbit Rings */}
                <div className="absolute inset-0 border border-slate-700/50 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-8 border border-slate-700/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>

                {/* Floating Elements */}
                <div className="absolute top-0 right-10 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl animate-float" style={{ animationDelay: '0s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Prediction Accuracy</p>
                      <p className="text-lg font-bold text-white">85%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-0 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Live Matches</p>
                      <p className="text-lg font-bold text-white">12 Active</p>
                    </div>
                  </div>
                </div>

                {/* Central 3D Ball Representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-float">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 rounded-full mix-blend-overlay"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 to-transparent"></div>
                    {/* Shine */}
                    <div className="absolute top-4 left-8 w-16 h-8 bg-white/20 rounded-full blur-md transform -rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Matches Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Matches</h2>
              <p className="text-slate-400">Upcoming top-tier matchups</p>
            </div>
            <Link to="/matches" className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div key={match._id} className="bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition group overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded uppercase tracking-wider">
                        {match.league}
                      </span>
                      <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(match.date)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="w-12 h-12 bg-slate-700 rounded-full p-2 flex items-center justify-center">
                          <img src={getTeamLogo(match.home_team)} alt={match.home_team} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-semibold text-center leading-tight">{match.home_team}</span>
                      </div>

                      <div className="flex flex-col items-center w-1/3">
                        <div className="text-2xl font-bold text-slate-200">VS</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(match.date)}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="w-12 h-12 bg-slate-700 rounded-full p-2 flex items-center justify-center">
                          <img src={getTeamLogo(match.away_team)} alt={match.away_team} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-semibold text-center leading-tight">{match.away_team}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs text-slate-400">AI Prediction Ready</span>
                        </div>
                        <Link
                          to="/login"
                          className="text-sm font-medium text-white bg-slate-700 hover:bg-cyan-600 px-4 py-2 rounded-lg transition"
                        >
                          Analyze
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[128px] -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Football Hub?</h2>
            <p className="text-slate-400 text-lg">We combine real-time data with advanced machine learning to give you the edge.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8 text-cyan-400" />,
                title: "Real-Time Updates",
                desc: "Instant score updates and match events as they happen on the pitch."
              },
              {
                icon: <Users className="w-8 h-8 text-purple-400" />,
                title: "Detailed Stats",
                desc: "Comprehensive player and team statistics to inform your analysis."
              },
              {
                icon: <Trophy className="w-8 h-8 text-yellow-400" />,
                title: "AI Predictions",
                desc: "Machine learning models trained on historical data to predict outcomes."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 hover:bg-slate-800 transition hover:-translate-y-1">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Elevate Your Game?</h2>
              <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                Join thousands of football enthusiasts and get access to premium analytics today.
              </p>
              <Link
                to="/login"
                state={{ isSignup: true }}
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-cyan-50 transition shadow-lg"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-slate-400" />
              </div>
              <span className="font-bold text-slate-300">Football Hub</span>
            </div>
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Football Hub. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link to="#" className="text-slate-500 hover:text-cyan-400 transition">Privacy</Link>
              <Link to="#" className="text-slate-500 hover:text-cyan-400 transition">Terms</Link>
              <Link to="#" className="text-slate-500 hover:text-cyan-400 transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
