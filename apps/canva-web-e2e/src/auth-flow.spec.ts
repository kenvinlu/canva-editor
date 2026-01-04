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

test.describe('Authentication Flow', () => {
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

  test('Complete authentication flow: signup, login, forgot password, and inbox welcome message', async ({
    page,
  }) => {
    // Step 1: Navigate to sign-up page
    await page.goto('/sign-up');
    await page.waitForLoadState('load');

    // Step 2: Fill sign-up form
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

    // Step 3: Logout to test login flow
    // Open user menu first
    await userMenuTrigger.click();
    // Wait for dropdown menu to be visible
    await page.locator('[data-testid="logout-button"]').waitFor({ state: 'attached', timeout: 5000 });
    
    // Click logout
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await logoutButton.click();

    // Wait for redirect to sign-in or home
    await page.waitForURL('**/sign-in', { timeout: 5000 }).catch(() => {
      // If not redirected, navigate manually
      page.goto('/sign-in');
    });

    // Step 4: Test login
    await page.goto('/sign-in');
    await page.waitForLoadState('load');

    await page.fill('[data-testid="signin-email"]', testEmail);
    await page.fill('[data-testid="signin-password"]', testPassword);

    // Submit login form
    await page.click('[data-testid="signin-submit"]');

    // Wait for login to complete - verify user menu appears
    await expect(userMenuTrigger).toBeVisible({ timeout: 15000 });

    // Step 5: Test forgot password flow
    // Logout again
    await userMenuTrigger.click();
    await page.locator('[data-testid="logout-button"]').waitFor({ state: 'attached', timeout: 5000 });
    await logoutButton.click();
    await page.waitForURL('**/sign-in', { timeout: 5000 }).catch(() => {
      page.goto('/sign-in');
    });

    // Navigate to forgot password page
    await page.goto('/forgot-password');
    await page.waitForLoadState('load');

    // Wait for the form to be visible
    const emailInput = page.locator('[data-testid="forgot-password-email"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 });

    // Fill forgot password form
    await emailInput.fill(testEmail);

    // Wait for submit button to be enabled and click
    const submitButton = page.locator('[data-testid="forgot-password-submit"]');
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    
    // Submit forgot password form and wait for network request
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/auth/forgot-password') && response.request().method() === 'POST'
    ).catch(() => {
      // Don't fail if network request doesn't complete - UI might still update
    });
    await Promise.all([
      responsePromise,
      submitButton.click(),
    ]);

    // Wait for success message to appear (form should disappear and success should show)
    const successMessage = page.locator('[data-testid="forgot-password-success"]');
    await expect(successMessage).toBeVisible({ timeout: 15000 });
    
    // Also verify the form is no longer visible
    await expect(emailInput).not.toBeVisible({ timeout: 5000 });

    // Step 6: Login again to check inbox
    await page.goto('/sign-in');
    await page.waitForLoadState('load');

    await page.fill('[data-testid="signin-email"]', testEmail);
    await page.fill('[data-testid="signin-password"]', testPassword);

    await page.click('[data-testid="signin-submit"]');

    // Verify login success
    await expect(userMenuTrigger).toBeVisible({ timeout: 15000 });

    // Step 7: Navigate to inbox and verify welcome message
    await page.goto('/inbox');
    await page.waitForLoadState('load');

    // Wait for messages to load - wait for either message list or empty state
    const messageList = page.locator('[data-testid="inbox-message-list"]');
    const emptyState = page.locator('[data-testid="inbox-empty"]');
    
    // Wait for either messages to load or empty state to appear
    try {
      await messageList.waitFor({ state: 'visible', timeout: 15000 });
    } catch {
      await emptyState.waitFor({ state: 'visible', timeout: 15000 });
    }

    // Verify we have messages (not empty)
    const isEmpty = await emptyState.isVisible().catch(() => false);
    expect(isEmpty).toBeFalsy();

    // Verify welcome message exists
    const welcomeMessage = page.locator('[data-testid="message-subject"]:has-text("Welcome to CanvaClone")');
    await expect(welcomeMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('Sign-up with Yopmail email', async ({ page }) => {
    await page.goto('/sign-up');
    await page.waitForLoadState('load');

    await page.fill('[data-testid="signup-firstname"]', testFirstName);
    await page.fill('[data-testid="signup-lastname"]', testLastName);
    await page.fill('[data-testid="signup-email"]', testEmail);
    await page.fill('[data-testid="signup-phone"]', '1234567890');
    await page.fill('[data-testid="signup-password"]', testPassword);
    await page.fill('[data-testid="signup-confirm-password"]', testPassword);

    await page.check('[data-testid="signup-agreement"]');

    await page.click('[data-testid="signup-submit"]');

    // Verify successful registration
    const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"]');
    await expect(userMenuTrigger).toBeVisible({ timeout: 15000 });
  });

  test('Login flow', async ({ page }) => {
    // First create a user
    await page.goto('/sign-up');
    await page.waitForLoadState('load');

    await page.fill('[data-testid="signup-firstname"]', testFirstName);
    await page.fill('[data-testid="signup-lastname"]', testLastName);
    await page.fill('[data-testid="signup-email"]', testEmail);
    await page.fill('[data-testid="signup-phone"]', '1234567890');
    await page.fill('[data-testid="signup-password"]', testPassword);
    await page.fill('[data-testid="signup-confirm-password"]', testPassword);

    await page.check('[data-testid="signup-agreement"]');

    await page.click('[data-testid="signup-submit"]');

    // Wait for registration to complete
    const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"]');
    await expect(userMenuTrigger).toBeVisible({ timeout: 15000 });

    // Logout
    await userMenuTrigger.click();
    await page.locator('[data-testid="logout-button"]').waitFor({ state: 'attached', timeout: 5000 });
    const logoutBtn = page.locator('[data-testid="logout-button"]');
    await logoutBtn.click();
    await page.waitForURL('**/sign-in', { timeout: 5000 }).catch(() => {
      page.goto('/sign-in');
    });

    // Now test login
    await page.goto('/sign-in');
    await page.waitForLoadState('load');

    await page.fill('[data-testid="signin-email"]', testEmail);
    await page.fill('[data-testid="signin-password"]', testPassword);

    await page.click('[data-testid="signin-submit"]');

    // Verify login success
    await expect(userMenuTrigger).toBeVisible({ timeout: 15000 });
  });

  test('Forgot password flow', async ({ page }) => {
    // First create a user
    await page.goto('/sign-up');
    await page.waitForLoadState('load');

    await page.fill('[data-testid="signup-firstname"]', testFirstName);
    await page.fill('[data-testid="signup-lastname"]', testLastName);
    await page.fill('[data-testid="signup-email"]', testEmail);
    await page.fill('[data-testid="signup-phone"]', '1234567890');
    await page.fill('[data-testid="signup-password"]', testPassword);
    await page.fill('[data-testid="signup-confirm-password"]', testPassword);

    await page.check('[data-testid="signup-agreement"]');

    await page.click('[data-testid="signup-submit"]');

    // Wait for registration
    const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"]');
    await expect(userMenuTrigger).toBeVisible({ timeout: 15000 });

    // Logout
    await userMenuTrigger.click();
    await page.locator('[data-testid="logout-button"]').waitFor({ state: 'attached', timeout: 5000 });
    const logoutBtn = page.locator('[data-testid="logout-button"]');
    await logoutBtn.click();
    await page.waitForURL('**/sign-in', { timeout: 5000 }).catch(() => {
      page.goto('/sign-in');
    });

    // Navigate to forgot password
    await page.goto('/forgot-password');
    await page.waitForLoadState('load');

    // Wait for the form to be visible
    const emailInput = page.locator('[data-testid="forgot-password-email"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 });

    await emailInput.fill(testEmail);
    
    // Wait for submit button to be enabled
    const submitButton = page.locator('[data-testid="forgot-password-submit"]');
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    await submitButton.click({ timeout: 10000 });
    
    // Verify success message appears
    const successMessage = page.locator('[data-testid="forgot-password-success"]');
    console.log(successMessage)
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Verify the form is no longer visible
    await expect(emailInput).not.toBeVisible({ timeout: 5000 });
  });

  test('Inbox welcome message after login', async ({ page }) => {
    // First create a user
    await page.goto('/sign-up');
    await page.waitForLoadState('load');

    await page.fill('[data-testid="signup-firstname"]', testFirstName);
    await page.fill('[data-testid="signup-lastname"]', testLastName);
    await page.fill('[data-testid="signup-email"]', testEmail);
    await page.fill('[data-testid="signup-phone"]', '1234567890');
    await page.fill('[data-testid="signup-password"]', testPassword);
    await page.fill('[data-testid="signup-confirm-password"]', testPassword);

    await page.check('[data-testid="signup-agreement"]');

    await page.click('[data-testid="signup-submit"]');

    // Wait for registration and welcome message creation
    const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"]');
    await expect(userMenuTrigger).toBeVisible({ timeout: 15000 });

    // Navigate to inbox
    await page.goto('/inbox');
    await page.waitForLoadState('load');

    // Wait for messages to load
    const messageList = page.locator('[data-testid="inbox-message-list"]');
    const emptyState = page.locator('[data-testid="inbox-empty"]');
    
    try {
      await messageList.waitFor({ state: 'visible', timeout: 15000 });
    } catch {
      await emptyState.waitFor({ state: 'visible', timeout: 15000 });
    }

    // Check if empty
    const isEmpty = await emptyState.isVisible().catch(() => false);
    expect(isEmpty).toBeFalsy();

    // Verify welcome message exists
    const welcomeMessage = page.locator('[data-testid="message-subject"]:has-text("Welcome to CanvaClone")');
    await expect(welcomeMessage.first()).toBeVisible({ timeout: 5000 });
  });
});
