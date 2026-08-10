import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Download className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
            Video<span className="text-brand-500">Drop</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isActive('/')
                ? 'text-white bg-gray-800/80 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Início
          </Link>
          <Link
            to="/terms"
            className={`px-3 py-1.5 rounded-lg transition-colors hidden sm:block ${
              isActive('/terms')
                ? 'text-white bg-gray-800/80 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Termos
          </Link>
          <Link
            to="/privacy"
            className={`px-3 py-1.5 rounded-lg transition-colors hidden sm:block ${
              isActive('/privacy')
                ? 'text-white bg-gray-800/80 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Privacidade
          </Link>
          <Link
            to="/copyright"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/copyright')
                ? 'text-white bg-gray-800/80 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span className="hidden sm:inline">Direitos Autorais</span>
            <span className="sm:hidden">Copyright</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
