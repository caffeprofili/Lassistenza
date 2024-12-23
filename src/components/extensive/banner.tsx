import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type BannerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src: string;
  size?: "sm" | "md" | "lg";
};

export const Banner = ({
  src,
  size = "md",
  children,
  className,
  ...props
}: BannerProps) => {
  const sizeCn = {
    sm: "h-[30vh]",
    md: "h-[50vh]",
    lg: "h-[80vh]",
  };

  return (
    <section
      {...props}
      className={cn("bg-cover bg-center relative", sizeCn[size])}
      style={{ backgroundImage: `url("${src}")` }}
    >
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-full bg-black/40",
          className
        )}
      >
        {children}
      </div>
    </section>
  );
};
