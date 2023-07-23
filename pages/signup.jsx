import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import Link from 'next/link';
import { useCurrentUser } from '../lib/hooks';
import { toast } from '../components/toast';

const SignupPage = () => {
  const [user, { mutate }] = useCurrentUser();

  // redirect to home if user is authenticated
  useEffect(() => {
    if (user) Router.replace('/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
      secret: e.currentTarget.secret.value,
    };
    const res = await fetch('/api/newuser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 201) {
      toast.notify('Your account is being set up', {
        type: 'success',
        title: 'Success',
        duration: 2,
      });
      const userObj = await res.json();
      mutate(userObj);
    } else {
      const errmsg = await res.text();
      toast.notify(errmsg, {
        type: 'error',
        title: 'Error',
      });
    }
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <div>
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="email">e</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="email address"
            />
          </div>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="password">p</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password"
            />
          </div>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="secret">s</label>
            <input
              id="secret"
              name="secret"
              type="text"
              placeholder="secret"
            />
          </div>
          <button type="submit">Sign up</button>
        </form>
        <p>
          If you already have an account, please
          {' '}
          <Link href="/login">sign in</Link>
          .
        </p>
        <p style={{ color: '#777', textAlign: 'center' }}>
          To prevent &apos;nuisance&apos; accounts we need you to enter a
          {' '}
          <b>secret</b>
          {' '}
          when making an account. You can find out what this is through the Facebook or
          WhatsApp groups.
        </p>
      </div>
    </>
  );
};

export default SignupPage;
