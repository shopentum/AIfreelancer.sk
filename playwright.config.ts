import {defineConfig, devices} from "@playwright/test";

const baseURL =
  process.env.PF_E2E_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";

const skipServer = process.env.PF_E2E_SKIP_SERVER === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", {open: "never"}]],
  timeout: 60_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    trace: "on-first-retry",
  },
  webServer: skipServer
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
