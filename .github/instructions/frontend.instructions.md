---
applyTo: "components/**/*.tsx, app/**/*.tsx"
description: |
  Use when building or reviewing React components in AMIKO.
  Ensures component reusability, accessibility, performance, and brand consistency.
---

# Frontend Component Guidelines

## AMIKO Component Patterns

### 1. Reusable Components (components/)
Create components that are **used multiple times** or **independently testable**:

```typescript
// ✅ Good: Reusable button with variants
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', isLoading, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500': variant === 'primary',
          'bg-slate-200 text-slate-900 hover:bg-slate-300': variant === 'secondary',
          'px-4 py-2 text-sm': size === 'md',
        },
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : props.children}
    </button>
  );
}
```

### 2. Page Layout (app/)
- Use Server Components by default (Next.js 14+ RSC)
- Fetch data in the server component
- Pass data to Client Components only when needed (`'use client'`)

```typescript
// app/dashboard/page.tsx (Server Component)
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const tasks = await fetchTasks();
  return <DashboardClient tasks={tasks} />;
}

// app/dashboard/dashboard-client.tsx (Client Component)
'use client';
export function DashboardClient({ tasks }) {
  // Handle interactivity here
}
```

### 3. AMIKO Brand Tailwind

**Colors**: Green (#10b981, #059669), Blue (#3b82f6, #1d4ed8)

```javascript
// tailwind.config.ts
extend: {
  colors: {
    'amiko-green': {
      50: '#f0fdf4',
      500: '#10b981',
      600: '#059669',
    },
    'amiko-blue': {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#1d4ed8',
    },
  },
}
```

Use in components:
```jsx
<div className="bg-amiko-green-50 text-amiko-green-600 rounded-lg p-4">
  Task completed! 🎉
</div>
```

### 4. Accessibility (a11y)

Every component must pass:
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ ARIA labels (`aria-label`, `aria-describedby`)
- ✅ Color contrast (WCAG AA: 4.5:1 for text)
- ✅ Focus indicators (outline, ring)

Example:
```jsx
<button
  aria-label="Complete task"
  className="focus:ring-2 focus:ring-offset-2 focus:ring-amiko-green-500"
  onClick={handleComplete}
>
  <CheckIcon aria-hidden="true" />
</button>
```

### 5. Performance

- **Images**: Use `<Image>` from `next/image` (optimization, lazy loading)
- **Lazy Load**: Dynamic imports for heavy components
- **Code Split**: Split pages via Next.js, components via React.lazy()

```jsx
import dynamic from 'next/dynamic';
const ComplexChart = dynamic(() => import('./complex-chart'), { ssr: false });
```

### 6. Student Mode UX/UI Rule

> **Regla Oficial del Proyecto:**
> El modo estudiante de AMIKO debe seguir una lógica de UX/UI pensada para niños y adolescentes. Debe ser más visual, cálido, claro y motivador que el modo tutor. Debe priorizar colores suaves/pasteles, recursos visuales amigables, iconografía clara, barras de progreso visibles y una presentación que motive al estudiante sin sobrecargarlo.

### 7. Component Checklist

Before submitting a component:
- [ ] Follows AMIKO brand (colors, spacing, typography)
- [ ] Accessible (keyboard, ARIA, contrast)
- [ ] TypeScript types defined
- [ ] Reusable or well-justified (not one-off)
- [ ] Images optimized
- [ ] No hardcoded strings (use i18n or config)
- [ ] Props documented
- [ ] Responsive (mobile-first)

---

*Updated: 2026-06-09*
