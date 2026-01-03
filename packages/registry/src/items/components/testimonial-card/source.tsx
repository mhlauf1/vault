// ============================================
// Testimonial Card
// A polished testimonial with quote, avatar, name, and title
// ============================================

type TestimonialCardProps = {
  quote: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
};

export function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-md hover:ring-gray-300">
      {/* Quote */}
      <blockquote className="text-gray-700">
        <p className="text-base leading-relaxed">&ldquo;{quote}&rdquo;</p>
      </blockquote>

      {/* Author */}
      <div className="mt-6 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100 transition-transform duration-300 group-hover:scale-105">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-lg font-medium text-gray-600">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Title */}
        <div>
          <p className="text-sm font-semibold text-gray-900">{author.name}</p>
          <p className="text-sm text-gray-500">{author.title}</p>
        </div>
      </div>
    </div>
  );
}
