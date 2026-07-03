import { AndroidFrame } from './components/AndroidFrame';
import { CodeViewer } from './components/CodeViewer';
import { Award, GraduationCap, Compass, BookOpen, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  return (
    <div id="fudma_workspace_root" className="min-h-screen bg-slate-100 font-sans flex flex-col justify-between text-slate-900">
      
      {/* Top Main Application Banner Header */}
      <header id="main_header" className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center shadow-sm select-none">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* FUDMA logo style header info */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-sm">
              F
            </div>
            <div>
              <h1 className="text-sm md:text-base font-black text-slate-800 tracking-tight leading-none uppercase">
                FUDMA <span className="text-emerald-600">Reminder</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                Official Department of Computer Science Timetable & Notification Engine
              </p>
            </div>
          </div>

          {/* Quick Academic Meta Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full flex items-center space-x-3.5 text-xs">
              <span className="text-emerald-600 animate-pulse text-lg leading-none">●</span>
              <span className="font-bold text-slate-600">Automatic Reminders Active</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full flex items-center space-x-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-600">Secure Offline Sandbox</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Interactive Dual-Panel Area */}
      <main id="main_body" className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column (Columns 1-5): High-Fidelity Android Device Simulator */}
        <section id="phone_simulator_panel" className="lg:col-span-5 flex justify-center">
          <AndroidFrame />
        </section>

        {/* Right column (Columns 6-12): Production Native Android Kotlin Code Project Explorer */}
        <section id="developer_source_panel" className="lg:col-span-7 h-full">
          <CodeViewer />
        </section>

      </main>

      {/* Clean University Footer */}
      <footer id="main_footer" className="bg-white border-t border-slate-200 py-5 px-4 md:px-8 text-center select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-1.5 justify-center">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Federal University Dutsin-Ma • Department of Computer Science</span>
          </div>
          <div className="flex items-center space-x-1 justify-center">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for FUDMA Students</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
