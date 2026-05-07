export default function LikertSlider({ labels, value, onChange }) {
  const keys = Object.keys(labels) // ['1','2','3','4','5']
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {keys.map((k) => (
          <span
            key={k}
            className="mono"
            style={{
              fontSize: 10,
              color: Number(k) === value ? 'var(--cyan)' : 'var(--ink-mute)',
              textAlign: 'center',
              flex: 1,
              lineHeight: 1.2,
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
