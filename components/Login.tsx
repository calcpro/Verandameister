
import React, { useState } from 'react';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';
import Logo from './Logo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Hardcoded credentials as requested
    setTimeout(() => {
      if (username === 'Verandameister' && password === 'Welkom123!') {
        localStorage.setItem('vm_auth', 'true');
        onLogin();
      } else {
        setError('Onjuiste gebruikersnaam of wachtwoord.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-['DM Sans',sans-serif]">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-12">
          <Logo />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 p-10 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C5A021]"></div>
          
          <div className="mb-10 text-center">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Partner Portal</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Voer uw gegevens in om verder te gaan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Gebruikersnaam</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Gebruikersnaam" 
                  className="w-full bg-[#F8F9FA] border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#C5A021]/20 transition-all placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Wachtwoord</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  className="w-full bg-[#F8F9FA] border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#C5A021]/20 transition-all placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-xl animate-in shake duration-300">
                <AlertCircle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wide">{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifiëren...</span>
                </>
              ) : (
                <span>Inloggen</span>
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} VerandaMeister B.V.
        </p>
      </div>
    </div>
  );
};

export default Login;
