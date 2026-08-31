import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/app/_lib/ui/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]",
  {
    variants: {
      variant: {
        default: "border-sage-200 bg-offwhite/85 text-forest",
        muted: "border-stone-200 bg-ivory-light text-ink-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
