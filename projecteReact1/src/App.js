import { useState } from 'react'
import Greeting from './Greeting.js'
import Counter from './Counter.js'
 
export default function App() {
  const [name, setName] = useState('Marta')
 
  return (
    <main style={styles.container}>
      <h1>Components amb React</h1>
 
      {/* Pas de props i input controlat */}
      <Greeting name={name} onChangeName={setName} />
 
      {/* Reutilització del component amb props diferents */}
      <Counter initial={1} step={1} />
      <Counter initial={10} step={5} />
    </main>
  )
}

const styles = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.4,
    padding: 24,
    maxWidth: 640,
    margin: '0 auto'
  }
}

