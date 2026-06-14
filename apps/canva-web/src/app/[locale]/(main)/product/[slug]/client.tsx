'use client';

import "@canva-web/src/styles/ck-content.scss";
import { Link } from '@canva-web/src/i18n/navigation';
import { Product } from '@canva-web/src/models/product.model';
import Carousel from '@canva-web/src/components/base/carousel/Carousel';
import PageContainer from '@canva-web/src/components/PageContainer';
import Breadcrumb from '@canva-web/src/components/base/breadcrumb/Breadcrumb';
import { Button } from '@canva-web/src/components/base/button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@canva-web/src/components/base/card/Card';
import { Badge } from '@canva-web/src/components/base/badge/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@canva-web/src/components/base/tabs/Tabs';
import {
  Check,
  Code,
  Database,
  Globe,
  Image as ImageIcon,
  Layers,
  Layout,
  Palette,
  Rocket,
  Server,
  Shield,
  Sparkles,
  Users,
  Zap,
  Download,
  HelpCircle,
  Star,
  ArrowRight,
  FileText,
  Settings,
  ShoppingCart,
  FileCode,
  BookOpen,
  FolderOpen,
  LucideIcon,
} from 'lucide-react';
import { getProductDetails } from '@canva-web/src/utils/product-details';

interface ProductPageProps {
  product: Product | null;
  productId: string;
}

export default function ProductPageClient({
  product,
  productId,
}: ProductPageProps) {
  if (!product) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-8 bg-muted rounded w-32" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <ProductDetail product={product} productId={productId} />
  );
}

interface ProductDetailProps {
  product: Product;
  productId: string;
}

function ProductDetail({
  product,
  productId,
}: ProductDetailProps) {
  const isBasic = product.slug === 'canva-editor';
  const isAdvanced = product.slug === 'canva-clone';

  // Get product details from utility
  const details = getProductDetails(product.slug);

  // Icon map to convert icon names to components
  const iconMap: Record<string, LucideIcon> = {
    Code,
    Layout,
    Palette,
    ImageIcon,
    Download,
    Layers,
    Zap,
    FileText,
    Users,
    Rocket,
    Server,
    Settings,
    Shield,
    Database,
    Globe,
    ShoppingCart,
    Sparkles,
    Star,
    FileCode,
    Book: BookOpen,
    FolderOpen,
  };
  return (
    <PageContainer>
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb
          breadcrumbs={[
            { label: 'Pricing', href: '/pricing' },
            {
              label: product.name,
              href: `/product/${productId}`,
            },
          ]}
        />
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
        {/* Left: Product Images and Description */}
        <div className="lg:col-span-3 space-y-8">
          {/* Image Gallery */}
          <div className="rounded-xl overflow-hidden border bg-muted/30 shadow-sm">
            <Carousel
              slides={product.images.map((image) => image.url)}
              options={{ loop: true, dragFree: true }}
            />
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Overview</h2>
            <div
              className="ck-content prose prose-sm max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>

        {/* Right: Product Info and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Summary Card */}
          <Card className="sticky top-24 pb-4 shadow-md">
            <CardHeader className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl lg:text-3xl leading-tight">
                    {product.name}
                  </CardTitle>
                  {isBasic && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Price Section */}
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-5xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground uppercase tracking-wide">
                  USD
                </span>
              </div>
              <p className="text-xs text-muted-foreground">One-time payment • Lifetime updates</p>

              {/* Short Description */}
              <div
                className="text-sm text-muted-foreground leading-relaxed pb-6 border-b"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />

              {/* Action Section */}
              <div className="space-y-3 pt-2">
                <Button
                  asChild
                  className="w-full"
                  size="lg"
                >
                  <a
                    href={product.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Get Now
                  </a>
                </Button>

                {/* Support Hint */}
                <div className="flex items-center justify-center gap-2 text-center">
                  <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    {isAdvanced ? 'Priority support included' : 'Sign in to get support'}
                  </p>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="pt-4 border-t space-y-3">
                <h4 className="font-semibold text-sm">What&apos;s Included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Commercial License</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Lifetime Updates</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Full Source Code</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {'Technical Support'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">No Recurring Fees</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      {details && (
        <div className="space-y-8">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="usecases">Use Cases</TabsTrigger>
              <TabsTrigger value="specs">Technical Specs</TabsTrigger>
              <TabsTrigger value="included">What&apos;s Included</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-6">Detailed Features</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {details.highlights.map((highlight, index) => {
                    const Icon = iconMap[highlight.iconName];
                    return (
                      <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                            {Icon && <Icon className="w-6 h-6" />}
                          </div>
                          <div className="space-y-2 flex-1">
                            <h4 className="font-semibold text-lg">{highlight.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {highlight.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Use Cases Tab */}
            <TabsContent value="usecases" className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-6">Perfect For</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {details.useCases.map((useCase, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground leading-relaxed">{useCase}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Technical Specs Tab */}
            <TabsContent value="specs" className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
                <Card className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {details.technicalSpecs.map((spec, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                        <span className="font-medium text-muted-foreground">{spec.label}</span>
                        <span className="text-foreground font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* What's Included Tab */}
            <TabsContent value="included" className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-6">What&apos;s Included in Your Purchase</h3>
                <Card className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {details.whatsIncluded.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {details.faqs.map((faq, index) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <h4 className="font-semibold text-lg">{faq.question}</h4>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pl-8">
                          {faq.answer}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Upgrade Section (only for Basic) */}
      {isBasic && (
        <Card className="mt-12 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Sparkles className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold">Need More Power?</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upgrade to <strong>Advanced</strong> and get the complete solution with Frontend, Backend, Admin Dashboard, and Priority Support.
              </p>
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                Upgrade for only <span className="text-3xl">$29</span>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/product/advanced">
                  View Advanced Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
