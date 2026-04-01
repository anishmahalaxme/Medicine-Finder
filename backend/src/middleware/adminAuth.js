export function requireAdminToken(req, res, next) {
  const token = req.get('x-admin-token');
  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ error: 'SERVER_MISCONFIGURED' });
  }
  if (token && token === process.env.ADMIN_TOKEN) return next();
  return res.status(401).json({ error: 'UNAUTHORIZED' });
}

