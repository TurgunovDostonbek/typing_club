import React, { useState } from 'react';

export default function ModeSelector({ activeTime, onSelectTime }) {
  const timePresets = [15, 30, 60, 120];
  const [customVal, setCustomVal] = useState('');

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Allow only digits
    setCustomVal(val);
    if (val) {
      const numericVal = parseInt(val, 10);
      if (numericVal > 0 && numericVal <= 3600) {
        onSelectTime(numericVal);
      }
    }
  };

  const handlePresetSelect = (time) => {
    setCustomVal('');
    onSelectTime(time);
  };

  const isCustomActive = !timePresets.includes(activeTime);

  return (
    <div className="mode-selector" style={{ margin: '0 auto 1.5rem auto' }}>
      {timePresets.map((time) => (
        <button
          key={time}
          type="button"
          onClick={() => handlePresetSelect(time)}
          className={`mode-btn ${activeTime === time ? 'active' : ''}`}
        >
          {time}s
        </button>
      ))}
      <div 
        className={`mode-btn ${isCustomActive ? 'active' : ''}`} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.75rem' }}
      >
        <span style={{ fontSize: '0.8rem' }}>Custom:</span>
        <input
          type="text"
          value={customVal || (isCustomActive ? activeTime : '')}
          onChange={handleCustomChange}
          placeholder="sec"
          className="custom-time-input"
          style={{
            padding: '0.125rem 0.25rem',
            fontSize: '0.8rem',
            width: '3rem'
          }}
          maxLength={4}
        />
      </div>
    </div>
  );
}
