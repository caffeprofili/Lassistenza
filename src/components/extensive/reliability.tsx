import Image from "next/image";
import { Section } from "./section";
import { Each } from "../extensive/each";

const items = [
  {
    label: "Macchinari Professionali",
    src: "/assets/macchinari-professionali.svg",
  },
  {
    label: "Ricondizionato Garantito",
    src: "/assets/ricondizionato-garantito.svg",
  },
  { label: "Garanzia 6 Mesi", src: "/assets/garanzia-6-mesi.svg" },
  { label: "Consegna diretta al locale", src: "/assets/consegna-diretta.png" },
];

export const Reliability = () => {
  return (
    <Section className="bg-background">
      <div className="max-w-5xl w-full mx-auto grid md:grid-cols-4 grid-cols-1 gap-4">
        <Each
          of={items}
          render={(item) => (
            <div className="space-y-3 text-center">
              <Image
                className="mx-auto size-[100px]"
                src={item.src}
                alt={item.label}
                height={100}
                width={100}
              />
              <h3 className="text-primary font-bold text-sm uppercase max-w-[150px] mx-auto">
                {item.label}
              </h3>
            </div>
          )}
        />
      </div>
    </Section>
  );
};
