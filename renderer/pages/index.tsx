import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import dynamic from 'next/dynamic';
const SketchComponent = dynamic(() => import('../components/SketchComponet'), { ssr: false });

const IndexPage = () => {
	return (
		<Layout title="Home | Next.js + TypeScript + Electron Example">
			<SketchComponent />
		</Layout>
	);
};

export default IndexPage;
