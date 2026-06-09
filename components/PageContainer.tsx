import type { ReactNode } from "react";

interface PageContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  const defaultClassName = "mx-auto max-w-6xl px-4 py-12";

  return <div className={className ? `${defaultClassName} ${className}` : defaultClassName}>{children}</div>;
}