import React from 'react';
import { styles } from '../../ui/theme.js';

export default function Button({ variant = 'primary', children, style, ...props }) {
  const base = variant === 'secondary' ? styles.btnSecondary : styles.btnPrimary;
  return (
    <button style={{ ...base, ...(style ?? {}) }} {...props}>
      {children}
    </button>
  );
}

