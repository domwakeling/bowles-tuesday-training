import React from 'react';
import useSWR from 'swr';
import { useCurrentUser } from '../lib/hooks';
import Racer from './racer';
import fetcher from '../lib/fetch';

export const getTuesday = () => {
  const date = new Date();
  // eslint-disable-next-line no-mixed-operators
  date.setDate(date.getDate() + (9 - date.getDay()) % 7);
  const ds0 = (`0${date.getDate()}`).slice(-2) + (`0${date.getMonth() + 1}`).slice(-2) + date.getFullYear();
  let ds1 = date.toDateString().split(' ');
  ds1 = `${ds1[2]} ${ds1[1]} ${ds1[3]}`;
  date.setDate(date.getDate() - 7);
  const ds2 = (`0${date.getDate()}`).slice(-2) + (`0${date.getMonth() + 1}`).slice(-2) + date.getFullYear();
  return [ds0, ds1, ds2];
};

const Bookings = () => {
  const [user] = useCurrentUser();
  const ds = getTuesday();
  // update every 60 seconds; also triggered by adding/removing a racer
  const { data, error } = useSWR(`/api/booking/${ds[0]}`, fetcher, { refreshInterval: 60000 });

  if (error) return <div>failed to load</div>;

  if (!data) {
    return (
      <div>
        <h2>
          Bookings for
          {' '}
          {ds[1]}
        </h2>
        <p>loading...</p>
        <br />
      </div>
    );
  }

  const idxs = [0, 1, 2, 3, 4, 5, 6, 7];

  const firstTues = parseInt(ds[0].substring(0, 2), 10) <= 7;

  return (
    <div>
      <h2>
        Bookings for
        {' '}
        {ds[1]}
      </h2>
      {(ds[0] === '12082025' || ds[0] === '09092025') ? (
        <div className="alert-text">
          <p>
            Training is cancelled for Tuesday 9th September, unfortunately none of the
            coaches are available

          </p>
        </div>
      ) : (
        <>
          <br />
          { firstTues ? (
            <div>
              <p className="alert-text">
                The first Tuesday training each month is an Over The Hill session,
                reserved for over-18s
              </p>
              <br />
            </div>
          ) : ''}
          {(ds[0] === '05092023' || ds[0] === '12092023') ? (
            <p className="alert-text">
              Please note that from the start of September, Tuesday training will be
              from 6-7pm
            </p>
          ) : '' }
          <div className="racerlist">
            {
              idxs.map((i) => (
                data && (data.length > i) ? (
                  <Racer
                    key={i}
                    tabNum={i}
                    name={data[i].name}
                    status={(user && data[i].userid === user._id) ? 'highlight' : 'normal'}
                  />
                ) : (
                  <Racer key={i} name="free" status="unused" />
                )
              ))
            }
          </div>
        </>
      )}
    </div>
  );
};

export default Bookings;
