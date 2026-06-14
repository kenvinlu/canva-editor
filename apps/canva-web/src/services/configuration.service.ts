import { $get } from './base-request.service';
import { Configuration } from '@canva-web/src/models/configuration.model';

async function fetchConfiguration(): Promise<Configuration | null> {
  try {
    const result = await $get<Configuration>(`/configuration?populate[header_menu][populate]=*&populate[footer_menu][populate]=*`, undefined, 0);
    return result?.data || null;
  } catch (error) {
    console.error('Failed to fetch configuration:', error);
    return null;
  }
}

export { fetchConfiguration };

