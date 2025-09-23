import { useState } from 'react'
 
export default function Counter({ initial = 0, step = 1 }) {
  const [count, setCount] = useState(initial)
 
  const inc = () => setCount((c) => c + step)
  const dec = () => setCount((c) => c - step)
  const reset = () => setCount(initial)
 
  const isEven = count % 2 === 0
 
  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>Comptador: {count}</h2>
 
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={dec}>- {step}</button>
        <button onClick={inc}>+ {step}</button>
        <button onClick={reset}>Reinicia</button>
      </div>
 
      <small style={{ display: 'block', marginTop: 8, color: isEven ? 'teal' : 'orange' }}>
        {isEven ? 'És parell' : 'És imparell'}
      </small>
    </section>
  )
}
 
const cardStyle = {
  border: '1px solid #ddd',
  padding: 16,
  borderRadius: 8,
  marginBottom: 16,
  background: '#fff'
}
