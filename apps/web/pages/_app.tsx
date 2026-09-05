import type { AppProps } from 'next/app';
import NavBar from '../src/components/NavBar';
import '../src/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
