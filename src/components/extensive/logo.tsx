import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/"} className="py-2">
      <Image
        src="/logo.svg"
        className="h-16"
        alt="L'Assistenza Logo"
        width={197}
        height={78}
      />
    </Link>
  );
};
