import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import '../styles/app.scss';

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	return (
		<Component key={router.asPath} {...pageProps} />
	);
}
