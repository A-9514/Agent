import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Sparkles, 
  LayoutGrid, 
  ArrowRight, 
  Search, 
  Menu, 
  X, 
  CheckCircle2, 
  Settings,
  Copy,
  RefreshCw,
  Smartphone,
  Edit3,
  User,
  Dice5,
  Download,
  Sidebar,
  Mail,
  ListChecks,
  BookOpen,
  Briefcase,
  Smile,
  Share2,
  Package,
  UserPlus,
  BadgeCheck,
  QrCode,
  Target,
  Heart,
  Zap,
  Users,
  ChevronUp,
  ChevronDown,
  ArrowDown
} from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import jsPDF from 'jspdf';

import { Theme, ThemeColor, GeneratedResponse, Folder, ContentType, Platform } from './types';
import { generateSocialContent } from './geminiService';

// --- Theme Configuration ---
const themes: Record<ThemeColor, Theme> = {
  rose: {
    id: 'rose',
    name: 'Warm Welcome',
    primary: 'bg-rose-500',
    secondary: 'text-rose-500',
    accent: 'border-rose-200',
    bg: 'bg-rose-50',
    text: 'text-rose-950',
    card: 'bg-white/80'
  },
  violet: {
    id: 'violet',
    name: 'Tech Forward',
    primary: 'bg-violet-600',
    secondary: 'text-violet-400',
    accent: 'border-violet-800',
    bg: 'bg-slate-900',
    text: 'text-slate-100',
    card: 'bg-slate-800/80'
  },
  teal: {
    id: 'teal',
    name: 'Fresh Start',
    primary: 'bg-teal-500',
    secondary: 'text-teal-600',
    accent: 'border-teal-200',
    bg: 'bg-teal-50',
    text: 'text-teal-900',
    card: 'bg-white/90'
  },
  amber: {
    id: 'amber',
    name: 'Growth Mindset',
    primary: 'bg-amber-500',
    secondary: 'text-amber-600',
    accent: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-950',
    card: 'bg-white/90'
  },
  emerald: {
    id: 'emerald',
    name: 'Sustainable',
    primary: 'bg-emerald-600',
    secondary: 'text-emerald-400',
    accent: 'border-emerald-800',
    bg: 'bg-green-950',
    text: 'text-emerald-50',
    card: 'bg-green-900/60'
  },
  slate: {
    id: 'slate',
    name: 'Corporate Clean',
    primary: 'bg-slate-800',
    secondary: 'text-slate-700',
    accent: 'border-slate-200',
    bg: 'bg-gray-50',
    text: 'text-slate-900',
    card: 'bg-white'
  }
};

const themeKeys: ThemeColor[] = ['rose', 'violet', 'emerald', 'amber', 'teal', 'slate'];

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false }: any) => {
  const baseStyle = "px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: `shadow-lg hover:shadow-xl text-white`,
    secondary: `bg-transparent border-2 hover:bg-black/5`,
    ghost: `hover:bg-black/5`
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const SettingsModal = ({ isOpen, onClose, theme, userName, setUserName, defaultTone, setDefaultTone }: any) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md p-8 rounded-3xl ${theme.card} shadow-2xl border ${theme.accent} animate-slide-up`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
          <Settings className={theme.secondary} />
          HR Settings
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">Manager Name</label>
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${theme.accent} bg-white/5`}>
              <User size={18} className="opacity-50" />
              <input 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-transparent outline-none w-full placeholder-current"
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">Company Voice</label>
            <select 
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              className={`w-full p-3 rounded-xl bg-transparent border ${theme.accent} outline-none cursor-pointer`}
            >
              <option className="text-black">Warm and Welcoming</option>
              <option className="text-black">Professional & Concise</option>
              <option className="text-black">Excited & High Energy</option>
              <option className="text-black">Structured & Formal</option>
            </select>
          </div>

          <Button onClick={onClose} className={`w-full justify-center ${theme.primary} text-white mt-4`}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

