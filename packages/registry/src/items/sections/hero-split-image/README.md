# Hero — Split Image

A classic hero section with content on the left and a large image on the right. Perfect for SaaS landing pages and marketing sites.

## Usage

```tsx
import { HeroSplitImage } from "./hero-split-image";

<HeroSplitImage
  headline="Build beautiful products faster than ever"
  subheadline="The modern toolkit for product teams."
  primaryCta={{ label: "Start Free Trial", href: "/signup" }}
  secondaryCta={{ label: "Watch Demo", href: "/demo" }}
  image={{
    src: "/hero-image.jpg",
    alt: "Product screenshot",
  }}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `headline` | `string` | Yes | — | Main headline text |
| `subheadline` | `string` | No | Default copy | Supporting description |
| `primaryCta.label` | `string` | No | "Get Started" | Primary button text |
| `primaryCta.href` | `string` | No | "#" | Primary button link |
| `secondaryCta.label` | `string` | No | "Learn More" | Secondary button text |
| `secondaryCta.href` | `string` | No | "#" | Secondary button link |
| `image.src` | `string` | Yes | — | Image source URL |
| `image.alt` | `string` | Yes | — | Image alt text |

## Features

- Fully responsive (stacks on mobile, side-by-side on desktop)
- Two CTA button variants (primary and secondary)
- Large heading with tracking-tight for visual impact
- Rounded image container with 4:3 aspect ratio
- 100% standalone — no external dependencies

## Customization Tips

- Replace the Button component with your own design system button
- Adjust `py-20 lg:py-32` to change vertical spacing
- Modify `max-w-7xl` for different content widths
- Use `next/image` instead of `<img>` for optimized loading
