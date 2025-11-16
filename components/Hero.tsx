import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-stone-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-stone-100 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-stone-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">지속 가능한 삶,</span>
                <span className="block text-sky-600 xl:inline"> 간편하게 받아보세요.</span>
              </h1>
              <p className="mt-3 text-base text-stone-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                엄선된 고품질의 친환경 제품을 만나보세요. 저희가 물류를 처리해 드릴 테니, 당신은 더 푸른 집을 즐기기만 하세요.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a
                    href="#products"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 md:py-4 md:text-lg md:px-10 transition-transform transform hover:scale-105"
                  >
                    컬렉션 쇼핑하기
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#ai-tool"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 md:py-4 md:text-lg md:px-10 transition-transform transform hover:scale-105"
                  >
                    AI 생성기
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://picsum.photos/seed/eco-kitchen/1200/800"
          alt="친환경 주방용품"
        />
      </div>
    </div>
  );
};

export default Hero;