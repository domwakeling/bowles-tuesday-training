export async function getUser(req, userId) {
  const user = await req.db.collection('users').findOne({
    _id: userId,
  });
  if (!user) return null;
  const {
    _id, racers,
  } = user;
  return {
    _id,
    email: null,
    racers,
  };
}
