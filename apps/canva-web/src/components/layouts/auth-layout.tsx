import Link from 'next/link';
import { Button } from '../base/button/Button';
import GithubIcon from '../icons/GithubIcon';
import { ExternalLink } from 'lucide-react';

type AuthLayoutProps = {
  children: React.ReactNode;
  heading: string;
  subheading?: string;
  githubUrl: string;
};

export function AuthLayout({
  children,
  heading,
  subheading,
  githubUrl,
}: AuthLayoutProps) {
  return (
    <div className="flex flex-1 bg-gradient-to-tr from-blue-800 to-purple-700 min-h-150">
      <div className="flex w-1/2 justify-around items-center">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            CanvaClone
          </h1>
          <p className="text-white mt-1">
            Fork It, Shape It, Make It Yours - Clone the Code, Craft Your
            Masterpiece
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-4 bg-transparent text-white"
          >
            <Link
              href={githubUrl}
              target="_blank"
            >
              <GithubIcon />
              Github
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex w-1/2 justify-center items-center">
        <div className="flex items-center justify-center p-4 md:p-8">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2 text-center text-white">
              <h1 className="text-3xl font-bold">{heading}</h1>
              {subheading && (
                <p>{subheading}</p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="mx-auto flex w-full flex-col justify-center sm:w-[450px]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
