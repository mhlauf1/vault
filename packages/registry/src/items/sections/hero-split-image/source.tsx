// ============================================
// Hero — Split Image
// A classic hero section with headline and image
// ============================================

type HeroSplitImageProps = {
  headline: string;
  subheadline?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  image: {
    src: string;
    alt: string;
  };
};

export function HeroSplitImage({
  headline,
  subheadline = "Supporting copy that explains your value proposition in a sentence or two.",
  primaryCta = { label: "Get Started", href: "#" },
  secondaryCta = { label: "Learn More", href: "#" },
  image,
}: HeroSplitImageProps) {
  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="text-lg text-gray-600 lg:text-xl">{subheadline}</p>
            <div className="flex flex-wrap gap-4">
              <Button href={primaryCta.href}>{primaryCta.label}</Button>
              <Button href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Internal Components (included for standalone use)
// ============================================

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

function Button({ children, href, variant = "primary" }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors";

  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };

  return (
    <a href={href} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </a>
  );
}
