import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import dynamic from 'next/dynamic';
const P5Component = dynamic(() => import('../components/P5Component'), { ssr: false });

const IndexPage = () => {
	return (
		<Layout title="ELECTRON BASIC DEVELOP ENVIRONMENT">
			<P5Component />
		</Layout>
	);
};

export default IndexPage;
