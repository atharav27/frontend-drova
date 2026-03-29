import { cn } from "@repo/ui/lib/utils";

interface HeaderProps {
  title: string;
  subtitle: string;
  customClassName?: string;
}

export default function Header({
  title,
  subtitle,
  customClassName
}: HeaderProps) {
  return (
    <div className="text-center  ">
      <h1 className="text-xl sm:text-2xl font-semibold text-textdark mb-3 sm:mb-4">{title}</h1>
      <p
        className={cn(
          "text-base sm:text-lg text-textdark ",
          customClassName
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}
