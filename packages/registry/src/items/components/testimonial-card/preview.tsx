import { TestimonialCard } from "./source";

export default function TestimonialCardPreview() {
  return (
    <div className="flex min-h-[200px] items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md">
        <TestimonialCard
          quote="This product has completely transformed how our team collaborates. The intuitive interface and powerful features have boosted our productivity by at least 40%."
          author={{
            name: "Sarah Chen",
            title: "Head of Product, Acme Corp",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
          }}
        />
      </div>
    </div>
  );
}
