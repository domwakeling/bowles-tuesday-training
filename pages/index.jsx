import React from 'react';
import Link from 'next/link';
import { mutate } from 'swr';
import { useCurrentUser } from '../lib/hooks';
import Racer from '../components/racer';
import Bookings, { getTuesday } from '../components/bookings';
import { toast } from '../components/toast';

const IndexPage = () => {
  const [user] = useCurrentUser();

  async function handleRacerClick(id, name, club) {
    const ds = getTuesday()[0]; // gets the 8-digit datestring for this Tuesday
    const prev = getTuesday()[2];
    const body = {
      id,
      name,
      prev,
      club,
    };
    const res = await fetch(`/api/booking/${ds}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    // whatever happens, update the screen to reflect
    mutate(`/api/booking/${ds}`);
    if (res.status === 200) {
      toast.notify('Changes confirmed', {
        type: 'success',
        title: 'Success',
        duration: 1,
      });
    } else if (res.status === 409) {
      toast.notify(`That racer trained last Tuesday. In order to ensure all members get a chance to
          train, please wait until Friday before booking them in to this Tuesday's session.`, {
        type: 'warn',
        title: 'Warning',
      });
    } else if (res.status === 412) {
      toast.notify(`That racer represents another club at races, please wait until Friday before
          booking them in to this Tuesday's session.`, {
        type: 'warn',
        title: 'Warning',
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
                <Link href="/addracer">add another racer</Link>
                ?
              </p>
              <div className="racerlist">
                {
                  user.racers.map((racer, idx) => (
                    <Racer
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx}
                      tabNum={idx}
                      name={racer.name}
                      status="normal"
                      // eslint-disable-next-line react/jsx-no-bind
                      clickhandler={handleRacerClick}
                      userid={user._id}
                      club={racer.club}
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
              <Link href="/addracer">add a racer</Link>
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
            <Link href="/login">sign in</Link>
            {' '}
            or
            {' '}
            <Link href="/signup">sign up</Link>
            .
          </p>
          <br />
          <h2>How it works</h2>
          <ol className="number-circle-list number-circle-list--primary-color">
            <li className="number-circle-list--list-item">Create an account</li>
            <li className="number-circle-list--list-item">Add racers to your account</li>
            <li className="number-circle-list--list-item">Add your racers to the booking list</li>
          </ol>
          <br />
          <p>
            If you already have an account for Friday training, you can use it to sign in here (no
            need for a separate account!)
          </p>
          <p>
            Or you can
            {' '}
            <Link href="/forget-password">reset your password</Link>
            ?
          </p>
        </>
      )}
    </div>
  );
};

export default IndexPage;
