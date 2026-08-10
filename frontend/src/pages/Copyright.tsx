import React from 'react';
import { ShieldCheck, AlertCircle, Mail } from 'lucide-react';

export const Copyright: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gray-800/80 space-y-8">
        
        <div className="flex items-center gap-3 pb-6 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Política de Direitos Autorais</h1>
            <p className="text-xs sm:text-sm text-gray-400">Compromisso com a Proteção da Propriedade Intelectual</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-brand-500/30 space-y-2">
            <h2 className="text-base font-bold text-brand-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-400" />
              Posicionamento Anti-Pirataria
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              O <strong>VideoDrop não incentiva, tolera ou apoia a pirataria ou a violação de direitos autorais em nenhuma circunstância</strong>. A ferramenta foi projetada exclusivamente como uma utilidade para criadores de conteúdo e usuários que necessitam baixar seus próprios vídeos, arquivos sob licenças abertas ou conteúdos para os quais possuem autorização formal do detentor dos direitos.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Propriedade Intelectual</h2>
            <p>
              Todos os títulos de vídeos, marcas registradas, logotipos e conteúdos multimídia exibidos ou referenciados através do sistema pertencem aos seus respectivos proprietários e autores de origem. O VideoDrop não reivindica qualquer direito de propriedade sobre as mídias processadas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Uso Legítimo e Autorizado</h2>
            <p>
              Os usuários da plataforma declaram e garantem que têm o direito legal de baixar qualquer conteúdo que submetam ao nosso sistema. O uso do serviço para infringir direitos autorais de terceiros constitui uma violação direta dos nossos Termos de Serviço.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Notificação de Infração (DMCA / Notificação de Remoção)</h2>
            <p>
              Se você é o proprietário dos direitos autorais de algum conteúdo e acredita que seu trabalho foi disponibilizado ou acessado de forma não autorizada através de nossa plataforma, entre em contato imediatamente com nossa equipe.
            </p>
          </section>

          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Canal de Contato de Direitos Autorais</h4>
                <p className="text-xs text-gray-400">Envie sua notificação para análise imediata</p>
              </div>
            </div>
            <a
              href="mailto:copyright@videodrop.app"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
            >
              copyright@videodrop.app
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
