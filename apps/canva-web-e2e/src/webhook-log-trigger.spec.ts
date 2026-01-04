import { test, expect, APIRequestContext } from '@playwright/test';

function generateTestEmail(prefix: string): string {
  return `${prefix}@yopmail.com`;
}

type WebhookLogTriggerPayload = {
  card: {
    bin: string;
    type: string;
    visual: string;
    expiry_year: string;
    expiry_month: string;
  };
  test: string;
  email: string;
  price: string;
  sale_id: string;
  currency: string;
  disputed: string;
  quantity: string;
  referrer: string;
  refunded: string;
  permalink: string;
  seller_id: string;
  ip_country: string;
  product_id: string;
  can_contact: string;
  dispute_won: string;
  gumroad_fee: string;
  order_number: string;
  product_name: string;
  purchaser_id: string;
  sale_timestamp: string;
  short_product_id: string;
  product_permalink: string;
  discover_fee_charged: string;
  is_gift_receiver_purchase: string;
};

type WebhookLogTriggerResponse = {
  success: boolean;
  message: string;
  data: {
    webhookLogId: string;
    webhookLog: {
      id: number;
      documentId: string;
      provider: string;
      event_type: string;
      payload: WebhookLogTriggerPayload;
      status: string;
      error_message: string | null;
      order_id: string | null;
      user_id: string | null;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      locale: string | null;
    };
  };
};

async function triggerWebhookLog(
  request: APIRequestContext,
  payload: WebhookLogTriggerPayload
): Promise<WebhookLogTriggerResponse> {
  const apiBaseUrl = process.env.API_URL || 'http://localhost:1337';
  // const apiBaseUrl = 'https://api.canvaclone.com';

  const response = await request.post(
    `${apiBaseUrl}/api/webhook-logs/create-and-trigger`,
    {
      data: payload,
    }
  );

  expect(response.ok()).toBeTruthy();

  const json = (await response.json()) as WebhookLogTriggerResponse;

  expect(json.success).toBeTruthy();
  expect(json.data.webhookLogId).toBeTruthy();
  expect(json.data.webhookLog).toBeTruthy();

  return json;
}

test.describe('Webhook log trigger API', () => {
  const basePayload: Partial<WebhookLogTriggerPayload> = {
    card: {
      bin: '',
      type: '',
      visual: '',
      expiry_year: '',
      expiry_month: '',
    },
    test: 'true',
    price: '2900',
    currency: 'usd',
    disputed: 'false',
    quantity: '1',
    referrer: 'direct',
    refunded: 'false',
    permalink: 'canva-editor',
    seller_id: 'q4td0JPT3-Z_8YC5jXxFcA==',
    ip_country: 'Vietnam',
    product_id: 'luo7QmAJorP_gKha7jgDtQ==',
    can_contact: 'true',
    dispute_won: 'false',
    gumroad_fee: '340',
    sale_timestamp: new Date().toISOString(),
    short_product_id: 'qqiju',
    product_permalink: 'https://kenvinlu.gumroad.com/l/canva-editor',
    discover_fee_charged: 'false',
    is_gift_receiver_purchase: 'false',
  };

  test('triggers webhook log for Canva Editor product', async ({ request }) => {
    const testEmail = generateTestEmail('canva-editor-07');
    const saleId = `goOEHfuaeSnx8On0NFQKQg==-${Date.now()}`;
    const orderNumber = `403688769-${Date.now()}`;

    const payload: WebhookLogTriggerPayload = {
      ...(basePayload as WebhookLogTriggerPayload),
      email: testEmail,
      permalink: 'canva-editor',
      product_name: 'Canva Editor',
      sale_id: saleId,
      order_number: orderNumber,
      purchaser_id: `8563119977138-${Date.now()}`,
    };

    const response = await triggerWebhookLog(request, payload);

    // Verify response structure
    expect(response.data.webhookLog).toBeTruthy();
    expect(response.data.webhookLog.provider).toBe('gumroad');
    expect(response.data.webhookLog.event_type).toBe('sale');
    expect(response.data.webhookLog.status).toBe('processing');

    // Compare product_name from payload with response
    expect(response.data.webhookLog.payload.product_name).toBe(payload.product_name);
    expect(response.data.webhookLog.payload.product_name).toBe('Canva Editor');
    expect(response.data.webhookLog.payload.email).toBe(testEmail);
  });

  test('triggers webhook log for Canva Clone product', async ({ request }) => {
    const testEmail = generateTestEmail('canva-clone');
    const saleId = `goOEHfuaeSnx8On0NFQKQg==-${Date.now()}`;
    const orderNumber = `403688769-${Date.now()}`;

    const payload: WebhookLogTriggerPayload = {
      ...(basePayload as WebhookLogTriggerPayload),
      email: testEmail,
      permalink: 'canva-clone',
      product_name: 'Canva Clone',
      sale_id: saleId,
      order_number: orderNumber,
      purchaser_id: `8563119977138-${Date.now()}`,
    };

    const response = await triggerWebhookLog(request, payload);

    // Verify response structure
    expect(response.data.webhookLog).toBeTruthy();
    expect(response.data.webhookLog.provider).toBe('gumroad');
    expect(response.data.webhookLog.event_type).toBe('sale');
    expect(response.data.webhookLog.status).toBe('processing');

    // Compare product_name from payload with response
    expect(response.data.webhookLog.payload.product_name).toBe(payload.product_name);
    expect(response.data.webhookLog.payload.product_name).toBe('Canva Clone');
    expect(response.data.webhookLog.payload.email).toBe(testEmail);
  });

  test('triggers webhook log for Upgrade to Advanced product', async ({ request }) => {
    const testEmail = generateTestEmail('canva-editor');
    const saleId = `goOEHfuaeSnx8On0NFQKQg==-${Date.now()}`;
    const orderNumber = `403688769-${Date.now()}`;

    const payload: WebhookLogTriggerPayload = {
      ...(basePayload as WebhookLogTriggerPayload),
      email: testEmail,
      permalink: 'upgrade-to-canva-clone',
      product_name: 'Upgrade to Advanced',
      sale_id: saleId,
      order_number: orderNumber,
      purchaser_id: `8563119977138-${Date.now()}`,
    };

    const response = await triggerWebhookLog(request, payload);

    // Verify response structure
    expect(response.data.webhookLog).toBeTruthy();
    expect(response.data.webhookLog.provider).toBe('gumroad');
    expect(response.data.webhookLog.event_type).toBe('sale');
    expect(response.data.webhookLog.status).toBe('processing');

    // Compare product_name from payload with response
    expect(response.data.webhookLog.payload.product_name).toBe(payload.product_name);
    expect(response.data.webhookLog.payload.product_name).toBe('Upgrade to Advanced');
    expect(response.data.webhookLog.payload.email).toBe(testEmail);
  });
});

