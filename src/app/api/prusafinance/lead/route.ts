import { NextRequest, NextResponse } from "next/server";
import {
  parseContactField,
  splitFullName,
  subscribeLead,
} from "@/lib/prusafinance/ecomail";

const ALLOWED_TAGS = new Set([
  "formular:ppc-refinancovani",
  "formular:ppc-bezurocne-uvery",
  "formular:ppc-pojisteni-osvc",
  "formular:ppc-modernizace-bydleni",
  "formular:ppc-raiffeisen-ucet",
  "formular:stahnout-pruvodce",
]);

const ALLOWED_ORIGINS = [
  "https://aifreelancer.sk",
  "https://www.aifreelancer.sk",
  "https://prusafinance.com",
  "https://www.prusafinance.com",
];

function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
) {
  return NextResponse.json(body, { status, headers: corsHeaders(origin) });
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400, origin);
  }

  if (!body || typeof body !== "object") {
    return json({ ok: false, error: "Invalid body" }, 400, origin);
  }

  const data = body as Record<string, unknown>;
  const tag = typeof data.tag === "string" ? data.tag.trim() : "";
  if (!ALLOWED_TAGS.has(tag)) {
    return json({ ok: false, error: "Invalid form tag" }, 400, origin);
  }

  const jmeno = typeof data.jmeno === "string" ? data.jmeno.trim() : "";
  const emailField = typeof data.email === "string" ? data.email.trim() : "";
  const kontakt = typeof data.kontakt === "string" ? data.kontakt.trim() : "";

  let email = emailField;
  let phone: string | undefined;

  if (!email && kontakt) {
    const parsed = parseContactField(kontakt);
    email = parsed.email ?? "";
    phone = parsed.phone;
  }

  if (!email) {
    return json(
      {
        ok: false,
        error: "Pro odeslání uveďte e-mail (nebo e-mail v poli kontakt).",
      },
      422,
      origin,
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Neplatný e-mail." }, 422, origin);
  }

  const { name, surname } = splitFullName(jmeno);

  try {
    await subscribeLead({
      email,
      name,
      surname,
      phone,
      tags: [tag],
    });
    return json({ ok: true }, 200, origin);
  } catch (err) {
    console.error("[prusafinance/lead]", err);
    return json(
      { ok: false, error: "Odeslání se nepodařilo. Zkuste to prosím znovu." },
      502,
      origin,
    );
  }
}
