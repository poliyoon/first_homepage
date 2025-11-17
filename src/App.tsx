import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import DescriptionGenerator from './components/DescriptionGenerator';
import Footer from './components/Footer';
import { products } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <section id="products" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-sky-800 sm:text-4xl">엄선된 컬렉션</h2>
              <p className="mt-4 text-lg text-stone-600">의식 있는 라이프스타일을 위한 지속 가능한 제품을 직접 만나보세요.</p>
            </div>
            <ProductGrid products={products} />
          </div>
        </section>
        <DescriptionGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default App;
