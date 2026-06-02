export default function LikertSlider({ labels, value, onChange }) {
  const keys = Object.keys(labels)
  return (
    <div style={{ padding: '18px 0 6px' }}>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value || 3}
        onChange={(e) => onChange(Number(e.target.value))}
        className="likert-range"
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {keys.map((k) => (
          <span
            key={k}
            style={{
              fontSize: 10,
              color: Number(k) === value ? '#843497' : '#9ca3af',
              fontFamily: 'var(--font-mono)',
              textAlign: 'center',
              flex: 1,
              lineHeight: 1.3,
              fontWeight: Number(k) === value ? 600 : 400,
            }}
          >
            {k}
            <br />
            <span style={{ fontSize: 9, display: 'block' }}>{labels[k]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
