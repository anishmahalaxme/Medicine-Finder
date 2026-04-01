import React from 'react';
import { styles } from '../../ui/theme.js';

export default function Card({ children, style }) {
  return <div style={{ ...styles.card, ...(style ?? {}) }}>{children}</div>;
}

