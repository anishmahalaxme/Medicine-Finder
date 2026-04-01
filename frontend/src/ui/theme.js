export const colors = {
  pageBg: '#f8fafc',
  textPrimary: '#0f172a',
  textMuted: '#475569',
  textSubtle: '#64748b',
  border: '#e2e8f0',
  cardBorder: '#e5e7eb'
};

export const styles = {
  container: {
    maxWidth: 1080,
    margin: '0 auto',
    padding: 20,
    display: 'grid',
    gap: 16
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    gap: 12
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.textPrimary
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted
  },
  footer: {
    padding: '12px 0',
    fontSize: 12,
    color: colors.textSubtle
  },
  card: {
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 12,
    padding: 16,
    background: 'white'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: `1px solid ${colors.border}`,
    outline: 'none'
  },
  btnPrimary: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #0f172a',
    background: '#0f172a',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 700
  },
  btnSecondary: {
    padding: '10px 14px',
    borderRadius: 10,
    border: `1px solid ${colors.border}`,
    background: 'white',
    color: '#0f172a',
    cursor: 'pointer',
    fontWeight: 700
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13
  }
};

