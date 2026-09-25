import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Normalize and sanitize database connection string
function cleanConnectionString(raw?: string): string | null {
  if (!raw) return null;
  const val = raw.trim().replace(/^["']+|["']+$/g, "").trim();
  if (!val.startsWith("postgresql://") && !val.startsWith("postgres://")) {
    return null;
  }
  return val;
}

// Read custom variables from .env or .env.local to ensure user updates take effect
function loadLocalEnvOverrides(): { dbUrl: string | null; directUrl: string | null } {
  const envFiles = [".env.local", ".env"];
  let dbUrl: string | null = null;
  let directUrl: string | null = null;

  for (const filename of envFiles) {
    try {
      const filePath = path.resolve(process.cwd(), filename);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            const rawVal = trimmed.slice(eqIdx + 1).trim();
            if (key === "DATABASE_URL" && !dbUrl) {
              dbUrl = cleanConnectionString(rawVal);
            }
            if (key === "DIRECT_URL" && !directUrl) {
              directUrl = cleanConnectionString(rawVal);
            }
          }
        }
      }
    } catch {
      // Fallback silently if filesystem cannot be read
    }
  }

  return {
    dbUrl: dbUrl || cleanConnectionString(process.env.DATABASE_URL),
    directUrl: directUrl || cleanConnectionString(process.env.DIRECT_URL),
  };
}

const { dbUrl: sanitizedDbUrl, directUrl: sanitizedDirectUrl } = loadLocalEnvOverrides();

if (sanitizedDbUrl) {
  process.env.DATABASE_URL = sanitizedDbUrl;
}
if (sanitizedDirectUrl) {
  process.env.DIRECT_URL = sanitizedDirectUrl;
}

declare global {
  var prismaGlobalInstance: PrismaClient | undefined;
  var __db_blocked_until: number | undefined;
}

/** Check if database connection is configured and not in cooldown due to circuit breaker or invalid credentials */
export function isDatabaseReady(): boolean {
  if (!sanitizedDbUrl) return false;
  if (globalThis.__db_blocked_until && Date.now() < globalThis.__db_blocked_until) {
    return false;
  }
  return true;
}

/** Put database queries in backoff cooldown to prevent triggering ECIRCUITBREAKER repeatedly */
export function recordDatabaseError(error: unknown) {
  const errMsg = String(error ?? "");
  if (
    errMsg.includes("ECIRCUITBREAKER") ||
    errMsg.includes("authentication failure") ||
    errMsg.includes("Authentication failed") ||
    errMsg.includes("P1000") ||
    errMsg.includes("P1001") ||
    errMsg.includes("P1013")
  ) {
    // Backoff for 2 minutes before attempting another connection to prevent spamming
    globalThis.__db_blocked_until = Date.now() + 120 * 1000;
  }
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: sanitizedDbUrl
      ? {
          db: {
            url: sanitizedDbUrl,
          },
        }
      : undefined,
    log: [],
  });
}

export const prisma = globalThis.prismaGlobalInstance ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobalInstance = prisma;
}
