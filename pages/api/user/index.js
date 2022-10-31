import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import { extractUser } from '../../../lib/api-helpers';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const user = extractUser(req);
  // eslint-disable-next-line no-console
  console.log('/api/user called, user:', user);
  res.json({ user });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
