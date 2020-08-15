import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCurrentUser } from '../lib/hooks';
import { toast } from '../components/toast';

const LoginPage = () => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();

  // redirect to home if user is authenticated
  useEffect(() => {
    if (user) router.push('/');
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      toast.notify('Logging in', {
        type: 'success',
        title: 'Success',
        duration: 2,
      });
      const userObj = await res.json();
      mutate(userObj);
    } else {
      toast.notify('Incorrect email or password. Try again!', {
        type: 'error',
        title: 'Error',
      });
    }
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <h2>Sign in</h2>
      <form onSubmit={onSubmit}>
        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="email">e</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email address"
          />
        </div>
        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="password">p</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="password"
          />
        </div>
        <br />
        <button type="submit">Sign in</button>
        <p>
          If you don&apos;t have an account, please
          {' '}
          <Link href="/signup"><a>sign up</a></Link>
          .
        </p>
        <p>
          <Link href="/forget-password"><a>Forgotten password</a></Link>
          ?
        </p>
        <br />
      </form>
    </>
  );
};

export default LoginPage;
