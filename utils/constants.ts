export type CurrencyInfo = {
    selectLabel: string;
    country: string;
    currency: string;
  };
  
  export const CURRENCIES: Record<string, CurrencyInfo> = {
    EUR: {
      selectLabel: 'Euro flag EUR',
      country: 'Euro',
      currency: 'EUR',
    },
    USD: {
      selectLabel: 'USA flag USD',
      country: 'USA',
      currency: 'USD',
    },
    MXN: {
      selectLabel: 'Mexico flag MXN',
      country: 'Mexico',
      currency: 'MXN',
    },
  };

  export const URLS = {
    HOME: 'https://efex.vercel.app',
  };