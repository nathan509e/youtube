import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gray-800/80 space-y-8">
        
        <div className="flex items-center gap-3 pb-6 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-brand-900/60 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Termos de Uso</h1>
            <p className="text-xs sm:text-sm text-gray-400">Última atualização: Agosto de 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Aceitação dos Termos</h2>
            <p>
              Ao utilizar a plataforma VideoDrop, você concorda expressamente em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com qualquer um destes termos, está proibido de usar ou acessar este site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Uso Autorizado</h2>
            <p>
              O VideoDrop é uma ferramenta desenvolvida exclusivamente para download e salvamento de conteúdos próprios, arquivos de domínio público ou mídias para as quais o usuário possua autorização expressa do titular dos direitos autorais.
            </p>
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs sm:text-sm flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                É estritamente proibido utilizar o serviço para baixar, distribuir ou reproduzir material protegido por direitos autorais sem a devida permissão prévia do proprietário do conteúdo.
              </span>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Responsabilidade do Usuário</h2>
            <p>
              O usuário assume responsabilidade total e exclusiva por todas as ações realizadas na plataforma, incluindo a verificação da titularidade dos direitos ou licenças necessárias para baixar qualquer mídia. O VideoDrop não se responsabiliza pelo uso indevido da ferramenta por terceiros.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Limitações de Responsabilidade</h2>
            <p>
              O serviço é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;. O VideoDrop não garante a disponibilidade ininterrupta do serviço nem se responsabiliza por bloqueios, restrições ou alterações nas políticas das plataformas de origem (YouTube, Instagram, etc.).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de revisar estes Termos de Uso a qualquer momento, sem aviso prévio. Ao continuar a usar o site após alterações, você concorda em se submeter à versão atualizada dos termos.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
