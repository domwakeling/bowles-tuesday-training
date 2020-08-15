// take only needed user fields to avoid sensitive ones (such as password)
export function extractUser(req) {
  if (!req.user) return null;
  const {
    _id, email, racers,
  } = req.user;
  return {
    _id, email, racers,
  };
}
