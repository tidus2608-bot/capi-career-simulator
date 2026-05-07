export default function Transition({ k, children }) {
  return (
    <div key={k} className="fade-in" style={{ position: 'absolute', inset: 0 }}>
      {children}
    </div>
  )
}
