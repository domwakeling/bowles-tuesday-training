import React from 'react';
import Link from 'next/link';
import { useCurrentUser } from '../lib/hooks';
import Racer from '../components/racer';
import Bookings, { getFriday } from '../components/bookings';
import { toast } from '../components/toast';

const IndexPage = () => {
  const [user] = useCurrentUser();

  async function handleRacerClick(id, name) {
    const ds = getFriday()[0]; // gets the 8-digit datestring for this Friday
    const body = {
      id,
      name,
    };
    const res = await fetch(`/api/booking/${ds}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      toast.notify('Changes confirmed', {
        type: 'success',
        title: 'Success',
        duration: 1,
      });
    } else {
      toast.notify('No places available', {
        type: 'warn',
        title: 'Warning',
      });
    }
  }

  return (
    <div>
      <h2>
        Friday Night Training
      </h2>
      { user ? (
        <>
          {user.racers && user.racers.length > 0 ? (
            <div>
              <p>
                There
                {' '}
                {user.racers.length === 1 ? 'is' : 'are'}
                {' '}
                {user.racers.length}
                {' '}
                {user.racers.length === 1 ? 'racer' : 'racers'}
                {' '}
                on your account. Tap/click
                on a racer&apos;s name to add or remove them from the training list.
              </p>
              <div className="racerlist">
                {
                  user.racers.map((racer, idx) => (
                    <Racer
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx}
                      tabNum={idx}
                      name={racer}
                      status="normal"
                      clickhandler={handleRacerClick}
                      userid={user._id}
                    />
                  ))
                }
              </div>
              <p>
                Do you want to
                {' '}
                <Link href="/addracer"><a>add another racer</a></Link>
                ?
              </p>
            </div>
          ) : (
            <p>
              Please
              <Link href="/addracer"><a>add a racer</a></Link>
              .
            </p>
          )}
          <hr />
          <Bookings />
        </>
      ) : (
        <p>
          Please either
          {' '}
          <Link href="/login"><a>sign in</a></Link>
          {' '}
          or
          {' '}
          <Link href="/signup"><a>sign up</a></Link>
          .
        </p>
      )}
    </div>
  );
};

export default IndexPage;
