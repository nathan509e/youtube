import React, { useState } from 'react';
import { UrlInput } from '../components/UrlInput';
import { PlatformBadges } from '../components/PlatformBadge';
import { ProcessingSteps } from '../components/ProcessingSteps';
import { VideoCard } from '../components/VideoCard';
import { ErrorAlert } from '../components/ErrorAlert';
import { RecentHistory } from '../components/RecentHistory';
import { useHistory } from '../hooks/useHistory';
import { fetchVideoInfo } from '../services/api';
import { VideoInfoResponse, ProcessingStep } from '../types';
import { Download, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>(1);
  const [videoInfo, setVideoInfo] = useState<VideoInfoResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { history, addHistory, clearHistory, removeHistory } = useHistory();

  const handleProcessUrl = async (url: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setVideoInfo(null);
    setCurrentStep(1);

    // Step 1: Analisando link
    const step2Timer = setTimeout(() => setCurrentStep(2), 600);
    const step3Timer = setTimeout(() => setCurrentStep(3), 1400);

    try {
      const data = await fetchVideoInfo(url);
      setVideoInfo(data);

      // Save to recent history
      addHistory({
        url: data.url,
        title: data.title,
        thumbnail: data.thumbnail,
        platform: data.platform,
      });
    } catch (err: any) {
      setErrorMsg(
        err.message || 'Não conseguimos acessar esse vídeo. Verifique se ele é público e se você possui autorização para baixá-lo.'
      );
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto px-4 sm:px-6 w-full pt-12 pb-16 relative">
      
      {/* Subtle Ambient Glows */}
      <div className="glow-bg w-96 h-96 bg-brand-600 top-10 left-1/2 -translate-x-1/2" />

      <main className="flex-1 flex flex-col items-center justify-center text-center my-auto">
        
        {/* Main Hero Header */}
        <div className="space-y-4 max-w-3xl mb-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Processamento 100% no Backend • Sem Anúncios</span>
          </div>

          {/* Logo Name */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-brand-500/30">
              <Download className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Video<span className="text-brand-500">Drop</span>
            </h1>
          </div>

          {/* Main Title & Subtitle */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Baixe seus vídeos de forma simples
          </h2>

          <p className="text-base sm:text-lg text-gray-400 font-medium max-w-2xl mx-auto">
            Cole o link de um vídeo que você possui ou tem autorização para baixar.
          </p>
        </div>

        {/* Input Component */}
        <div className="w-full space-y-6">
          <UrlInput onSubmit={handleProcessUrl} isLoading={isLoading} />

          {/* Platform Badges */}
          <PlatformBadges />
        </div>

        {/* Step Loader during fetch */}
        {isLoading && <ProcessingSteps currentStep={currentStep} />}

        {/* Error Alert */}
        {errorMsg && (
          <ErrorAlert message={errorMsg} onDismiss={() => setErrorMsg(null)} />
        )}

        {/* Video Preview Card */}
        {videoInfo && !isLoading && <VideoCard info={videoInfo} />}

        {/* Recent Downloads History */}
        {!isLoading && (
          <RecentHistory
            history={history}
            onSelect={handleProcessUrl}
            onClear={clearHistory}
            onRemove={removeHistory}
          />
        )}

      </main>
    </div>
  );
};
