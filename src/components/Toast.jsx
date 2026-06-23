import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type} ${visible ? 'toast-show' : 'toast-hide'}`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
      <span>{message}</span>
    </div>
  );
}
