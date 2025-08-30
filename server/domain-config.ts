// Domain configuration for wikenship.it
export const DOMAIN_CONFIG = {
  production: {
    domain: 'wikenship.it',
    subdomain: 'www.wikenship.it',
    protocol: 'https',
    baseUrl: 'https://wikenship.it',
    apiUrl: 'https://wikenship.it/api',
  },
  development: {
    domain: 'localhost',
    subdomain: '127.0.0.1',
    protocol: 'http',
    baseUrl: 'http://127.0.0.1:5000',
    apiUrl: 'http://127.0.0.1:5000/api',
  }
};

export function getDomainConfig() {
  return process.env.NODE_ENV === 'production' 
    ? DOMAIN_CONFIG.production 
    : DOMAIN_CONFIG.development;
}

export function isValidDomain(host: string): boolean {
  const validDomains = [
    'wikenship.it',
    'www.wikenship.it',
    'localhost:5000',
    '127.0.0.1:5000',
    'localhost',
    '127.0.0.1'
  ];
  
  return validDomains.some(domain => host?.includes(domain));
}

export function getFullUrl(path: string): string {
  const config = getDomainConfig();
  return `${config.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}