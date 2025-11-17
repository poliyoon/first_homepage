import React, { useState } from 'react';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon } from './IconComponents';

const DescriptionGenerator: React.FC = () => {
  const [productName, setProductName] = useState<string>('대나무 식기 세트');
  const [keywords, setKeywords] = useState<string>('친환경, 재사용 가능, 휴대용, 제로 웨이스트');
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedDescription('');

    try {
      const description = await generateDescription(productName, keywords);
      setGeneratedDescription(description);
    } catch (err) {
      const message = err instanceof Error ? err.message : '설명 생성에 실패했습니다. API 키를 확인하고 다시 시도해 주세요.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-tool" className="py-16 sm:py-24 bg-stone-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-sky-800 sm:text-4xl">AI 기반 제품 설명 생성기</h2>
          <p className="mt-4 text-lg text-stone-600">
            카피라이팅이 어려우신가요? 드롭쉬핑 제품을 위한 매력적이고 SEO에 최적화된 설명을 몇 초 만에 생성해 보세요.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-stone-700">
                제품명
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="예: 재사용 가능한 밀랍 랩"
                required
              />
            </div>
            
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-stone-700">
                키워드 (쉼표로 구분)
              </label>
              <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="예: 지속 가능한, 유기농 면, 플라스틱 프리"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-stone-400 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? '생성 중...' : '설명 생성하기'}
                {!isLoading && <SparklesIcon className="h-5 w-5" />}
              </button>
            </div>
          </form>

          {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          
          {generatedDescription && (
            <div className="mt-8 pt-6 border-t border-stone-200">
              <h3 className="text-lg font-semibold text-stone-800">생성된 설명:</h3>
              <div className="mt-2 p-4 bg-stone-50 rounded-md border border-stone-200">
                <p className="text-stone-700 whitespace-pre-wrap">{generatedDescription}</p>
              </div>
            </div>
          )}

          {isLoading && (
             <div className="mt-8 pt-6 border-t border-stone-200 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                <p className="mt-2 text-stone-600">AI가 완벽한 설명을 만들고 있습니다...</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DescriptionGenerator;