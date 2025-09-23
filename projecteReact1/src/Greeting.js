export default function Greeting({ name, onChangeName }) {
  return (
    <section style={cardStyle}>
      <p>
        Hola, <strong>{name}</strong> 👋
      </p>
 
      <label style={{ display: 'block', marginTop: 8 }}>
        Canvia el nom:
        <input
          style={{ marginLeft: 8 }}
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Escriu un nom..."
        />
      </label>
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
