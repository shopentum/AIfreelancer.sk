const ECOMAIL_API = "https://api2.ecomailapp.cz";

const BASE_TAGS = ["zdroj:web"] as const;

type SubscriberResponse = {
  subscriber?: { tags?: string[] };
  errors?: string[];
};

function getConfig() {
  const apiKey = process.env.ECOMAIL_API_KEY?.trim();
  const listId = process.env.ECOMAIL_LIST_ID?.trim();
  if (!apiKey || !listId) {
    throw new Error("Ecomail is not configured");
  }
  return { apiKey, listId };
}

async function fetchExistingTags(
  listId: string,
  apiKey: string,
  email: string,
): Promise<string[]> {
  const encoded = encodeURIComponent(email);
  const res = await fetch(`${ECOMAIL_API}/lists/${listId}/subscriber/${encoded}`, {
    headers: { key: apiKey, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = (await res.json()) as SubscriberResponse;
  return data.subscriber?.tags ?? [];
}

function mergeTags(existing: string[], incoming: string[]): string[] {
  return [...new Set([...existing, ...incoming])];
}

export type SubscribeLeadInput = {
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  tags: string[];
  source?: string;
};

export async function subscribeLead(input: SubscribeLeadInput) {
  const { apiKey, listId } = getConfig();
  const existing = await fetchExistingTags(listId, apiKey, input.email);
  const tags = mergeTags(existing, [...BASE_TAGS, ...input.tags]);

  const res = await fetch(`${ECOMAIL_API}/lists/${listId}/subscribe`, {
    method: "POST",
    headers: {
      key: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscriber_data: {
        email: input.email,
        name: input.name,
        surname: input.surname,
        phone: input.phone,
        tags,
        source: input.source ?? "prusafinance-web",
        status: 1,
      },
      trigger_autoresponders: false,
      update_existing: true,
      skip_confirmation: true,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.errors)
          ? data.errors.join(", ")
          : "Ecomail subscribe failed";
    throw new Error(message);
  }
  return data;
}

export function splitFullName(full: string): { name?: string; surname?: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { name: parts[0] };
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}

export function parseContactField(value: string): { email?: string; phone?: string } {
  const v = value.trim();
  if (!v) return {};
  if (v.includes("@")) return { email: v };
  return { phone: v };
}
