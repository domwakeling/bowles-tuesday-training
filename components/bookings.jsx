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
  return (
    <div>
      <h2>
        Bookings for
        {' '}
        {ds[1]}
      </h2>
      { ds[0] === '23032021' ? (
        <div className="alert-text">
          <p>The centre is currently shut in accordance with Covid restrictions.</p>
          <p>Bookings for Tuesday 30 March will open at midnight on the Tues/Weds 23/24.</p>
        </div>
      ) : (
        <>
          <br />
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
