import nextConnect from 'next-connect';
import middleware from '../../../../middlewares/middleware';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  const forTuesday = req.query.week;

  const bookings = await req.db
    .collection('bookings')
    .findOne({
      forWeek: forTuesday,
    });

  res.send(bookings ? bookings.racers : []);
});

handler.post(async (req, res) => {
  const forTuesday = req.query.week;
  const { id, name, prev } = req.body;

  const bookings = await req.db
    .collection('bookings')
    .findOne({
      forWeek: forTuesday,
    });

  const racersCount = bookings ? bookings.racers.length : 0;
  // eslint-disable-next-line max-len
  const racerFound = bookings ? bookings.racers.filter((racer) => (racer.userid === id && racer.name === name)).length > 0 : false;

  // if no booking was found set one up; expire after 30 days (minmimse db size)
  if (!bookings) {
    await req.db
      .collection('bookings')
      .insertOne({
        forWeek: forTuesday,
        racers: [],
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
  }

  // no space and racer wasn't found
  if (racersCount >= 6 && !racerFound) {
    res.status(400);
    res.send('No places available');
    res.end();
    // res.send("No places available")
    return;
  }

  // space and racer wasn't found
  if (racersCount < 6 && !racerFound) {
    // check if it's Weds/Thurs  ...
    const today = new Date().getDay();
    if (today === 3 || today === 4) {
      // look for previous week's booking
      const prevWeek = await req.db.collection('bookings').findOne({
        forWeek: prev,
      });
      // check there is an entry and find out if this racer was booked in
      if (prevWeek
        && prevWeek.racers.filter((r) => r.userid === id && r.name === name).length > 0) {
        res.status(409);
        res.send('Racer booked previous week.');
        res.end();
        return;
      }
    }

    await req.db.collection('bookings')
      .updateOne(
        { forWeek: forTuesday },
        { $addToSet: { racers: { userid: id, name } } },
      );
    res.end('ok');
    return;
  }

  // racer was found, omit them
  await req.db.collection('bookings')
    .updateOne(
      { forWeek: forTuesday },
      { $pull: { racers: { userid: id, name } } },
    );

  res.end('ok');
});

export default handler;
