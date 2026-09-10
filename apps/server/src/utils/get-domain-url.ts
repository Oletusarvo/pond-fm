import { loadEnvVariable } from "@pondfm/server-utils";

export function getDomainUrl() {
  return loadEnvVariable("DOMAIN_URL", false) || "http://localhost:5173";
}
