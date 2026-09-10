import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5H16l.5-3h-3V8.3c0-.87.24-1.46 1.5-1.46H16.6V4.14C16.34 4.1 15.45 4 14.4 4c-2.2 0-3.7 1.34-3.7 3.8v2.7H8v3h2.7V21h2.8Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H4V20h2.94V8.5ZM5.47 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 20h-2.94v-5.9c0-1.4-.5-2.36-1.76-2.36-.96 0-1.53.65-1.78 1.27-.09.22-.11.53-.11.84V20H10.5s.04-9.83 0-10.5h2.94v1.49c.39-.6 1.09-1.46 2.66-1.46 1.94 0 3.9 1.27 3.9 4V20Z" />
    </svg>
  );
}
