import { ApolloProvider } from '@apollo/client';
import Layout from '../components/Layout';
import client from "../lib/apolloClient";

export default function App({ Component, pageProps }) {

  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}
