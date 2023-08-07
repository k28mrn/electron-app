import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import dynamic from 'next/dynamic';
const SketchComponent = dynamic(() => import('../components/SketchComponet'), { ssr: false });

const IndexPage = () => {
	return (
		<Layout title="ELECTRON BASIC DEVELOP ENVIRONMENT">
			<SketchComponent />
		</Layout>
	);
};

export default IndexPage;
