import React from 'react';
import ProductCard from './components/ProductCard';

export default function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',     // 🔑 centrado horizontal
        justifyContent: 'center', // 🔑 centrado vertical (si hay espacio)
        minHeight: '100vh',
        background: '#f5f6f8',
        gap: '40px',
        padding: '40px 20px',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Demo ProductCard</h1>

      <ProductCard initialSoldOut={false} />
      <ProductCard initialSoldOut={true} />
    </div>
  );
}
