import { Mail } from "lucide-react";
import { PressLink } from "@/components/app/press-link";

const EMAIL = "contact@oxygen-ui.dev";

export function WorkCta() {
  return (
    <section className="px-4 py-24 md:py-36">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Work with me
        </p>

        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-[1.1]">
          Need components built for your product?
        </h2>
        <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
          Custom motion components and frontend systems, built to spec. Book a
          call or drop a line, whichever's easier.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <PressLink
            href={`mailto:${EMAIL}`}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
            Contact Syed Subhan
          </PressLink>
        </div>
      </div>
    </section>
  );
}
