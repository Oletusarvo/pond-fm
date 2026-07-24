import { loadEnvVariable } from './load-env-variable';

export function getDomainUrl() {
  return loadEnvVariable('DOMAIN_URL', false) || 'http://localhost:5173';
}
