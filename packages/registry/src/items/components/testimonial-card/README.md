# Testimonial Card

A polished testimonial card component for displaying customer quotes and feedback.

## Usage

```tsx
import { TestimonialCard } from "./testimonial-card";

<TestimonialCard
  quote="This product has completely transformed how our team collaborates."
  author={{
    name: "Sarah Chen",
    title: "Head of Product, Acme Corp",
    avatar: "https://example.com/avatar.jpg",
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `quote` | `string` | Yes | The testimonial quote text |
| `author.name` | `string` | Yes | The author's full name |
| `author.title` | `string` | Yes | The author's job title or role |
| `author.avatar` | `string` | No | URL to the author's avatar image |

## Features

- Subtle hover animation with shadow and ring effects
- Avatar fallback showing first letter of name
- Responsive design
- Accessible semantic markup using `<blockquote>`

## Customization Tips

- Adjust `rounded-2xl` for different border radius
- Change `shadow-sm` to `shadow-md` or `shadow-lg` for more depth
- Modify hover transitions in `transition-all duration-300`
