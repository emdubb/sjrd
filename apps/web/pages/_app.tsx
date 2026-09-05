import type { AppProps } from 'next/app';
import { Anton } from 'next/font/google';
import NavBar from '../src/components/NavBar';
import Footer from '../src/components/Footer';
import '../src/styles/globals.css';

const displayFont = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={displayFont.variable}>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
