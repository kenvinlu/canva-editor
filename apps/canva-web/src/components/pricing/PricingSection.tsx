'use client';

import { Check, Sparkles } from 'lucide-react';
import { Link } from '@canva-web/src/i18n/navigation';
import { getGithubUrl } from '@canva-web/config/Env';

const pricingPlans = [
  {
    name: 'Basic',
    slug: 'canva-editor',
    price: 29,
    description: 'Perfect for getting started with the React Editor',
    features: [
      'React Editor Component',
      'Full canvas functionality',
      'Shape & text tools',
      'Image upload & manipulation',
      'Export to PNG/JPG',
      'Layer management',
      'Keyboard shortcuts',
      'Basic templates',
      'Technical Support',
    ],
    cta: 'Get Basic',
    popular: true,
  },
  {
    name: 'Advanced',
    slug: 'canva-clone',
    price: 0,
    description: 'Complete solution with Frontend, Backend & Admin',
    features: [
      'Everything in Basic',
      'Full Frontend Application',
      'Complete Backend API',
      'Admin Dashboard',
      'User authentication',
      'Database integration',
      'Template management',
      'User project management',
      'Strapi CMS integration',
      'Sample data ready',
      'Database migrations included',
      'Production deployment guides',
      'Complete documentation',
      'Example projects included',
      'Multi-language support',
      'Priority support',
    ],
    cta: 'Get Advanced',
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with the basics or get the complete package. Upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-2xl border-2 p-8
                ${plan.popular
                  ? 'border-primary shadow-2xl scale-105'
                  : 'border-border'
                }
                bg-card transition-all duration-300 hover:shadow-xl
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Sparkles size={16} />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <Check
                        size={20}
                        className={plan.popular ? 'text-primary' : 'text-muted-foreground'}
                      />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={`/product/${plan.slug}`}
                className={`
                  block w-full py-3 px-6 rounded-lg text-center font-semibold
                  transition-all duration-200
                  ${plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                  }
                `}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Upgrade Notice */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Sparkles className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Already have Canva Editor (Basic)?</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Get the full Canva Clone (Advanced) on GitHub — complete Frontend, Backend & Admin.
              </p>
            </div>

            <div className="bg-background/50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-lg mb-3 text-center">
                Transform Your Editor Component into a Complete Platform
              </h4>
              <p className="text-muted-foreground mb-4 text-center">
                You already have the powerful React Editor Component. Now, unlock the full potential with a complete, production-ready design platform.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-3">
                  <h5 className="font-semibold text-sm text-primary">What You&apos;ll Get:</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><strong>Complete Frontend App</strong> - Ready-to-deploy Next.js application with beautiful UI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><strong>Full Backend API</strong> - RESTful API with authentication & database integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><strong>Admin Dashboard</strong> - Manage users, projects, templates & content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><strong>User System</strong> - Authentication, profiles, and project management</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5 className="font-semibold text-sm text-primary">Plus:</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><strong>Strapi CMS</strong> - Headless CMS for content & template management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><strong>Deployment Guides</strong> - Step-by-step production deployment instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><strong>Sample Data</strong> - Pre-configured database with realistic content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><strong>Priority Support</strong> - Direct access to our development team</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Perfect for launching your own design platform, SaaS product, or white-label solution. 
                Everything you need to go from component to complete application.
              </p>
              <Link
                href={getGithubUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  inline-block py-3 px-8 rounded-lg font-semibold
                  transition-all duration-200
                  bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg
                `}
              >
                Get Canva Clone (Advanced) on GitHub
              </Link>
              
              {/* GitHub Notice */}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Canva Clone (Advanced) is on GitHub
                </p>
                <p className="text-xs text-muted-foreground">
                  The full Advanced repo (Frontend, Backend, Admin, Strapi, docs & sample data) is available on GitHub.
                  If you purchased the upgrade from Gumroad, log in here with your purchase email to get access; otherwise you can clone or download the public repository directly.
                </p>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">
                Contact support after upgrading if you have any problems.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Check out our{' '}
            <Link href="/docs" className="text-primary hover:underline font-medium">
              documentation
            </Link>
            {' '}or contact our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>One-time payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>Sample data included</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>No recurring fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>Commercial license</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
