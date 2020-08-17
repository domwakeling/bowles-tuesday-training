import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>Bowles SRC - Tuesday Training Sessions</title>
        <link rel="shortcut icon" href="favicon.png" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
