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
