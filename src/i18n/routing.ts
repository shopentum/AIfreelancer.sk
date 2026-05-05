import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sk", "en", "de"],
  defaultLocale: "sk",
  localePrefix: "as-needed",
});

