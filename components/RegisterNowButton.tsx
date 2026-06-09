type RegisterNowButtonProps = {
  href: string;
  className?: string;
  label?: string;
};

export default function RegisterNowButton({
  href,
  className = "",
  label = "Register now ->",
}: RegisterNowButtonProps) {
  const baseClassName =
    "inline-block rounded-full border border-[color:var(--nav-line)] bg-[color:var(--button-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClassName} ${className}`.trim()}
    >
      {label}
    </a>
  );
}