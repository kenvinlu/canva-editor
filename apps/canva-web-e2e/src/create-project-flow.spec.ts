import { test, expect, APIRequestContext } from '@playwright/test';

// Helper function to generate random Yopmail email
function generateYopmailEmail(): string {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${randomString}@yopmail.com`;
}

// Helper function to generate random password
function generatePassword(): string {
  return `Test${Math.random().toString(36).substring(2, 10)}!123`;
}

// Helper function to cleanup test user account
async function cleanupTestUser(
  request: APIRequestContext,
  email: string,
  password: string,
  baseURL: string
): Promise<void> {
  try {
    // Step 1: Login to get authentication token
    const loginResponse = await request.post(`${baseURL}/api/auth/local`, {
      data: {
        identifier: email,
        password: password,
      },
    });

    if (!loginResponse.ok()) {
      // User might not exist or login failed, skip cleanup
      console.log(`Cleanup skipped: Could not login with email ${email}`);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData?.jwt || loginData?.data?.jwt;

    if (!token) {
      console.log(`Cleanup skipped: No token received for email ${email}`);
      return;
    }

    // Step 2: Get current user info to get user ID
    const userResponse = await request.get(`${baseURL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok()) {
      console.log(`Cleanup skipped: Could not get user info for email ${email}`);
      return;
    }

    const userData = await userResponse.json();
    const userId = userData?.id || userData?.data?.id;

    if (!userId) {
      console.log(`Cleanup skipped: No user ID found for email ${email}`);
      return;
    }

    // Step 3: Attempt to delete the user
    // Note: This assumes Strapi users-permissions plugin allows user deletion
    // If this endpoint doesn't exist, you may need to create a custom endpoint
    const deleteResponse = await request.delete(`${baseURL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (deleteResponse.ok()) {
      console.log(`Successfully cleaned up test user: ${email}`);
    } else {
      console.log(`Cleanup warning: Could not delete user ${email} (status: ${deleteResponse.status()})`);
    }
  } catch (error) {
    // Don't fail the test if cleanup fails
    console.log(`Cleanup error for ${email}:`, error instanceof Error ? error.message : 'Unknown error');
  }
}

test.describe('Create Project from Template Flow', () => {
  let testEmail: string;
  let testPassword: string;
  let testFirstName: string;
  let testLastName: string;

  test.beforeEach(() => {
    // Generate random test data for each test
    testEmail = generateYopmailEmail();
    testPassword = generatePassword();
    testFirstName = `Test${Math.random().toString(36).substring(2, 8)}`;
    testLastName = `User${Math.random().toString(36).substring(2, 8)}`;
  });

  test.afterEach(async ({ request }) => {
    // Cleanup test user account after each test (pass or fail)
    if (testEmail) {
      const baseURL = process.env.PORT 
        ? `http://localhost:${process.env.PORT}` 
        : 'http://localhost:3001';
      await cleanupTestUser(request, testEmail, testPassword, baseURL);
    }
  });

  test('Complete flow: create account -> login -> create project from template', async ({
    page,
  }) => {
    // Step 1: Navigate to sign-up page and create account
    await page.goto('/sign-up');
    await page.waitForLoadState('load');

    // Fill sign-up form
    await page.fill('[data-testid="signup-firstname"]', testFirstName);
    await page.fill('[data-testid="signup-lastname"]', testLastName);
    await page.fill('[data-testid="signup-email"]', testEmail);
    await page.fill('[data-testid="signup-phone"]', '1234567890');
    await page.fill('[data-testid="signup-password"]', testPassword);
    await page.fill('[data-testid="signup-confirm-password"]', testPassword);

    // Check agreement checkbox
    await page.check('[data-testid="signup-agreement"]');

    // Submit sign-up form
    await page.click('[data-testid="signup-submit"]');

    // Wait for successful registration - wait for user menu to appear
    const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"]');
    await expect(userMenuTrigger).toBeVisible({ timeout: 15000 });

    // Step 2: Navigate to templates page
    await page.goto('/templates');
    await page.waitForLoadState('load');

    // Wait for templates to load
    const templatesContainer = page.locator('[data-testid="templates-container"]');
    await expect(templatesContainer).toBeVisible({ timeout: 10000 });

    // Step 3: Click on the first available template
    const firstTemplate = page.locator('[data-testid="template-card"]').first();
    await expect(firstTemplate).toBeVisible({ timeout: 5000 });
    
    // Click on the template to open detail dialog or navigate to detail page
    await firstTemplate.click();
    
    // Wait for template detail to appear (either in dialog or on page)
    const templateDialog = page.locator('[data-testid="template-detail-dialog"]');
    const templateDetailPage = page.locator('[data-testid="template-detail-page"]');
    
    // Wait for either dialog or page to appear, or URL change
    await Promise.race([
      templateDialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null),
      templateDetailPage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null),
      page.waitForURL(/\/templates\/.+/, { timeout: 5000 }).catch(() => null),
    ]);

    // Step 4: Click "Customize this template" button to create project
    const customizeButton = page.locator('[data-testid="template-customize-button"]');
    await expect(customizeButton).toBeVisible({ timeout: 10000 });
    await customizeButton.click();

    // Step 5: Wait for project creation and redirect to design page
    // The project creation should redirect to /design/{documentId}
    await page.waitForURL(/\/design\/.+/, { timeout: 15000 });

    // Verify we're on the design page
    const designPage = page.locator('[data-testid="design-page"]');
    await expect(designPage).toBeVisible({ timeout: 10000 });

    // Verify project was created successfully by checking URL contains documentId
    const urlMatch = page.url().match(/\/design\/(.+)/);
    expect(urlMatch).not.toBeNull();
    const documentId = urlMatch?.[1];
    expect(documentId).toBeTruthy();
    // Additional verification: check that the design editor is loaded
    // This confirms the project was successfully created and loaded
    console.log('Project created successfully with documentId:', documentId);
  });
});

