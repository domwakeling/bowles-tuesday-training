import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { toast } from '../../components/toast';

const ForgetPasswordPage = () => {
  async function handleSubmit(e) {
    e.preventDefault(e);

    const body = {
      email: e.currentTarget.email.value,
    };

    const res = await fetch('/api/user/resetpassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      toast.notify('A reset email has been sent', {
        type: 'success',
        title: 'Success',
        duration: 3,
      });
      Router.replace('/');
    } else {
      const errmsg = await res.text();
      toast.notify(errmsg, {
        type: 'error',
        title: 'Error',
      });
    }
  }

  return (
    <>
      <Head>
        <title>Forgotten password</title>
      </Head>
      <h2>Forgotten password</h2>
      <form onSubmit={handleSubmit}>
        <p>Do not worry. Simply enter your email address below.</p>
        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="email">e</label>
          <input
            id="email"
            type="email"
            placeholder="email"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ForgetPasswordPage;
