export type ProductHighlight = {
  iconName: string;
  title: string;
  description: string;
};

export type ProductFAQ = {
  question: string;
  answer: string;
};

export type ProductTechnicalSpec = {
  label: string;
  value: string;
};

export type ProductDetails = {
  highlights: ProductHighlight[];
  useCases: string[];
  technicalSpecs: ProductTechnicalSpec[];
  whatsIncluded: string[];
  faqs: ProductFAQ[];
};

export const getProductDetails = (slug: string): ProductDetails | null => {
  const normalizedSlug = slug.toLowerCase();

  if (normalizedSlug === 'basic') {
    return {
      highlights: [
        {
          iconName: 'Code',
          title: 'React Editor Component',
          description: 'Fully customizable React component that you can integrate into any React application. Built with TypeScript for type safety.',
        },
        {
          iconName: 'Layout',
          title: 'Full Canvas Functionality',
          description: 'Complete canvas editor with drag-and-drop, zoom, pan, and multi-layer support. Professional-grade editing capabilities.',
        },
        {
          iconName: 'Palette',
          title: 'Shape & Text Tools',
          description: 'Comprehensive set of drawing tools including shapes, text with rich formatting, lines, arrows, and custom paths.',
        },
        {
          iconName: 'ImageIcon',
          title: 'Image Upload & Manipulation',
          description: 'Upload images, crop, resize, rotate, and apply filters. Support for multiple image formats including PNG, JPG, SVG, and WebP.',
        },
        {
          iconName: 'Download',
          title: 'Export to PNG/JPG',
          description: 'Export your designs in high quality PNG or JPG formats. Customizable resolution and quality settings.',
        },
        {
          iconName: 'Layers',
          title: 'Layer Management',
          description: 'Advanced layer system with grouping, locking, hiding, and reordering capabilities. Perfect for complex designs.',
        },
        {
          iconName: 'FileText',
          title: 'Basic Templates',
          description: 'Collection of pre-designed templates to get you started quickly. Customize and make them your own.',
        },
        {
          iconName: 'Rocket',
          title: 'Lifetime Updates',
          description: 'Receive all future updates and improvements at no additional cost. Your one-time purchase includes lifetime access.',
        },
      ],
      useCases: [
        'Building a design tool for your SaaS application',
        'Creating a custom graphics editor for your website',
        'Adding design capabilities to your content management system',
        'Developing a white-label design solution',
        'Integrating design features into your existing React app',
      ],
      technicalSpecs: [
        { label: 'Framework', value: 'React 18+' },
        { label: 'Language', value: 'TypeScript' },
        { label: 'Bundle Size', value: '~500KB (gzipped)' },
        { label: 'Browser Support', value: 'Chrome, Firefox, Safari, Edge (latest 2 versions)' },
        { label: 'Mobile Support', value: 'Responsive design with touch support' },
        { label: 'License', value: 'Commercial License' },
        { label: 'Updates', value: 'Lifetime updates included' },
        { label: 'Support', value: 'Community forum access' },
      ],
      whatsIncluded: [
        'Complete React Editor Component source code',
        'TypeScript definitions',
        'Comprehensive documentation',
        'Example projects and demos',
        'Integration guides',
        'API reference',
        'Basic template library',
        'Technical support access',
      ],
      faqs: [
        {
          question: 'Can I use this in commercial projects?',
          answer: 'Yes! The Basic plan includes a commercial license that allows you to use the component in any commercial project, including client work and SaaS applications.',
        },
        {
          question: 'Do I get updates after purchase?',
          answer: 'Absolutely! All purchases include lifetime updates. You\'ll receive all bug fixes, new features, and improvements at no additional cost.',
        },
        {
          question: 'What if I need help with integration?',
          answer: 'We provide comprehensive documentation, example projects, and integration guides. For additional support, you can ask questions in our community forum or upgrade to Advanced for priority support.',
        },
        {
          question: 'Can I customize the editor?',
          answer: 'Yes! The component is fully customizable. You can modify styles, add custom tools, extend functionality, and integrate it seamlessly with your design system.',
        },
        {
          question: 'Is there a limit on how many projects I can use this in?',
          answer: 'No limits! Once you purchase, you can use the component in unlimited projects, both personal and commercial.',
        },
        {
          question: 'What if I want to upgrade to Advanced later?',
          answer: 'You can upgrade to Advanced at any time by paying just the difference ($29). Contact our support team with your purchase details to upgrade.',
        },
      ],
    };
  }

  if (normalizedSlug === 'advanced') {
    return {
      highlights: [
        {
          iconName: 'Code',
          title: 'Full Frontend Application',
          description: 'Complete Next.js frontend application with authentication, user management, project management, and a beautiful, responsive UI.',
        },
        {
          iconName: 'Server',
          title: 'Complete Backend API',
          description: 'Full-featured REST API built with Node.js/Express or similar. Includes user authentication, project CRUD operations, file management, and more.',
        },
        {
          iconName: 'Settings',
          title: 'Admin Dashboard',
          description: 'Comprehensive admin panel for managing users, projects, templates, content, and system settings. Built with modern UI components.',
        },
        {
          iconName: 'Shield',
          title: 'User Authentication',
          description: 'Complete authentication system with email/password, social login options, password reset, email verification, and session management.',
        },
        {
          iconName: 'Database',
          title: 'Database Integration',
          description: 'Pre-configured database schemas and migrations. Works with PostgreSQL, MySQL, or MongoDB. Includes sample data and seeders.',
        },
        {
          iconName: 'FileText',
          title: 'Template Management',
          description: 'System for creating, organizing, and managing design templates. Users can browse, search, and use templates in their projects.',
        },
        {
          iconName: 'Users',
          title: 'User Project Management',
          description: 'Users can create, save, organize, and manage multiple design projects. Includes project sharing and collaboration features.',
        },
        {
          iconName: 'Globe',
          title: 'Strapi CMS Integration',
          description: 'Fully integrated with Strapi CMS for content management. Manage templates, assets, and content through a powerful headless CMS.',
        },
        {
          iconName: 'Database',
          title: 'Sample Data Ready',
          description: 'Pre-configured sample data and database dumps included. Get started quickly with realistic content and examples.',
        },
        {
          iconName: 'FileCode',
          title: 'Database Migrations',
          description: 'Complete database migration scripts included. Easy setup and restoration from production dumps with default users.',
        },
        {
          iconName: 'Rocket',
          title: 'Production Deployment Guides',
          description: 'Step-by-step guides for deploying to Railway (backend) and Vercel (frontend). Get your app live quickly.',
        },
        {
          iconName: 'Book',
          title: 'Complete Documentation',
          description: 'Comprehensive documentation covering setup, configuration, deployment, and troubleshooting. Everything you need to succeed.',
        },
        {
          iconName: 'FolderOpen',
          title: 'Example Projects Included',
          description: 'Real-world example projects and templates to learn from and customize. See best practices in action.',
        },
        {
          iconName: 'Globe',
          title: 'Multi-language Support',
          description: 'Full internationalization (i18n) support. Easily add multiple languages and localize your application for global users.',
        },
        {
          iconName: 'Star',
          title: 'Priority Support',
          description: 'Get priority support with faster response times. Direct access to our development team for technical assistance.',
        },
      ],
      useCases: [
        'Launching a complete design platform like Canva',
        'Building a white-label design solution for clients',
        'Creating a design marketplace with user accounts',
        'Developing a SaaS design tool with subscription plans',
        'Building a custom design tool for your organization',
      ],
      technicalSpecs: [
        { label: 'Frontend Framework', value: 'Next.js 16+ (React 19+)' },
        { label: 'Backend Framework', value: 'Node.js/Express or similar' },
        { label: 'Database', value: 'PostgreSQL/MySQL/MongoDB' },
        { label: 'CMS', value: 'Strapi CMS integrated' },
        { label: 'Authentication', value: 'JWT-based with social login' },
        { label: 'Language', value: 'TypeScript' },
        { label: 'Deployment', value: 'Docker-ready, cloud-compatible' },
        { label: 'License', value: 'Commercial License' },
        { label: 'Updates', value: 'Lifetime updates included' },
        { label: 'Support', value: 'Priority support included' },
      ],
      whatsIncluded: [
        'Complete frontend application source code',
        'Full backend API source code',
        'Admin dashboard with all features',
        'Database schemas and migrations',
        'Strapi CMS integration',
        'Authentication system',
        'E-commerce integration',
        'Multi-language setup',
        'Premium template library',
        'Comprehensive documentation',
        'Deployment guides',
        'Priority support access',
      ],
      faqs: [
        {
          question: 'What technologies are included?',
          answer: 'The Advanced plan includes a complete Next.js frontend, Node.js backend API, database integration, Strapi CMS, authentication system, and admin dashboard. All built with TypeScript and modern best practices.',
        },
        {
          question: 'Can I customize everything?',
          answer: 'Absolutely! You receive the complete source code for all components. Customize the UI, add features, modify the backend, and make it uniquely yours.',
        },
        {
          question: 'Is hosting included?',
          answer: 'Hosting is not included, but we provide detailed deployment guides for popular platforms like Vercel, AWS, DigitalOcean, and others. The code is Docker-ready for easy deployment.',
        },
        {
          question: 'What about database setup?',
          answer: 'We provide database schemas, migrations, and seeders. You can use PostgreSQL, MySQL, or MongoDB. Setup guides are included for all supported databases.',
        },
        {
          question: 'How does priority support work?',
          answer: 'Priority support gives you direct access to our development team with faster response times (typically within 24 hours). You can ask technical questions, get help with customization, and receive guidance on deployment.',
        },
        {
          question: 'Can I resell this as a service?',
          answer: 'Yes! The commercial license allows you to use this as the foundation for your own SaaS product or design platform. You can charge users for access to your platform.',
        },
        {
          question: 'What if I already have Basic?',
          answer: 'You can upgrade to Advanced by paying just the difference ($20). Contact our support team with your Basic purchase details to upgrade.',
        },
        {
          question: 'How long does it take to set up?',
          answer: 'With our comprehensive documentation and setup guides, most developers can have the system running locally within a few hours. Full deployment typically takes 1-2 days depending on your infrastructure.',
        },
      ],
    };
  }

  return null;
};

