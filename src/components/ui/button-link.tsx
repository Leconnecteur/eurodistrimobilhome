import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Renders an <a>/<Link> styled like a Button. Base UI's Button component is
 * not meant to be composed with links (see Base UI docs), so navigation CTAs
 * should style the anchor directly instead of using Button's `render` prop.
 */
type ButtonLinkProps = LinkProps &
  VariantProps<typeof buttonVariants> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children?: ReactNode;
  };

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

type ExternalButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

/** Same as ButtonLink but for plain external/native anchors (tel:, mailto:, wa.me, etc.). */
export function ExternalButtonLink({
  className,
  variant,
  size,
  ...props
}: ExternalButtonLinkProps) {
  return <a className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
