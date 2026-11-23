function requireUser(req, res, next) {
  const owner = req.get('X-User-Id');
  if (!owner) {
    return res.status(401).json({ error: 'Cabeçalho X-User-Id é obrigatório' });
  }
  req.owner = owner;
  next();
}

module.exports = requireUser;
