import React, { useState } from 'react';

interface SignInProps {
  onSignIn: (email: string) => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      onSignIn(email);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] animate-fade-in">
            {/* Logo Area */}
            <div className="flex justify-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl shadow-orange-900/20">
                    <i className="fas fa-layer-group text-orange-500 text-xl"></i>
                </div>
            </div>

            {/* Card */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Sign in to Gemini</h2>
                    <p className="text-zinc-500 text-sm">Welcome back! Please enter your details.</p>
                </div>

                <div className="space-y-4">
                    <button className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-2.5 rounded-lg flex items-center justify-center gap-3 transition-all text-sm">
                        <i className="fab fa-google text-lg"></i>
                        Sign in with Google
                    </button>
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-zinc-800"></div>
                        <span className="flex-shrink mx-4 text-zinc-600 text-xs uppercase font-bold">Or continue with</span>
                        <div className="flex-grow border-t border-zinc-800"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm placeholder-zinc-600"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-all text-sm shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <i className="fas fa-circle-notch fa-spin"></i>
                            ) : (
                                <span>Continue</span>
                            )}
                            {!isLoading && <i className="fas fa-arrow-right text-xs"></i>}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-zinc-500">
                        Don't have an account? <a href="#" className="text-orange-500 hover:text-orange-400 font-medium">Sign up</a>
                    </p>
                </div>
            </div>
            
            <div className="mt-8 text-center flex items-center justify-center gap-4 text-zinc-600 text-xs">
                 <a href="#" className="hover:text-zinc-400">Terms</a>
                 <a href="#" className="hover:text-zinc-400">Privacy</a>
                 <a href="#" className="hover:text-zinc-400">Docs</a>
            </div>
        </div>
    </div>
  );
};