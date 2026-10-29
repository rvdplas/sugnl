import type { ReactNode } from "react";

interface PageContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  // className replaces the default padding instead of adding to it: two py-* classes on one element let CSS order pick the winner.
  return <div className={`mx-auto max-w-6xl px-4 ${className ?? "py-12"}`}>{children}</div>;
}