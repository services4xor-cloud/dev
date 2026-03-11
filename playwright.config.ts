import { defineConfig, devices } from '@playwright/test'

/**
 * BeNetwork Playwright Configuration
 * Three test suites: smoke, brand validation, responsive screenshots
 * See: TESTING.md for full strategy
 */

export const VIEWPORTS = {
  xs: { width: 380, height: 812 },
  sm: { width: 640, height: 812 },
  md: { width: 768, height: 1024 },
  lg: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 800 },
  '3xl': { width: 1920, height: 1080 },
} as const

// All pages to test (smoke + brand)
export const PAGES = [
  '/',
  '/compass',
  '/ventures',
  '/offerings',
  '/about',
  '/pioneers/dashboard',
  '/anchors/dashboard',
  '/onboarding',
  '/be/ke',
  '/charity',
  '/pricing',
  '/contact',
  '/login',
  '/signup',
  '/not-found-test', // triggers 404
] as const

export default defineConfig({
  testDir: './tests/visual',
  outputDir: './tests/results',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'tests/playwright-report', open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'smoke',
      testMatch: '**/smoke.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: VIEWPORTS.desktop,
      },
    },
    {
      name: 'brand',
      testMatch: '**/brand.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: VIEWPORTS.desktop,
      },
    },
    {
      name: 'responsive',
      testMatch: '**/responsive.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
