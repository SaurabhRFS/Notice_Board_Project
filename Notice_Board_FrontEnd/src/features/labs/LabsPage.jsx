import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Code, Zap, Settings, FlaskConical, 
  Dna, Building2, Atom, Beaker, PenTool, ExternalLink 
} from 'lucide-react';

// New Imports for the Navbar
import Navbar from '../../components/layout/Navbar';
import { useCurrentUser } from '../auth/hooks/useCurrentUser';
import AnimatedBackground from '../../components/layout/AnimatedBackground'; 

const LabsPage = () => {
  const navigate = useNavigate();
  
  // 1. Get User Data for the Navbar
  const { username, userRole } = useCurrentUser();

  // 2. Handle Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const labs = [
    { 
      id: 'ec', 
      name: 'Electronics & Communications', 
      url: 'https://www.vlab.co.in/broad-area-electronics-and-communications', 
      icon: Cpu,
      color: 'bg-orange-500',
      desc: 'Circuits, Signals, and Embedded Systems'
    },
    { 
      id: 'cse', 
      name: 'Computer Science & Engineering', 
      url: 'https://www.vlab.co.in/broad-area-computer-science-and-engineering', 
      icon: Code,
      color: 'bg-blue-500',
      desc: 'Algorithms, AI, and Software Systems'
    },
    { 
      id: 'ee', 
      name: 'Electrical Engineering', 
      url: 'https://www.vlab.co.in/broad-area-electrical-engineering', 
      icon: Zap,
      color: 'bg-yellow-500',
      desc: 'Machines, Power Systems, and Sensors'
    },
    { 
      id: 'me', 
      name: 'Mechanical Engineering', 
      url: 'https://www.vlab.co.in/broad-area-mechanical-engineering', 
      icon: Settings,
      color: 'bg-slate-500',
      desc: 'Thermodynamics, Fluid Mechanics, and Dynamics'
    },
    { 
      id: 'che', 
      name: 'Chemical Engineering', 
      url: 'https://www.vlab.co.in/broad-area-chemical-engineering', 
      icon: FlaskConical,
      color: 'bg-teal-500',
      desc: 'Process Control and Reaction Engineering'
    },
    { 
      id: 'bio', 
      name: 'Biotechnology & Biomedical', 
      url: 'https://www.vlab.co.in/broad-area-biotechnology-and-biomedical-engineering', 
      icon: Dna,
      color: 'bg-pink-500',
      desc: 'Neurophysiology and Cell Biology'
    },
    { 
      id: 'ce', 
      name: 'Civil Engineering', 
      url: 'https://www.vlab.co.in/broad-area-civil-engineering', 
      icon: Building2,
      color: 'bg-amber-700',
      desc: 'Structural Analysis and Soil Mechanics'
    },
    { 
      id: 'phy', 
      name: 'Physical Sciences', 
      url: 'https://www.vlab.co.in/broad-area-physical-sciences', 
      icon: Atom,
      color: 'bg-indigo-500',
      desc: 'Optics, Solid State Physics, and Mechanics'
    },
    { 
      id: 'chem', 
      name: 'Chemical Sciences', 
      url: 'https://www.vlab.co.in/broad-area-chemical-sciences', 
      icon: Beaker,
      color: 'bg-green-500',
      desc: 'Organic and Inorganic Chemistry'
    },
    { 
      id: 'de', 
      name: 'Design Engineering', 
      url: 'https://www.vlab.co.in/broad-area-design-engineering', 
      icon: PenTool,
      color: 'bg-rose-500',
      desc: 'Machine Design and Industrial Automation'
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden">
      
      <AnimatedBackground />
      
      {/* 3. Render the Navbar */}
      <Navbar 
        username={username}
        userRole={userRole}
        onLogout={handleLogout}
        // Since we are not on the home page, clicking "Post Notice"
        // should ideally redirect home or open the modal. 
        // For simplicity, let's redirect home where the modal lives.
        onCreateClick={() => navigate('/')} 
        onAdminClick={() => navigate('/admin')}
      />

      <div className="relative z-10 pt-24 md:pt-28 pb-12 px-4 max-w-7xl mx-auto">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
            Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Labs</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Access premium simulations and experiments directly from the Ministry of Education. No setup required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => {
            const Icon = lab.icon;
            return (
              <a 
                key={lab.id}
                href={lab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col p-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${lab.color} text-white shadow-lg shadow-slate-200`}>
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <ExternalLink size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                  {lab.name}
                </h3>
                
                <p className="text-sm text-slate-500 font-medium">
                  {lab.desc}
                </p>
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default LabsPage;