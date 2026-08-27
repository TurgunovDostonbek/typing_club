import React from 'react';
import { useSettings } from '../context/SettingsContext';

export default function VirtualKeyboard({ activeKey, incorrectKey }) {
  const { settings } = useSettings();

  // If user disabled showing the virtual keyboard in Settings, render nothing
  if (!settings.showKeyboard) return null;

  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ['space']
  ];

  const getKeyLabel = (key) => {
    if (key === 'space') return 'Space';
    return key.toUpperCase();
  };

  const isPressed = (key) => {
    if (!activeKey) return false;
    return activeKey.toLowerCase() === key.toLowerCase();
  };

  const isIncorrect = (key) => {
    if (!incorrectKey) return false;
    return incorrectKey.toLowerCase() === key.toLowerCase();
  };

  return (
    <div className="virtual-keyboard" aria-hidden="true">
      {rows.map((row, rowIdx) => (
        <div className="keyboard-row" key={rowIdx}>
          {row.map((key) => {
            const pressed = isPressed(key);
            const incorrect = isIncorrect(key);
            
            return (
              <div 
                key={key} 
                className={`key ${key} ${pressed ? 'pressed' : ''} ${incorrect ? 'key-incorrect' : ''}`}
                style={key === 'space' ? { flexGrow: 4 } : {}}
              >
                {getKeyLabel(key)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
