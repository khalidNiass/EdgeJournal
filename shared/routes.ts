import { z } from 'zod';
import { insertUserSchema, insertTradeSchema, trades, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<User>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<User>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.void(),
      },
    },
    user: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<User>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  trades: {
    list: {
      method: 'GET' as const,
      path: '/api/trades' as const,
      responses: {
        200: z.array(z.custom<Trade>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/trades' as const,
      input: insertTradeSchema,
      responses: {
        201: z.custom<Trade>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        403: z.object({ message: z.string() }), // For limit reached
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/trades/:id' as const,
      input: insertTradeSchema.partial(),
      responses: {
        200: z.custom<Trade>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/trades/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  analytics: {
    get: {
      method: 'GET' as const,
      path: '/api/analytics' as const,
      responses: {
        200: z.object({
          totalTrades: z.number(),
          winRate: z.number(),
          netProfit: z.number(), // Simplified for now
          avgRiskReward: z.number(),
          monthlyPerformance: z.array(z.object({
            month: z.string(),
            profit: z.number(),
          })),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Type exports
export type User = typeof users.$inferSelect;
export type Trade = typeof trades.$inferSelect;
