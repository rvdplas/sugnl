import { ArrowRightIcon } from "@/components/event/icons";
import { primaryButtonClassName } from "@/components/event/styles";

type RegisterNowButtonProps = {
  href: string;
  className?: string;
  label?: string;
};

export default function RegisterNowButton({
  href,
  className = "",
  label = "Register now",
}: RegisterNowButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${primaryButtonClassName} ${className}`.trim()}
    >
      {label}
      <ArrowRightIcon className="h-4 w-4" />
    </a>
  );
}