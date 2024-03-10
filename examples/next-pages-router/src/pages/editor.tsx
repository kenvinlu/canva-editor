import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Page() {
  return (
    <main className='min-h-screen'>
      <Editor />
    </main>
  );
}

export const getServerSideProps = (async () => {
  // Pass data to the page via props
  return { props: {} };
}) satisfies GetServerSideProps<{}>;
