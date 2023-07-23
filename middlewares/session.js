import { session, expressSession } from 'next-session';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(expressSession);

export default function getSession(req, res, next) {
  const mongoStore = new MongoStore({
    client: req.dbClient,
    stringify: false,
  });
  return session({
    store: mongoStore,
  })(req, res, next);
}
