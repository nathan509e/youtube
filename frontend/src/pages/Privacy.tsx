import React from 'react';
import { Lock, HardDrive } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gray-800/80 space-y-8">
        
        <div className="flex items-center gap-3 pb-6 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Política de Privacidade</h1>
            <p className="text-xs sm:text-sm text-gray-400">Transparência e Respeito aos seus Dados</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Compromisso com a Privacidade</h2>
            <p>
              O VideoDrop preza pela sua privacidade. Não exigimos cadastro de conta, login nem a prestação de informações pessoais identificáveis para a utilização da nossa ferramenta.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Coleta de Dados no Servidor</h2>
            <p>
              Não armazenamos nem mantemos histórico de vídeos ou URLs processadas em nossos servidores. O processamento ocorre em tempo de execução para extrair e entregar o arquivo requisitado pelo usuário.
            </p>
          </section>

          <section className="space-y-2 flex items-start gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <HardDrive className="w-5 h-5 text-brand-400 shrink-0 mt-1" />
            <div>
              <h2 className="text-base font-bold text-white">3. Armazenamento Local (Histórico no Navegador)</h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Para sua conveniência, mantemos um pequeno histórico das suas buscas recentes salvo <strong>exclusivamente em seu próprio navegador (LocalStorage)</strong>. Nenhuma dessas informações é enviada ou sincronizada com servidores externos. Você pode apagar esse histórico a qualquer momento clicando no botão &quot;Limpar histórico&quot;.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Cookies e Tecnologias de Rastreamento</h2>
            <p>
              O VideoDrop não utiliza cookies de rastreamento de terceiros para perfis publicitários. Utilizamos apenas armazenamento de sessão necessário para o correto funcionamento da interface.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Contato sobre Privacidade</h2>
            <p>
              Em caso de dúvidas sobre nossa política de privacidade ou sobre o tratamento de dados, entre em contato via e-mail em <code>privacidade@videodrop.app</code>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
