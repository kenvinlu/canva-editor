import { getGithubUrl } from "@canva-web/config/Env"

// please update required information
const siteMetadata = {
    title: 'Canva Clone Blog',
    author: 'Canva Clone Team',
    headerTitle: 'Canva Clone Blog',
    description: 'A blog created with Next.js, Tailwind.css and contentlayer. Fork It, Shape It, Make It Yours - Clone the Code, Craft Your Masterpiece',
    language: 'en-us',
    theme: 'system', // system, dark or light
    siteUrl: 'https://www.canvaclone.com',
    siteLogo: '/logo.svg',
    socialBanner: '/images/banner.png',
    email: 'support@canvaclone.com', 
    github: getGithubUrl(),
    locale: 'en-US',
  }
  
  export default siteMetadata