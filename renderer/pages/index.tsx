import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import dynamic from 'next/dynamic';
const Sketch = dynamic(() => import('../components/Sketch'), { ssr: false });

const IndexPage = () => {
	return (
		<Layout title="ELECTRON BASIC DEVELOP ENVIRONMENT">
			<Sketch />
		</Layout>
	);
};

export default IndexPage;
