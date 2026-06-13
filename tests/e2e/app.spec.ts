import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("shows hero title and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("持续看见你离 FIRE 还有多远")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("进入演示")).toBeVisible();
    await expect(page.getByText("查看 Demo 面板")).toBeVisible();
  });

  test("quick calculator shows inputs and results", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("年开销")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("提取率 %")).toBeVisible();
    await expect(page.getByText("FIRE 目标")).toBeVisible();
  });
});

test.describe("Language switch", () => {
  test("switches from Chinese to English and back", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("总览")).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "ZH", exact: true }).click();
    await expect(page.getByRole("link", { name: "总览", exact: true })).toBeVisible();
  });
});

test.describe("Currency switch", () => {
  test("switches from CNY to USD", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("¥").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: "USD", exact: true }).click();
    await expect(page.getByText("$").first()).toBeVisible();
  });
});

test.describe("Login and dashboard flow", () => {
  test("demo login navigates to dashboard with charts and milestones", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("进入演示账户")).toBeVisible({ timeout: 15000 });

    await page.locator("button", { hasText: /Google/ }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    await expect(page.getByText("资产趋势")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("当前进度")).toBeVisible();
    await expect(page.getByText("里程碑").first()).toBeVisible();
  });
});

test.describe("Check-ins after login", () => {
  test("shows form, history, and allows adding entry", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("button", { hasText: /Google/ })).toBeVisible({ timeout: 15000 });
    await page.locator("button", { hasText: /Google/ }).click();
    await page.waitForURL(/dashboard/, { timeout: 10000 });

    await page.goto("/checkins");
    await expect(page.getByText("新增记录")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("历史记录")).toBeVisible();
    await expect(page.getByText("2026-03-01")).toBeVisible();

    const netWorthInput = page.locator('input[type="number"]').nth(0);
    await netWorthInput.clear();
    await netWorthInput.fill("2000000");
    await page.getByRole("button", { name: "保存记录" }).click();
    await expect(page.getByText("2,000,000")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Insights after login", () => {
  test("shows insight cards", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("button", { hasText: /Google/ })).toBeVisible({ timeout: 15000 });
    await page.locator("button", { hasText: /Google/ }).click();
    await page.waitForURL(/dashboard/, { timeout: 10000 });

    await page.goto("/insights");
    await expect(page.getByText("MILESTONE").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("TARGET").first()).toBeVisible();
  });
});

test.describe("Settings after login", () => {
  test("shows controls and sign out works", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("button", { hasText: /Google/ })).toBeVisible({ timeout: 15000 });
    await page.locator("button", { hasText: /Google/ }).click();
    await page.waitForURL(/dashboard/, { timeout: 10000 });

    await page.goto("/settings");
    await expect(page.getByText("默认提取率")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("main").getByRole("button", { name: "退出登录" })).toBeVisible();

    await page.getByRole("main").getByRole("button", { name: "退出登录" }).click();
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });
});
