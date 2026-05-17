import {expect, test} from "@playwright/test";

/**
 * End-to-end: 12 functional Průša Finance forms → POST /api/prusafinance/contact → dekujeme.
 *
 * Run:
 *   npm run test:prusafinance:e2e
 *   PF_E2E_BASE_URL=https://www.aifreelancer.sk npm run test:prusafinance:e2e
 *
 * Mock API (no Ecomail calls):
 *   PF_E2E_MOCK=1 npm run test:prusafinance:e2e
 */

type FormCase = {
  n: number;
  label: string;
  path: string;
  formIndex: number;
  /** stahnout-pruvodce uses name="email" instead of kontakt */
  emailField?: boolean;
  fillMessage?: boolean;
};

const CASES: FormCase[] = [
  {
    n: 1,
    label: "index — kontakt",
    path: "/prusafinance/index.html",
    formIndex: 0,
    fillMessage: true,
  },
  {
    n: 2,
    label: "stahnout-pruvodce",
    path: "/prusafinance/stahnout-pruvodce.html",
    formIndex: 0,
    emailField: true,
  },
  {
    n: 3,
    label: "ppc-refinancovani — hero",
    path: "/prusafinance/ppc-refinancovani.html",
    formIndex: 0,
  },
  {
    n: 4,
    label: "ppc-refinancovani — bottom",
    path: "/prusafinance/ppc-refinancovani.html",
    formIndex: 1,
  },
  {
    n: 5,
    label: "ppc-bezurocne-uvery — hero",
    path: "/prusafinance/ppc-bezurocne-uvery.html",
    formIndex: 0,
  },
  {
    n: 6,
    label: "ppc-bezurocne-uvery — bottom",
    path: "/prusafinance/ppc-bezurocne-uvery.html",
    formIndex: 1,
  },
  {
    n: 7,
    label: "ppc-pojisteni-osvc — hero",
    path: "/prusafinance/ppc-pojisteni-osvc.html",
    formIndex: 0,
  },
  {
    n: 8,
    label: "ppc-pojisteni-osvc — bottom",
    path: "/prusafinance/ppc-pojisteni-osvc.html",
    formIndex: 1,
  },
  {
    n: 9,
    label: "ppc-modernizace-bydleni — hero",
    path: "/prusafinance/ppc-modernizace-bydleni.html",
    formIndex: 0,
  },
  {
    n: 10,
    label: "ppc-modernizace-bydleni — bottom",
    path: "/prusafinance/ppc-modernizace-bydleni.html",
    formIndex: 1,
  },
  {
    n: 11,
    label: "ppc-raiffeisen-ucet — hero",
    path: "/prusafinance/ppc-raiffeisen-ucet.html",
    formIndex: 0,
  },
  {
    n: 12,
    label: "ppc-raiffeisen-ucet — bottom",
    path: "/prusafinance/ppc-raiffeisen-ucet.html",
    formIndex: 1,
  },
];

test.beforeEach(async ({page}) => {
  if (process.env.PF_E2E_MOCK === "1") {
    await page.route("**/api/prusafinance/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ok: true}),
      });
    });
  }
});

for (const c of CASES) {
  test(`form ${c.n}/12: ${c.label}`, async ({page, baseURL}) => {
    const contact = `test${c.n}@test.sk`;
    const postPromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/prusafinance/contact") &&
        res.request().method() === "POST",
    );

    await page.goto(`${baseURL}${c.path}`, {waitUntil: "domcontentloaded"});

    await expect(page.locator('script[src*="pf-contact.js"]')).toHaveCount(1, {
      timeout: 10000,
    });

    const form = page.locator("form[data-pf-form]").nth(c.formIndex);
    await expect(form).toBeVisible();

    await form.locator('[name="jmeno"]').fill(`Test${c.n}`);

    if (c.emailField) {
      await form.locator('[name="email"]').fill(contact);
    } else {
      await form.locator('[name="kontakt"]').fill(contact);
    }

    if (c.fillMessage) {
      await form
        .locator('[name="zprava"]')
        .fill(`E2E test zpráva #${c.n} — automatický test formuláře.`);
    }

    await form.locator('[type="submit"]').click();

    const postRes = await postPromise;
    expect(postRes.status(), `POST /contact for ${c.label}`).toBe(200);
    await expect(page).toHaveURL(/dekujeme/, {timeout: 15000});
  });
}
