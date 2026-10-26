import { resolveMode } from './lib/mode.js';

const { mode, apiBaseUrl } = resolveMode(import.meta.env);

/** "live" (real backend) or "demo" (pre-generated samples); decided at build time. */
export const MODE = mode;
export const IS_DEMO = mode === 'demo';
export const API_BASE_URL = apiBaseUrl;
export const IS_DEV = import.meta.env.DEV;

export const SOURCE_URL = 'https://github.com/lillly1/lillly1.github.io/tree/main/projects/ai-recipe-remix';
export const README_SETUP_URL =
  'https://github.com/lillly1/lillly1.github.io/blob/main/projects/ai-recipe-remix/README.md#local-setup';
/** The project's page in Xinyue Feng's portfolio (linked from the demo banner). */
export const PROJECT_PAGE_URL = 'https://lillly1.github.io/work/recipe-remix/';
