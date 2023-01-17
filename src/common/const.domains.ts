// domains - endpoints
export const domains = {
  DOMAIN_BANK: 'banks',
  DOMAIN_CATEGORY: 'categories',
  DOMAIN_TRANSACTION: 'transactions',
  DOMAIN_STATISTICS: 'reports',
} as const;

export type DomainValueType =
  | (typeof domains)[keyof typeof domains]
  | 'generic';