const InviteModal = ({ isOpen, onClose, theme, onInvite }: any) => {
  const [email, setEmail] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md p-8 rounded-3xl ${theme.card} shadow-2xl border ${theme.accent} animate-slide-up`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-serif font-bold mb-2 flex items-center gap-2">
          <UserPlus className={theme.secondary} />
          Invite Team
        </h2>
        <p className="opacity-60 text-sm mb-6">Collaborate on onboarding experiences together.</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">Teammate Email</label>
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${theme.accent} bg-white/5`}>
              <Mail size={18} className="opacity-50" />
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none w-full placeholder-current"
                placeholder="colleague@company.com"
                type="email"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => {
              if (email) onInvite(email);
              setEmail('');
            }} 
            className={`w-full justify-center ${theme.primary} text-white mt-4`}
            disabled={!email}
          >
            Send Invite
          </Button>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ employeeName, roleTitle, moodColors, moodName, theme, id }: any) => {
  return (
    <div 
      id={id}
      className="relative w-[320px] h-[480px] rounded-[32px] overflow-hidden shadow-2xl flex flex-col text-white transform transition-all hover:scale-105 duration-500"
      style={{
        background: `linear-gradient(135deg, ${moodColors[0]}, ${moodColors[1]})`
      }}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
      
      {/* Top Section */}
      <div className="p-8 relative z-10 text-center border-b border-white/20 pb-6">
        <div className="inline-flex items-center gap-2 opacity-80 mb-2">
          <Smile size={16} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase">OnboardFlow</span>
        </div>
        <h3 className="font-serif text-2xl font-bold">{moodName}</h3>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center">
         <div className="w-32 h-32 rounded-full border-4 border-white/30 bg-white/10 mb-6 flex items-center justify-center backdrop-blur-sm relative overflow-hidden">
            <span className="text-4xl font-serif font-bold opacity-80">
              {employeeName.split(' ').map((n: string) => n[0]).join('')}
            </span>
            {/* Gloss effect */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent to-white/20 pointer-events-none" />
         </div>
         
         <h2 className="text-3xl font-bold mb-2 text-shadow-sm">{employeeName}</h2>
         <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/10">
           <p className="text-sm font-medium tracking-wide">{roleTitle}</p>
         </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6 relative z-10 bg-black/10 backdrop-blur-md border-t border-white/10 flex items-center justify-between">
         <div className="text-left">
           <p className="text-[10px] uppercase opacity-60 font-bold tracking-wider mb-1">Access Level</p>
           <div className="flex items-center gap-1 text-sm font-bold text-emerald-300">
             <BadgeCheck size={16} />
             <span>Day 1 Pass</span>
           </div>
         </div>
         <div className="bg-white p-2 rounded-lg">
           <QrCode size={32} className="text-black opacity-80" />
         </div>
      </div>
      
      {/* Holographic shine simulation */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none duration-700" />
    </div>
  );
};

// --- Configs for Different Folders ---

interface FolderConfig {
  types: { id: ContentType; label: string; icon: any }[];
  placeholder: string;
  sparks: string[];
}

const folderConfigs: Record<string, FolderConfig> = {
  'Day 1 Essentials': {
    types: [
      { id: 'kit', label: 'Day 1 Kit', icon: Package },
      { id: 'welcome', label: 'Welcome Email', icon: Mail },
      { id: 'checklist', label: 'Checklist', icon: ListChecks },
      { id: 'guide', label: 'Role Guide', icon: BookOpen }
    ],
    placeholder: "E.g. We want to emphasize our 'Fun & Fast' culture. The icebreaker should be about movies.",
    sparks: [
      "Make the new hire feel like a VIP celebrity.",
      "Include a fun fact about the company history.",
      "Explain the 'Coffee Policy' in a humorous way.",
      "Draft a welcome message from the office dog."
    ]
  },
  'Week 1 Goals': {
    types: [
      { id: 'checklist', label: 'Goal Checklist', icon: Target },
      { id: 'guide', label: 'Expectations', icon: BookOpen },
      { id: 'welcome', label: 'Check-in Msg', icon: Mail }
    ],
    placeholder: "E.g. Focus on meeting key stakeholders, understanding the product roadmap, and shipping one small fix.",
    sparks: [
      "Focus on quick wins to build confidence.",
      "Include 'Coffee with CEO' as a goal.",
      "Make the goals sound like a video game quest.",
      "Emphasize learning over shipping for week 1."
    ]
  },
  'Benefits & Perks': {
    types: [
      { id: 'guide', label: 'Benefits Guide', icon: Heart },
      { id: 'checklist', label: 'Enrollment List', icon: ListChecks },
      { id: 'welcome', label: 'Perks Email', icon: Mail }
    ],
    placeholder: "E.g. Explain our unlimited PTO policy and the gym reimbursement process.",
    sparks: [
      "Highlight the 'Mental Health Day' policy.",
      "Explain the snack bar rules with humor.",
      "Make the insurance enrollment sound exciting.",
      "Detail the remote work stipend."
    ]
  },
  'Team Culture': {
    types: [
      { id: 'guide', label: 'Culture Code', icon: Users },
      { id: 'welcome', label: 'Slack Intro', icon: Zap },
      { id: 'kit', label: 'Swag Kit', icon: Package }
    ],
    placeholder: "E.g. Our core values are 'Radical Candor' and 'Move Fast'. We do Bagel Fridays.",
    sparks: [
      "Explain our inside jokes.",
      "Describe the annual retreat tradition.",
      "Write a manifesto for the team.",
      "Create a 'Dictionary of Company Slang'."
    ]
  }
};


// --- Main Application ---

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>('teal');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Dashboard State
  const [activeFolder, setActiveFolder] = useState<string>('Day 1 Essentials');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(true);
  
  // User Preferences
  const [userName, setUserName] = useState('HR Manager');
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'Alex', initial: 'A', color: 'bg-blue-500' },
    { id: 2, name: 'Sam', initial: 'S', color: 'bg-amber-500' }
  ]);
  
  // AI Agent State
  const [contentType, setContentType] = useState<ContentType>('kit');
  const [platform, setPlatform] = useState<Platform>('Email');
  const [prompt, setPrompt] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [tone, setTone] = useState('Warm and Welcoming');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResponse | null>(null);
  
  // Preview Mode State
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Dynamic Tone Suggestion
  useEffect(() => {
    const suggestions: Record<ContentType, string> = {
      kit: 'Excited & High Energy',
      welcome: 'Excited & High Energy',
      checklist: 'Structured & Formal',
      guide: 'Warm and Welcoming'
    };
    setTone(suggestions[contentType] || 'Professional & Concise');
  }, [contentType]);

  // Scroll to result when generated
  useEffect(() => {
    if (generatedResult && resultRef.current) {
      // Delay scrolling to ensure the "Collapse Input" animation has finished
      const timer = setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [generatedResult]);

  const theme = themes[currentTheme];
  const currentConfig = folderConfigs[activeFolder] || folderConfigs['Day 1 Essentials'];

  const handleCreativeSpark = () => {
    const sparks = currentConfig.sparks;
    const randomSpark = sparks[Math.floor(Math.random() * sparks.length)];
    setPrompt(prev => prev ? prev + "\n\nConstraint: " + randomSpark : "Constraint: " + randomSpark);
  };

  const handleExport = () => {
    if (!generatedResult) return;
    const blob = new Blob([generatedResult.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboard-flow-${contentType}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('employee-badge');
    
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`Employee-Badge-${employeeName.replace(/\s+/g, '-')}.pdf`);
      } catch (err) {
        console.error("PDF Generation failed", err);
        alert("Could not generate PDF badge. Please try again.");
      }
    } else {
      window.print();
    }
  };

  const handleShare = async () => {
    if (!generatedResult) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `OnboardFlow - ${contentType} for ${employeeName}`,
          text: generatedResult.content,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      const subject = encodeURIComponent(`Onboarding ${contentType}: ${employeeName}`);
      const body = encodeURIComponent(generatedResult.content);
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    }
  };

  const cycleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const currentIndex = themeKeys.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themeKeys.length;
      setCurrentTheme(themeKeys[nextIndex]);
      setIsAnimating(false);
    }, 300);
  };

  const handleInvite = (email: string) => {
    const newId = collaborators.length + 1;
    const colors = ['bg-pink-500', 'bg-indigo-500', 'bg-emerald-500'];
    setCollaborators([...collaborators, {
      id: newId,
      name: email.split('@')[0],
      initial: email[0].toUpperCase(),
      color: colors[newId % colors.length]
    }]);
    setShowInviteModal(false);
  };

  const handleFolderChange = (folderName: string) => {
    setActiveFolder(folderName);
    setGeneratedResult(null); // Clear previous result
    setPrompt(''); // Clear previous prompt
    setIsInputExpanded(true); // Reset to expanded input
    // Set default content type for that folder
    const config = folderConfigs[folderName];
    if (config) {
      setContentType(config.types[0].id);
    }
  };

  const folders: Folder[] = [
    { id: '1', name: 'Day 1 Essentials', count: 5, color: 'bg-green-500' },
    { id: '2', name: 'Week 1 Goals', count: 3, color: 'bg-blue-500' },
    { id: '3', name: 'Benefits & Perks', count: 8, color: 'bg-purple-500' },
    { id: '4', name: 'Team Culture', count: 12, color: 'bg-pink-500' },
  ];

  const handleGenerate = async () => {
    if (!employeeName || !roleTitle) return; // Basic validation
    setIsGenerating(true);
    setGeneratedResult(null);
    setIsPreviewMode(false);
    
    // Slight artificial delay for UX feel
    await new Promise(r => setTimeout(r, 800));
    
    const result = await generateSocialContent(prompt, contentType, tone, platform, employeeName, roleTitle, activeFolder);
    setGeneratedResult(result);
    setIsGenerating(false);
    setIsInputExpanded(false); // Collapse input to show result
  };

  const getGeneratedLabel = () => {
    switch (contentType) {
      case 'kit': return `${activeFolder.split(' ')[0]} Kit Ready`;
      case 'welcome': return 'Message Generated';
      case 'checklist': return 'Checklist Ready';
      case 'guide': return 'Guide Created';
      default: return 'Content Ready';
    }
  };

  // --- Landing View ---
  if (view === 'landing') {
    return (
      <div className={`min-h-screen transition-colors duration-700 ${theme.bg} ${theme.text} flex flex-col relative overflow-x-hidden`}>
        {/* Abstract Background Elements */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-20 ${theme.primary} animate-pulse`} />
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-20 ${theme.secondary.replace('text', 'bg')} mix-blend-multiply`} />

        {/* Header */}
        <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tighter cursor-pointer" onClick={cycleTheme}>
            <div className={`w-8 h-8 rounded-lg ${theme.primary} flex items-center justify-center`}>
              <Smile className="text-white w-5 h-5" />
            </div>
            OnboardFlow
          </div>
          <button 
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 font-medium hover:opacity-70 transition-opacity`}
          >
            Open Workspace <ArrowRight size={18} />
          </button>
        </nav>

        {/* Main Hero */}
        <main className="relative z-10 flex flex-col items-center w-full">
          
          <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 gap-12 min-h-[80vh]">
            <div className={`flex-1 space-y-8 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} transition-all duration-500`}>
              <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1]">
                Design the <br />
                <span className="italic font-light opacity-80">perfect Day 1</span> <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r from-current to-gray-400`}>experience.</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-70 max-w-xl font-light leading-relaxed">
                The Employee Onboarding Agent. Generate personalized welcome kits, checklists, and guides in seconds.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  onClick={() => setView('dashboard')}
                  className={`${theme.primary} text-white`}
                  icon={Briefcase}
                >
                  Start Onboarding
                </Button>
                <Button 
                  onClick={cycleTheme}
                  variant="secondary"
                  className={`border-current ${theme.text}`}
                  icon={Palette}
                >
                  Change Vibe
                </Button>
              </div>
            </div>

            {/* Feature Cards Visual */}
            <div className="flex-1 w-full max-w-md lg:max-w-xl relative hidden md:block">
              <div className="relative w-full aspect-square">
                <div className={`absolute top-0 right-0 w-64 p-6 rounded-3xl backdrop-blur-md border shadow-2xl transition-all duration-700 hover:-translate-y-2 ${theme.card} ${theme.accent} z-20`}>
                  <div className={`w-10 h-10 rounded-full ${theme.primary} bg-opacity-10 flex items-center justify-center mb-4`}>
                    <CheckCircle2 className={`w-5 h-5 ${theme.secondary}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Smart Checklists</h3>
                  <p className="text-sm opacity-70">"Day 1: Setup Mac, Meet the team, Lunch with Manager..."</p>
                </div>

                <div className={`absolute top-32 left-10 w-64 p-6 rounded-3xl backdrop-blur-md border shadow-2xl transition-all duration-700 hover:-translate-y-2 ${theme.card} ${theme.accent} z-10`}>
                  <div className={`w-10 h-10 rounded-full ${theme.primary} bg-opacity-10 flex items-center justify-center mb-4`}>
                    <Mail className={`w-5 h-5 ${theme.secondary}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Welcome Emails</h3>
                  <p className="text-sm opacity-70">"Welcome Sarah! We are thrilled to have you join as Senior Designer."</p>
                </div>

                <div className={`absolute bottom-10 right-10 w-72 p-6 rounded-3xl backdrop-blur-md border shadow-2xl transition-all duration-700 hover:-translate-y-2 ${theme.card} ${theme.accent} z-30`}>
                  <div className={`w-10 h-10 rounded-full ${theme.primary} bg-opacity-10 flex items-center justify-center mb-4`}>
                    <BookOpen className={`w-5 h-5 ${theme.secondary}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Role Guides</h3>
                  <p className="text-sm opacity-70">Auto-generated role expectations and team culture guides.</p>
                </div>
              </div>
            </div>
            
             <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce p-3 rounded-full hover:bg-black/5 transition-colors"
            >
              <ChevronDown size={24} className="opacity-50" />
            </button>
          </div>

          {/* New Scroll Section - Content Creation Ideas */}
          <div className="w-full py-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">The Process</p>
                <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">Make onboarding memorable</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 opacity-20 bg-current -z-10" />
                <svg className="hidden md:block absolute top-0 left-0 w-full h-32 -z-10 opacity-20" preserveAspectRatio="none">
                  <path d="M0,50 Q400,0 600,50 T1200,50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                </svg>

                {[
                  { title: "Personalize", icon: User, desc: "Input the new hire's name, role, and key details." },
                  { title: "Generate", icon: Sparkles, desc: "AI creates a complete welcome kit instantly." },
                  { title: "Welcome", icon: Smile, desc: "Deliver a beautiful, organized Day 1 experience." }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    <div className={`w-24 h-24 rounded-full ${theme.card} shadow-xl border ${theme.accent} flex items-center justify-center mb-8 transform transition-transform group-hover:scale-110 duration-500`}>
                      <item.icon size={32} className={theme.secondary} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
                    <p className="opacity-70 max-w-xs">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Extra Feature visual */}
              <div className="mt-32 flex flex-col md:flex-row items-center gap-16">
                 <div className="flex-1 space-y-6">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold">Timeline-based organization</h2>
                    <p className="text-lg opacity-70 leading-relaxed">
                      Instead of scattered documents, use our structured timeline folders. 
                      Guide your new hires through their journey from Day 1 to their first big win.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider opacity-60">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"/> Day 1</div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> Week 1</div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"/> Benefits</div>
                    </div>
                 </div>
                 <div className="flex-1 relative">
                    <div className={`w-full aspect-video rounded-3xl ${theme.card} shadow-2xl border ${theme.accent} flex items-center justify-center overflow-hidden`}>
                       <div className="absolute inset-0 opacity-10 flex items-center justify-center text-9xl font-serif font-bold select-none">
                          HR
                       </div>
                       <h1 className="text-4xl md:text-5xl font-serif font-bold opacity-20">Organized <br/><span className={theme.secondary}>Timelines</span></h1>
                    </div>
                 </div>
              </div>

              <div className="mt-32 text-center">
                 <Button onClick={() => setView('dashboard')} className={`${theme.primary} text-white mx-auto`} icon={ArrowRight}>
                   Try Demo
                 </Button>
                 <p className="mt-4 text-xs opacity-50">No credit card required</p>
              </div>

            </div>
          </div>

          <footer className="w-full py-8 border-t border-current border-opacity-10 mt-12">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center opacity-60 text-sm">
               <div className="flex items-center gap-2">
                 <Smile size={16} /> OnboardFlow
               </div>
               <p>© 2025 OnboardFlow. All rights reserved.</p>
            </div>
          </footer>

        </main>
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme.bg} ${theme.text} flex`}>
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        theme={theme}
        userName={userName}
        setUserName={setUserName}
        defaultTone={tone}
        setDefaultTone={setTone}
      />

      <InviteModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        theme={theme}
        onInvite={handleInvite}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className={`absolute top-0 left-0 w-3/4 max-w-xs h-full ${theme.card} shadow-2xl border-r ${theme.accent} p-6 animate-slide-up flex flex-col`}>
             <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-2 font-serif font-bold text-xl">
                 <Smile className={`w-5 h-5 ${theme.secondary}`} />
                 OnboardFlow
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-full">
                 <X size={20} />
               </button>
             </div>
             
             {/* Navigation Links */}
             <div className="space-y-2 flex-1">
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 px-3 mb-4">Onboarding Timeline</h4>
                  <div className="space-y-2">
                    {folders.map(folder => (
                      <button 
                        key={folder.id} 
                        onClick={() => {
                          handleFolderChange(folder.name);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-black/5 transition-all group ${activeFolder === folder.name ? `${theme.primary} text-white shadow-lg` : 'opacity-80'}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${activeFolder === folder.name ? 'bg-white' : folder.color}`} />
                        <span className="flex-1 text-left">{folder.name}</span>
                        <span className={`text-xs opacity-50 group-hover:opacity-100 ${activeFolder === folder.name ? 'text-white' : ''}`}>{folder.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
             </div>

             <div className="mt-auto flex flex-col gap-2">
                <button 
                  onClick={() => {
                    cycleTheme();
                  }} 
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition-all opacity-70 hover:opacity-100`}
                >
                  <Palette size={20} />
                  <span className="font-medium">Theme: {theme.name}</span>
                </button>
                <button 
                  onClick={() => {
                    setShowSettings(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition-all opacity-70 hover:opacity-100`}
                >
                  <Settings size={20} />
                  <span className="font-medium">Settings</span>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Sticky Window Scroll) */}
      <aside className={`w-20 lg:w-64 border-r ${theme.accent} backdrop-blur-xl flex flex-col justify-between p-4 hidden md:flex transition-all duration-300 sticky top-0 h-screen`}>
        <div>
          <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className={`w-8 h-8 rounded-lg ${theme.primary} flex items-center justify-center`}>
              <Smile className="text-white w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xl hidden lg:block">OnboardFlow</span>
          </div>

          <div className="mt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 px-3 mb-4 hidden lg:block">Onboarding Timeline</h4>
            <div className="space-y-2">
              {folders.map(folder => (
                <button 
                  key={folder.id} 
                  onClick={() => handleFolderChange(folder.name)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition-all group ${activeFolder === folder.name ? `${theme.primary} text-white shadow-lg` : 'opacity-80'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeFolder === folder.name ? 'bg-white' : folder.color}`} />
                  <span className="hidden lg:block flex-1 text-left">{folder.name}</span>
                  <span className={`hidden lg:block text-xs opacity-50 group-hover:opacity-100 ${activeFolder === folder.name ? 'text-white' : ''}`}>{folder.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={cycleTheme} className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition-all opacity-70 hover:opacity-100`}>
            <Palette size={20} />
            <span className="hidden lg:block font-medium">Theme: {theme.name}</span>
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition-all opacity-70 hover:opacity-100`}>
            <Settings size={20} />
            <span className="hidden lg:block font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Bar */}
        <header className={`h-16 border-b ${theme.accent} flex items-center justify-between px-6 bg-opacity-50 backdrop-blur-md z-10 sticky top-0 bg-white/5`}>
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 hover:bg-black/5 rounded-full" onClick={() => setIsMobileMenuOpen(true)}>
               <Menu size={20} />
            </button>
            <h2 className="font-serif text-xl font-bold">{activeFolder}</h2>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Collaborators / Team */}
             <div className="hidden md:flex items-center gap-2 mr-4 pl-4 border-l border-current border-opacity-10">
               <div className="flex -space-x-2">
                 {collaborators.map((c) => (
                   <div key={c.id} className={`w-8 h-8 rounded-full ${c.color} text-white text-xs font-bold flex items-center justify-center border-2 border-white cursor-pointer hover:scale-110 transition-transform`} title={c.name}>
                     {c.initial}
                   </div>
                 ))}
               </div>
               <button 
                 onClick={() => setShowInviteModal(true)}
                 className="w-8 h-8 rounded-full border-2 border-dashed border-current border-opacity-30 flex items-center justify-center hover:bg-black/5 transition-colors"
                 title="Invite Teammate"
               >
                 <UserPlus size={14} className="opacity-50" />
               </button>
             </div>

            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border ${theme.accent} bg-white/10 focus-within:ring-2 ring-current ring-opacity-20 transition-all`}>
              <Search size={16} className="opacity-50" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="bg-transparent border-none outline-none text-sm w-48 placeholder-current placeholder-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Toggle Right Panel */}
            <button 
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={`p-2 rounded-full ${showRightPanel ? 'bg-black/5' : ''} hover:bg-black/10 transition-colors relative`}
              title="Toggle Sidebar"
            >
              <Sidebar size={20} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div ref={mainContentRef} className="flex-1 p-4 md:p-8 flex flex-col lg:flex-row gap-8 relative pb-32">
          
          {/* Agent/Editor Panel */}
          <div className={`flex-1 flex flex-col gap-6 w-full min-w-0 transition-all duration-300`}>
            
            <div className={`p-6 rounded-3xl ${theme.card} shadow-sm border ${theme.accent} transition-all`}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsInputExpanded(!isInputExpanded)}>
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <Sparkles className={`w-5 h-5 ${theme.secondary}`} />
                     New Hire Details
                   </h3>
                   <div className="flex items-center gap-2">
                    {isGenerating && <span className="text-xs animate-pulse font-medium">Onboarding...</span>}
                    <button className="p-1 rounded-full hover:bg-black/5">
                      {isInputExpanded ? <ChevronUp size={20} className="opacity-50"/> : <ChevronDown size={20} className="opacity-50"/>}
                    </button>
                   </div>
                </div>

                {/* Collapsible Content */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isInputExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-col gap-4">
                    {/* Tabs */}
                    <div className={`flex p-1 rounded-xl bg-black/5 w-fit overflow-x-auto max-w-full`}>
                      {currentConfig.types.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setContentType(t.id)}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${contentType === t.id ? `${theme.bg} shadow-sm ${theme.secondary}` : 'opacity-60 hover:opacity-100'}`}
                        >
                          <t.icon size={14} />
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1 block">Employee Name</label>
                        <input 
                          value={employeeName}
                          onChange={(e) => setEmployeeName(e.target.value)}
                          placeholder="e.g. Sarah Jones"
                          className={`w-full p-3 rounded-xl bg-transparent border ${theme.accent} focus:ring-2 focus:ring-opacity-50 outline-none transition-all ${theme.primary.replace('bg-', 'ring-')}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1 block">Role Title</label>
                        <input 
                          value={roleTitle}
                          onChange={(e) => setRoleTitle(e.target.value)}
                          placeholder="e.g. Senior Product Designer"
                          className={`w-full p-3 rounded-xl bg-transparent border ${theme.accent} focus:ring-2 focus:ring-opacity-50 outline-none transition-all ${theme.primary.replace('bg-', 'ring-')}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold uppercase tracking-wider opacity-60 block">Key Information / Context</label>
                          <button 
                            onClick={handleCreativeSpark}
                            className={`text-xs flex items-center gap-1 ${theme.secondary} hover:underline font-medium`}
                          >
                            <Dice5 size={12} />
                            Idea Spark
                          </button>
                        </div>
                        <textarea 
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={currentConfig.placeholder}
                          className={`w-full p-4 rounded-xl bg-transparent border ${theme.accent} focus:ring-2 focus:ring-opacity-50 outline-none transition-all min-h-[100px] resize-none ${theme.primary.replace('bg-', 'ring-')}`}
                        />
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex-1 flex gap-4">
                            <div className="flex-1">
                              <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1 block">Platform</label>
                              <div className="flex items-center gap-2">
                                {['Email', 'Slack', 'Notion', 'PDF'].map((p) => (
                                  <button
                                    key={p}
                                    onClick={() => setPlatform(p as Platform)}
                                    className={`p-2 rounded-lg border ${platform === p ? `${theme.accent} ${theme.bg} ${theme.secondary}` : 'border-transparent hover:bg-black/5'} transition-all`}
                                    title={p}
                                  >
                                    {p === 'Email' && <Mail size={18} />}
                                    {p === 'Slack' && <span className="font-bold text-xs">#</span>}
                                    {p === 'Notion' && <span className="font-bold text-xs">N</span>}
                                    {p === 'PDF' && <span className="font-bold text-xs">PDF</span>}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1 block">Tone</label>
                                <select 
                                  value={tone}
                                  onChange={(e) => setTone(e.target.value)}
                                  className={`w-full p-2.5 rounded-xl bg-transparent border ${theme.accent} outline-none cursor-pointer`}
                                >
                                  <option className="text-black">Warm and Welcoming</option>
                                  <option className="text-black">Professional & Concise</option>
                                  <option className="text-black">Excited & High Energy</option>
                                  <option className="text-black">Structured & Formal</option>
                                </select>
                            </div>
                        </div>
                        <Button 
                          onClick={handleGenerate}
                          disabled={!employeeName || !roleTitle || isGenerating}
                          className={`${theme.primary} text-white h-[46px] w-full md:w-auto justify-center`}
                          icon={isGenerating ? RefreshCw : Sparkles}
                        >
                          {isGenerating ? 'Designing...' : 'Generate Kit'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsed Summary */}
                {!isInputExpanded && (
                  <div className="flex items-center justify-between text-sm opacity-70 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{employeeName || "Employee"}</span>
                      <span>—</span>
                      <span>{roleTitle || "Role"}</span>
                      <span className="text-xs bg-black/5 px-2 py-0.5 rounded-full uppercase tracking-wide">{contentType}</span>
                    </div>
                    <button 
                      className={`text-xs font-bold ${theme.secondary} hover:underline`} 
                      onClick={() => setIsInputExpanded(true)}
                    >
                      Edit / Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results Area */}
            {generatedResult && (
              <div ref={resultRef} className={`rounded-3xl ${theme.card} shadow-lg border ${theme.accent} animate-slide-up relative flex flex-col scroll-mt-24 min-h-[600px]`}>
                
                {/* Visual Mood Header */}
                <div 
                  className="w-full h-16 relative flex items-center justify-between px-6 shrink-0 rounded-t-3xl"
                  style={{
                    background: `linear-gradient(to right, ${generatedResult.moodColors.join(', ')})`
                  }}
                >
                   <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] rounded-t-3xl" />
                   <div className="relative z-10 flex items-center gap-3">
                     <span className="text-white font-bold text-shadow-sm drop-shadow-md text-sm uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                       Vibe: {generatedResult.moodName}
                     </span>
                     <div className="flex gap-1">
                        {generatedResult.moodColors.map(c => (
                          <div key={c} className="w-4 h-4 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: c }} title={c} />
                        ))}
                     </div>
                   </div>

                   <div className="relative z-10 flex gap-2">
                      <button 
                         onClick={() => setIsPreviewMode(false)}
                         className={`p-2 rounded-lg backdrop-blur-md transition-all text-white ${!isPreviewMode ? 'bg-white/30' : 'hover:bg-white/10'}`}
                         title="Editor View"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                         onClick={() => setIsPreviewMode(true)}
                         className={`p-2 rounded-lg backdrop-blur-md transition-all text-white ${isPreviewMode ? 'bg-white/30' : 'hover:bg-white/10'}`}
                         title="Employee App Preview"
                      >
                        <Smartphone size={18} />
                      </button>
                   </div>
                </div>
                
                {/* Content Body */}
                <div className="p-8">
                  {isPreviewMode ? (
                     // PHONE PREVIEW MODE
                     <div className="flex flex-col items-center justify-center animate-fade-in">
                        <div className="w-full max-w-[320px] bg-white text-black rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col shrink-0">
                           {/* Mock Phone Status */}
                           <div className="h-6 bg-black text-white text-[10px] flex items-center justify-between px-4">
                             <span>9:41</span>
                             <div className="flex gap-1">
                               <div className="w-3 h-3 bg-white rounded-full opacity-20"/>
                               <div className="w-3 h-3 bg-white rounded-full opacity-20"/>
                             </div>
                           </div>
                           
                           {/* Mock App Header */}
                           <div className="h-14 border-b flex items-center justify-between px-4 bg-white z-10">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold">HR</div>
                                <div className="leading-tight">
                                  <div className="font-bold text-sm">Welcome</div>
                                  <div className="text-[10px] opacity-50">Employee Portal</div>
                                </div>
                              </div>
                              <Smile size={20} className="text-gray-400" />
                           </div>

                           {/* Mock Content */}
                           <div 
                             className="w-full p-6 text-white relative overflow-hidden"
                             style={{ background: `linear-gradient(135deg, ${generatedResult.moodColors[0]}, ${generatedResult.moodColors[1]})` }}
                           >
                             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
                             <div className="relative z-10">
                               <div className="text-xs opacity-80 uppercase tracking-widest mb-1">Hello</div>
                               <div className="font-serif text-3xl font-bold mb-2">{employeeName.split(' ')[0]}</div>
                               <div className="text-xs opacity-90 bg-white/20 inline-block px-2 py-1 rounded">{roleTitle}</div>
                             </div>
                           </div>

                           {/* Mock Caption */}
                           <div className="p-6 text-sm space-y-4 bg-gray-50 flex-1 min-h-[200px]">
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-bold mb-2 text-xs uppercase opacity-60">Your {activeFolder}</h4>
                                <div className="text-xs leading-relaxed opacity-80 line-clamp-[8]">
                                  {generatedResult.content.replace(/[*#]/g, '')}
                                </div>
                              </div>
                              <button className="w-full py-2 bg-black text-white rounded-lg text-xs font-bold">Start Checklist</button>
                           </div>
                        </div>
                        <p className="mt-4 text-xs opacity-50 font-medium">Previewing Employee Portal</p>
                     </div>
                  ) : (
                    // NORMAL TEXT + BADGE MODE - SIDE BY SIDE on Large Screens
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-5 h-5 ${theme.secondary}`} />
                            <span className="font-bold opacity-80 capitalize">{getGeneratedLabel()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              className="p-2 hover:bg-black/5 rounded-full transition-colors" 
                              title="Share" 
                              onClick={handleShare}
                            >
                              <Share2 size={18} opacity={0.5} />
                            </button>
                            <button 
                              className="p-2 hover:bg-black/5 rounded-full transition-colors" 
                              title="Download PDF" 
                              onClick={handleDownloadPDF}
                            >
                              <Download size={18} opacity={0.5} />
                            </button>
                            <button 
                              className="p-2 hover:bg-black/5 rounded-full transition-colors" 
                              title="Copy to clipboard" 
                              onClick={() => navigator.clipboard.writeText(generatedResult.content)}
                            >
                              <Copy size={18} opacity={0.5} />
                            </button>
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-bold opacity-90 leading-relaxed whitespace-pre-wrap font-sans">
                          {generatedResult.content}
                        </div>
                        
                        {/* Mobile-only Jump to Badge */}
                        <button 
                          onClick={() => {
                             const badge = document.getElementById('employee-badge');
                             badge?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="lg:hidden mt-8 w-full py-3 rounded-xl bg-black/5 font-bold text-sm flex items-center justify-center gap-2"
                        >
                          <ArrowDown size={16} /> Jump to Badge
                        </button>
                      </div>

                      {/* EMPLOYEE BADGE DISPLAY */}
                      <div className="flex-none flex flex-col items-center mx-auto lg:mx-0 lg:sticky lg:top-8 self-start">
                         <div className="mb-2 text-xs font-bold uppercase tracking-widest opacity-40">Digital Badge Generated</div>
                         <Badge 
                           id="employee-badge"
                           employeeName={employeeName}
                           roleTitle={roleTitle}
                           moodColors={generatedResult.moodColors}
                           moodName={generatedResult.moodName}
                           theme={theme}
                         />
                         <button onClick={handleDownloadPDF} className="mt-4 text-xs text-blue-500 hover:underline flex items-center gap-1">
                           <Download size={12} /> Download Badge
                         </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!generatedResult && !isGenerating && (
              <div className="flex flex-col items-center justify-center py-20 opacity-30 border-2 border-dashed rounded-3xl border-current">
                 <Smile size={48} strokeWidth={1} className="mb-4" />
                 <p>Ready to welcome your next star employee.</p>
              </div>
            )}

          </div>

          {/* Right Panel Overlay (Mobile only) */}
          {showRightPanel && (
            <div 
              className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity" 
              onClick={() => setShowRightPanel(false)}
            />
          )}

          {/* Right Panel: Collaborative Comments & History */}
          <div className={`
             fixed inset-y-0 right-0 z-30 w-80 shadow-2xl transform transition-transform duration-300 bg-white/95 backdrop-blur-xl border-l border-gray-100 p-6
             lg:relative lg:bg-transparent lg:shadow-none lg:border-none lg:p-0
             ${showRightPanel ? 'translate-x-0 lg:translate-x-0 lg:block' : 'translate-x-full lg:hidden'}
          `}>
             <div className="lg:hidden flex justify-end mb-4">
               <button onClick={() => setShowRightPanel(false)} className="p-2 hover:bg-black/5 rounded-full">
                  <X size={20} />
               </button>
             </div>
             
             <div className="flex flex-col gap-6 animate-fade-in h-full">
               <h3 className="font-serif font-bold text-xl opacity-80">Team Activity</h3>
               
               <div className="space-y-4 overflow-y-auto flex-1">
                 {/* Fake Comments/Activity */}
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex-none text-white flex items-center justify-center text-xs font-bold">A</div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-gray-100">
                       <p className="font-bold text-xs mb-1">Alex</p>
                       <p className="opacity-80">Can we make the icebreaker a bit more casual for the engineering team?</p>
                       <span className="text-[10px] opacity-40 block mt-2">Just now</span>
                    </div>
                 </div>

                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex-none text-white flex items-center justify-center text-xs font-bold">S</div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-gray-100">
                       <p className="font-bold text-xs mb-1">Sam</p>
                       <p className="opacity-80">I love the 'Neon Future' vibe for the Q3 hires!</p>
                       <span className="text-[10px] opacity-40 block mt-2">10m ago</span>
                    </div>
                 </div>

                 <div className="border-t border-dashed border-current border-opacity-20 my-2" />
                 
                 <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Recent Drafts</h4>
                 {[1, 2].map((i) => (
                   <div key={i} className={`p-4 rounded-2xl ${theme.card} border border-transparent hover:border-${theme.id}-200 shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md opacity-90 hover:opacity-100 group`}>
                      <div className="flex justify-between mb-2">
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${theme.bg} ${theme.secondary}`}>
                           {i === 1 ? 'Checklist' : 'Welcome'}
                         </span>
                         <span className="text-xs opacity-40">2h ago</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2 opacity-80 group-hover:opacity-100">
                        {i === 1 ? 'Day 1: Mac Setup for Alex' : 'Welcome Email for Sarah (Design)'}
                      </p>
                   </div>
                 ))}
               </div>

               <div className={`p-4 rounded-2xl bg-white border border-gray-200 mt-auto`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold opacity-60">2 teammates online</span>
                  </div>
                  <div className="flex -space-x-2">
                     {collaborators.map((c) => (
                       <div key={c.id} className={`w-6 h-6 rounded-full ${c.color} border border-white`} />
                     ))}
                  </div>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}