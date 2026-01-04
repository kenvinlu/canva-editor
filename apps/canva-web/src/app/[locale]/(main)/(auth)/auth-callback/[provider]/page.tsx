import AuthCallbackClient from './client';

const AuthCallback = async ({ params }: { params: Promise<{ provider: string }> }) => {
  const { provider } = await params;

  return <AuthCallbackClient provider={provider} />;
};

export default AuthCallback;
