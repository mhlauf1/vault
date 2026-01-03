import { HeroSplitImage } from "./source";

export default function HeroSplitImagePreview() {
  return (
    <div className="bg-white">
      <HeroSplitImage
        headline="Build beautiful products faster than ever"
        subheadline="The modern toolkit for product teams. Ship faster, collaborate better, and delight your customers with every release."
        primaryCta={{ label: "Start Free Trial", href: "#" }}
        secondaryCta={{ label: "Watch Demo", href: "#" }}
        image={{
          src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
          alt: "Team collaborating on product design",
        }}
      />
    </div>
  );
}
