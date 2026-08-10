import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-gray-800/80 bg-dark-base/80 backdrop-blur-md pt-10 pb-8 text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Compliance Legal Warning Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-gray-900/60 border border-gray-800/80 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            <strong>Aviso de Uso Responsável:</strong> Use esta ferramenta somente para conteúdo que você possui, conteúdo em domínio público ou conteúdo para o qual tenha permissão do proprietário. O usuário é o único responsável por respeitar direitos autorais e os termos das plataformas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800/50">
          <div className="text-center sm:text-left">
            <span className="font-semibold text-gray-200">VideoDrop</span> © 2026. Todos os direitos reservados.
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-gray-400">
            <Link to="/terms" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/copyright" className="hover:text-white transition-colors">
              Direitos Autorais
            </Link>
            <a href="mailto:suporte@videodrop.app" className="hover:text-white transition-colors">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
