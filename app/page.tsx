import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Club&nbsp;</h1>
        <br />
        <h1 className={title({ color: "estu2" })}>Los Rosarinos&nbsp;</h1>
        <br />
        <h1 className={title({ color: "estu2" })}>Estudiantil&nbsp;</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4 pr-1" })}>
          Deportes y recreación
        </h2>
      </div>
    </section>
  );
}
