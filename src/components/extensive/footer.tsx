import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "./logo";
import { NavLinks } from "./navigation-links";
import { Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary px-4 py-16 mt-40">
      <div className="max-w-5xl mx-auto w-full flex md:flex-row flex-col gap-16">
        <NavLinks
          orientation="vertical"
          className="gap-6 md:order-1 order-2 md:text-left text-center"
        />
        <div className="flex-1 flex flex-col items-center -mt-48 gap-8 md:order-2 order-1">
          <div className="bg-card rounded-sm flex flex-col p-8 shadow w-full max-w-md text-center gap-4 items-center">
            <h4 className="text-2xl font-bold text-primary">
              Parla con un esperto
            </h4>
            <p>
              Contattaci per parlare con un nostro specialista e avere maggiori
              informazioni.
            </p>
            <Button asChild variant="secondary" size={"lg"} className="mt-6">
              <Link href="/contatti">Contattaci</Link>
            </Button>
          </div>
          <Logo />
        </div>
        <div className="md:text-right text-center text-primary-foreground space-y-6 order-3">
          <Link
            href="https://www.google.com/maps/search/?api=1&query=Via+Francesco+Aquilanti+58,+00166,+Roma+(RM),+Italia"
            target="_blank"
          >
            <p>Via Francesco Aquilanti, 58</p>
            <p>00166, Roma, Italia</p>
          </Link>
          <div>
            <p>
              Telefono: <Link href="tel:+390666012321">06 66012321</Link>
            </p>
            <p>
              Whatsapp:{" "}
              <Link href="https://wa.me/3292341594" target="_blank">
                329 2341594
              </Link>
            </p>
          </div>

          <Link href="mailto:ordini@lassistenzausato.net" className="block">
            ordini@lassistenzausato.net
          </Link>
          <div className="flex lg:justify-end justify-center">
            <Button asChild variant="ghost" size="icon">
              <Link
                href="https://www.instagram.com/lassistenza_roma/"
                target="_blank"
              >
                <Instagram />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link
                href="https://www.facebook.com/lassistenzaroma "
                target="_blank"
              >
                <Facebook />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
