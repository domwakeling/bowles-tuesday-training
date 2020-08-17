import React from 'react';
import Link from 'next/link';
import { useCurrentUser } from '../lib/hooks';
import Racer from '../components/racer';
import Bookings, { getTuesday } from '../components/bookings';
import { toast } from '../components/toast';

const IndexPage = () => {
  const [user] = useCurrentUser();

  async function handleRacerClick(id, name) {
    const ds = getTuesday()[0]; // gets the 8-digit datestring for this Tuesday
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
        Tuesday Night Training
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
                on your account. Do you want to
                {' '}
                <Link href="/addracer"><a>add another racer</a></Link>
                ?
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
                Tap/click on a racer&apos;s name above to add or remove them from the training list.
              </p>
            </div>
          ) : (
            <p>
              Please
              {' '}
              <Link href="/addracer"><a>add a racer</a></Link>
              .
            </p>
          )}
          <hr />
          <Bookings />
        </>
      ) : (
        <>
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
          <br />
          <h2>How it works</h2>
          <ol className="number-circle-list number-circle-list--primary-color">
            <li className="number-circle-list--list-item">Create an account</li>
            <li className="number-circle-list--list-item">Add racers to your account</li>
            <li className="number-circle-list--list-item">Add your racers to the booking list</li>
          </ol>
          <p>
            If you already have an account for Friday training, you can use it to sign in here (no
            need for a separate account!)
          </p>
        </>
      )}
    </div>
  );
};

export default IndexPage;
