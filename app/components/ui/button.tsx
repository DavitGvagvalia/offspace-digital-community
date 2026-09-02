import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/app/_lib/ui/utils";

export const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default: "bg-forest text-ivory shadow-md hover:bg-forest-light",
        secondary:
          "border border-stone-200 bg-offwhite text-forest shadow-sm hover:border-sage-300 hover:bg-ivory-light",
        quiet: "bg-sage-50 text-forest hover:bg-sage-100",
        danger:
          "border border-danger bg-danger text-ivory shadow-sm hover:bg-danger/90 focus-visible:outline-danger",
        discord: "bg-discord text-ivory hover:bg-discord-active hover:text-ivory",
      },
      size: {
        default: "min-h-12 px-5 py-3",
        sm: "min-h-10 px-4 py-2 text-xs",
        xl: "min-h-12 px-5 py-3 min-w-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
