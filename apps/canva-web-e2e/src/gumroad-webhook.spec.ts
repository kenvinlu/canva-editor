import { test, expect, APIRequestContext } from '@playwright/test';

function generateTestEmail(prefix: string): string {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${randomString}@example.com`;
}

type GumroadWebhookPayload = {
  email: string;
  permalink: string;
  product_name: string;
  price: number;
  sale_id: string;
  full_name?: string;
  order_number?: string;
  sale_timestamp?: string;
  test?: string;
  refunded?: string;
  disputed?: string;
  currency?: string;
  quantity?: number;
  gumroad_fee?: number;
};

type GumroadWebhookResponse = {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    userId: number | string;
    isNewUser: boolean;
    webhookLogId?: string;
  };
};

async function triggerGumroadWebhook(
  request: APIRequestContext,
  payload: GumroadWebhookPayload
): Promise<GumroadWebhookResponse> {
  const apiBaseUrl = process.env.API_URL || 'http://localhost:1337';

  const response = await request.post(`${apiBaseUrl}/api/orders/gumroad-webhook`, {
    data: payload,
  });

  expect(response.ok()).toBeTruthy();

  const json = (await response.json()) as GumroadWebhookResponse;

  expect(json.success).toBeTruthy();
  expect(json.data.orderId).toBeTruthy();
  expect(json.data.userId).toBeTruthy();
  expect(json.data.webhookLogId).toBeTruthy();

  return json;
}

test.describe('Gumroad webhook integration for products', () => {
  const basePayload: Partial<GumroadWebhookPayload> = {
    price: 29,
    sale_timestamp: new Date().toISOString(),
    test: 'true',
    refunded: 'false',
    disputed: 'false',
    currency: 'usd',
    quantity: 1,
    gumroad_fee: 199,
    full_name: 'Webhook Test User',
  };

  test('processes Gumroad webhook for Canva Editor product', async ({ request }) => {
    const testEmail = generateTestEmail('canva-editor');

    const response = await triggerGumroadWebhook(request, {
      ...(basePayload as GumroadWebhookPayload),
      email: testEmail,
      permalink: 'canva-editor',
      product_name: 'Canva Editor',
      sale_id: `test-sale-canva-editor-${Date.now()}`,
      order_number: `ORDER-CE-${Date.now()}`,
    });

    // Verify new user was created
    expect(response.data.isNewUser).toBeTruthy();
    expect(response.data.orderId).toBeTruthy();
    expect(response.data.userId).toBeTruthy();
    expect(response.data.webhookLogId).toBeTruthy();
  });

  test('processes Gumroad webhook for Upgrade to Advanced - user with Canva Editor gets Canva Clone', async ({
    request,
  }) => {
    const testEmail = generateTestEmail('upgrade-with-editor');

    // First, create a user with Canva Editor
    const canvaEditorResponse = await triggerGumroadWebhook(request, {
      ...(basePayload as GumroadWebhookPayload),
      email: testEmail,
      permalink: 'canva-editor',
      product_name: 'Canva Editor',
      sale_id: `test-sale-canva-editor-${Date.now()}`,
      order_number: `ORDER-CE-${Date.now()}`,
    });

    expect(canvaEditorResponse.data.isNewUser).toBeTruthy();

    // Now test Upgrade to Advanced - should assign Canva Clone since user has Canva Editor
    const upgradeResponse = await triggerGumroadWebhook(request, {
      ...(basePayload as GumroadWebhookPayload),
      email: testEmail,
      permalink: 'upgrade-to-canva-clone',
      product_name: 'Upgrade to Advanced',
      sale_id: `test-sale-upgrade-${Date.now()}`,
      order_number: `ORDER-UP-${Date.now()}`,
    });

    // Verify existing user was reused
    expect(upgradeResponse.data.isNewUser).toBeFalsy();
    expect(upgradeResponse.data.userId).toBe(canvaEditorResponse.data.userId);
    expect(upgradeResponse.data.orderId).toBeTruthy();
    expect(upgradeResponse.data.orderId).not.toBe(canvaEditorResponse.data.orderId);
    expect(upgradeResponse.data.webhookLogId).toBeTruthy();
  });

  test('processes Gumroad webhook for Upgrade to Advanced - user without Canva Editor gets Canva Editor', async ({
    request,
  }) => {
    const testEmail = generateTestEmail('upgrade-no-editor');

    // Test Upgrade to Advanced for a new user (no Canva Editor) - should assign Canva Editor
    const upgradeResponse = await triggerGumroadWebhook(request, {
      ...(basePayload as GumroadWebhookPayload),
      email: testEmail,
      permalink: 'upgrade-to-canva-clone',
      product_name: 'Upgrade to Advanced',
      sale_id: `test-sale-upgrade-${Date.now()}`,
      order_number: `ORDER-UP-${Date.now()}`,
    });

    // Verify new user was created and order was created
    expect(upgradeResponse.data.isNewUser).toBeTruthy();
    expect(upgradeResponse.data.orderId).toBeTruthy();
    expect(upgradeResponse.data.userId).toBeTruthy();
    expect(upgradeResponse.data.webhookLogId).toBeTruthy();
  });

  test('processes Gumroad webhook for Canva Clone product', async ({ request }) => {
    const testEmail = generateTestEmail('canva-clone');

    const response = await triggerGumroadWebhook(request, {
      ...(basePayload as GumroadWebhookPayload),
      email: testEmail,
      permalink: 'canva-clone',
      product_name: 'Canva Clone',
      price: 49,
      sale_id: `test-sale-canva-clone-${Date.now()}`,
      order_number: `ORDER-CC-${Date.now()}`,
    });

    // Verify new user was created
    expect(response.data.isNewUser).toBeTruthy();
    expect(response.data.orderId).toBeTruthy();
    expect(response.data.userId).toBeTruthy();
    expect(response.data.webhookLogId).toBeTruthy();
  });
});


