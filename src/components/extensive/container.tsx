import { cn } from "@/lib/utils";

export function Container(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container pt-8 pb-8 px-4 sm:px-8", props.className)}>
      {props.children}
    </div>
  );
}
