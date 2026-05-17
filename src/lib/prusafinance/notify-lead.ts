export type LeadNotifyInput = {
  tag: string;
  placement?: string;
  jmeno: string;
  email: string;
  phone?: string;
  zprava?: string;
  temata?: string;
};

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const TAG_LABELS: Record<string, string> = {
  "formular:index-kontakt": "Hlavní kontakt",
  "formular:ppc-refinancovani": "PPC — refinancování",
  "formular:ppc-bezurocne-uvery": "PPC — bezúročné úvěry",
  "formular:ppc-pojisteni-osvc": "PPC — pojištění OSVČ",
  "formular:ppc-modernizace-bydleni": "PPC — modernizace bydlení",
  "formular:ppc-raiffeisen-ucet": "PPC — Raiffeisen účet",
  "formular:stahnout-pruvodce": "Stažení průvodce",
};

function getWeb3FormsAccessKey(): string | null {
  const key =
    process.env.WEB3FORMS_ACCESS_KEY_PRUSAFINANCE?.trim() ||
    process.env.WEB3FORMS_ACCESS_KEY?.trim() ||
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
  return key || null;
}

function formatLabel(tag: string): string {
  return TAG_LABELS[tag] ?? tag;
}

function buildMessage(input: LeadNotifyInput): {subject: string; body: string} {
  const label = formatLabel(input.tag);
  const lines: string[] = [
    `Formulář: ${label}`,
    `Tag: ${input.tag}`,
    input.placement ? `Umístění: ${input.placement}` : "",
    `Jméno: ${input.jmeno || "—"}`,
    `E-mail návštěvníka: ${input.email}`,
    input.phone ? `Telefon: ${input.phone}` : "",
    input.temata ? `Co řeší: ${input.temata}` : "",
    input.zprava ? `\nZpráva:\n${input.zprava}` : "",
    "",
    "—",
    "Lead je zároveň uložen v Ecomail.",
  ].filter(Boolean);

  return {
    subject: `Průša Finance: ${label}${input.jmeno ? ` — ${input.jmeno}` : ""}`,
    body: lines.join("\n"),
  };
}

/**
 * E-mail poradcovi cez Web3Forms (rovnaká služba ako kontakt na aifreelancer.sk).
 * Príjemcu nastavíš v dashboarde Web3Forms pre daný access key.
 * No-op ak chýba access key.
 */
export async function notifyPrusafinanceLead(input: LeadNotifyInput): Promise<void> {
  const accessKey = getWeb3FormsAccessKey();
  if (!accessKey) return;

  const {subject, body} = buildMessage(input);
  const label = formatLabel(input.tag);

  const res = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject,
      from_name: "Průša Finance — web",
      name: input.jmeno,
      email: input.email,
      phone: input.phone || "",
      message: body,
      formular: label,
      umisteni: input.placement || "",
      temata: input.temata || "",
      zprava: input.zprava || "",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!res.ok || !data.success) {
    const detail =
      typeof data.message === "string" ? data.message : `HTTP ${res.status}`;
    throw new Error(`Web3Forms: ${detail}`);
  }
}
