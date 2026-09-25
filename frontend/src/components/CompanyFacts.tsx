import type { Company } from "@/data/companies";

type FactField = "industry" | "location" | "size";

// Backend company fields may be empty or the literal "Unknown"
export const knownValue = (value: string | null | undefined) =>
  value && value.trim() && value !== "Unknown" ? value : null;

const defaultLabels: Record<FactField, string> = {
  industry: "Industry",
  location: "Location",
  size: "Size",
};

// Industry / location / size with a quiet italic "Unknown".
// When all three are unknown they collapse into one line.
// `strip` lays the facts out as a 3-column card (Company Detail header).
export default function CompanyFacts({
  company,
  fields = ["industry", "location", "size"],
  labels,
  strip = false,
}: {
  company: Pick<Company, FactField> | undefined;
  fields?: FactField[];
  labels?: Partial<Record<FactField, string>>;
  strip?: boolean;
}) {
  const allUnknown = (["industry", "location", "size"] as const).every(
    (field) => !knownValue(company?.[field])
  );

  if (allUnknown) {
    return (
      <p
        className={
          strip
            ? "rounded-2xl border border-hairline bg-card px-[18px] py-4 text-[15px] italic text-muted-2"
            : "border-t border-hairline-soft py-2.5 text-sm italic text-muted-2 md:text-[15px]"
        }
      >
        Industry, location and size not listed
      </p>
    );
  }

  return (
    <dl
      className={
        strip ? "grid rounded-2xl border border-hairline bg-card sm:grid-cols-3" : undefined
      }
    >
      {fields.map((field) => {
        const value = knownValue(company?.[field]);
        const label = labels?.[field] ?? defaultLabels[field];

        return (
          <div
            key={field}
            className={
              strip
                ? "flex flex-col gap-1.5 border-t border-hairline-soft px-[18px] py-4 first:border-t-0 sm:border-r sm:border-t-0 sm:last:border-r-0"
                : "flex items-center justify-between gap-4 border-t border-hairline-soft py-2.5 text-sm md:text-[15px]"
            }
          >
            <dt
              className={
                strip
                  ? "font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2"
                  : "text-muted"
              }
            >
              {label}
            </dt>
            <dd
              className={`${strip ? "text-base" : "text-right"} ${
                value ? "font-bold" : "font-medium italic text-muted-2"
              }`}
            >
              {value ?? "Unknown"}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
