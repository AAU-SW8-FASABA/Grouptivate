import { test, expect } from "@playwright/test";

test("Lets press signin to start with", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("");
});
