import { Poppins } from 'next/font/google';

const roboto = Poppins({
  weight: ['300', '700'],
  subsets: ['latin'],
});
function Logo() {
  return (
    <span
      className={
        roboto.className +
        ' text-2xl bg-gradient-to-r to-primary/70 bg-clip-text'
      }
    >
      <span className="font-bold">Canva</span>
      <span className="font-light bg-black text-white rounded-sm px-1 inline-block transform rotate-[-1deg]">Clone</span>
    </span>
  );
}

export default Logo;
