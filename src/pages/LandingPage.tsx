import React, { useState } from 'react';
import { 
  HeartPulse, Compass, ArrowRight, ChevronDown, ChevronUp, 
  Map, Star, ShieldCheck, Activity, Heart, MapPin 
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'How does this work?',
      answer: 'First, enter all the required journey details and set your PIN. Once the journey starts, a 20-minute timer begins. After 20 minutes, the system enters the stress/alert stage. If you do not respond and enter the correct PIN, an emergency message will be sent automatically.'
    },
    {
      question: 'How does the Duress PIN work?',
      answer: 'The Duress PIN is a special PIN, such as 9999. If you are threatened or in danger and enter the Duress PIN, an emergency message will automatically be sent while appearing to disable the alarm.'
    },
    {
      question: 'What happens if my battery is low?',
      answer: 'If the battery is 15% or lower during normal use, a warning will be displayed asking you to charge your device. If the timer is active and the battery reaches 5% or lower, a critical warning will be displayed and the emergency SMS will be sent automatically.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
      {/* Premium White Header Bar */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200/60 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <HeartPulse className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              Woman Safety Tracker
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-8">
            <a href="#" className="text-sm font-black uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors">Home</a>
            <a href="#features" className="text-sm font-black uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#about" className="text-sm font-black uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors">About</a>
            <a href="#faqs" className="text-sm font-black uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors">FAQs</a>
            <button
              onClick={onGetStarted}
              className="py-3 px-6 rounded-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm"
            >
              Get Started
            </button>
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={onGetStarted}
              className="py-2.5 px-4 rounded-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 space-y-24">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-black tracking-widest uppercase text-indigo-600">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse mr-1" />
              Next-Gen AI Protection Active
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">
              Travel Smarter.<br />
              <span className="text-indigo-600">Stay Safer.</span>
            </h1>
            
            <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-lg">
              Harness the power of AI-assisted journey protection. Real-time threat detection, safe routing, and instant SOS connectivity for the modern urban explorer.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="py-4 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs md:text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 active:scale-95 inline-flex items-center space-x-2 border border-indigo-500/20"
              >
                <span>Start Journey Now</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <a
                href="#features"
                className="py-4 px-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-755 text-slate-700 font-black text-xs md:text-sm uppercase tracking-wider transition-all active:scale-95 shadow-sm inline-block"
              >
                Learn More
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-slate-200 max-w-md">
              <div>
                <span className="block text-xl md:text-2xl font-extrabold text-slate-900">Live</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GPS Active</span>
              </div>
            </div>
          </div>

          {/* Right Hero illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] h-[460px] bg-gradient-to-tr from-slate-950 to-slate-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-slate-800 flex flex-col justify-between text-left">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-indigo-500/10 filter blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full bg-rose-500/10 filter blur-3xl" />

              {/* Float Widget 1 */}
              <div className="relative z-10 self-start p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center space-x-3 text-xs max-w-[200px]">
                <div className="p-1.5 bg-indigo-500 rounded-xl text-white">
                  <Compass className="w-4.5 h-4.5 text-white animate-spin-slow" />
                </div>
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Tracker Active</p>
                  <p className="text-[10px] text-white font-extrabold">Scanning vicinity...</p>
                </div>
              </div>

              {/* Central Glowing Shield Icon */}
              <div className="relative z-10 mx-auto my-6 w-24 h-24 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-12 h-12 text-indigo-400 animate-pulse" />
              </div>

              {/* Float Widget 2 */}
              <div className="relative z-10 self-end p-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-indigo-200" />
                <span>Optimized Route</span>
              </div>
            </div>
          </div>
        </section>

        {/* Engineered for Vigilance Section */}
        <section id="features" className="space-y-12 text-center">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Engineered for Vigilance</h2>
            <p className="text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-wider">Our tech stack monitors thousands of data points in real-time to ensure your path remains secure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Card 1: One-Tap SOS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-left space-y-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm md:text-base font-extrabold text-slate-900">One-Tap SOS</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">Instant SOS: Click the button and an emergency message is automatically sent.</p>
              </div>
            </div>

            {/* Card 2: Trusted Circle */}
            <div className="p-6 rounded-3xl bg-indigo-600 text-white shadow-lg flex flex-col justify-between text-left space-y-6 border border-indigo-500/20">
              <div className="p-3 bg-white/10 text-white rounded-2xl w-fit">
                <Star className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm md:text-base font-extrabold text-white">Trusted Circle</h4>
                <p className="text-xs md:text-sm text-indigo-105 text-indigo-100 leading-relaxed font-semibold">Emergency contacts will be informed immediately.</p>
              </div>
            </div>

            {/* Card 3: Fake Decoy Calls */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-left space-y-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm md:text-base font-extrabold text-slate-900">Fake Decoy Calls</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">Trigger a fake decoy call for protection during uneasy situations.</p>
              </div>
            </div>

            {/* Card 4: Safe Routes */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:col-span-2 items-center justify-between text-left gap-6">
              <div className="space-y-3 max-w-md">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                  <Map className="w-6 h-6" />
                </div>
                <h4 className="text-sm md:text-base font-extrabold text-slate-900">Safe Routes</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">Nearest hospital and nearest police station will be calculated immediately.</p>
              </div>
              <div className="w-full md:w-64 h-36 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-hidden relative flex-shrink-0">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#4f46e5_0.5px,transparent_0.5px)] [background-size:12px_12px]" />
                <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-indigo-500 rounded-full" />
                <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-indigo-600 -translate-y-1" />
                <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-emerald-500 -translate-y-1" />
              </div>
            </div>

            {/* Card 5: Journey Tracker */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-left space-y-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm md:text-base font-extrabold text-slate-900">Journey Tracker</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">Track and view your journey history.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="about" className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Trusted by thousands of solo travelers.</h2>
            <p className="text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-wider">
              This is a project created to study and help women travel safely across distances.
            </p>
          </div>
        </section>

        {/* Accordion FAQ Section */}
        <section id="faqs" className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Questions? We're on it.</h2>
            <p className="text-slate-550 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400">Everything you need to know about our active routing layers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 flex items-center justify-between text-left font-extrabold text-xs md:text-sm uppercase tracking-wider text-slate-800 hover:text-indigo-650 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs md:text-sm text-slate-500 leading-relaxed font-semibold border-t border-slate-100 pt-3 text-left">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Banner Card */}
        <section className="rounded-3xl bg-indigo-600 p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl border border-indigo-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 filter blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 filter blur-xl" />

          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">Ready for a safer tomorrow?</h2>
            <p className="text-xs md:text-sm text-indigo-100 font-bold uppercase tracking-wider max-w-sm mx-auto">Join thousands of users who have upgraded their personal safety corridors with Woman Safety Tracker.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="py-4.5 px-8 rounded-full bg-white hover:bg-slate-150 hover:bg-slate-100 text-indigo-650 text-indigo-600 font-black text-xs md:text-sm uppercase tracking-wider shadow-md transition-all active:scale-95"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Clean light Footer bar */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-500 font-semibold mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm">Woman Safety Tracker</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] font-bold text-slate-500">
            Safer Tomorrow.
          </div>

          <p className="text-[11px] text-slate-400 font-bold">© 2026 Woman Safety Tracker. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
