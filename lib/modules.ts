export interface Module {
  slug: string;
  name: string;
  description: string;
  url: string;
  color: string;
}

export const MODULES: Module[] = [
  {
    slug: 'callcycle',
    name: 'Call Cycle Builder',
    description: 'Build and manage rep call cycles and schedules',
    url: 'https://iram.callcycle.fieldgoose.outerjoin.co.za',
    color: '#7CC042',
  },
  {
    slug: 'rvl',
    name: 'iRam Flow',
    description: 'Reverse logistics, aged stock and pick slip management',
    url: 'https://iram-rvl-crm.vercel.app',
    color: '#7CC042',
  },
  {
    slug: 'phantom',
    name: 'Phantom Consolidator',
    description: 'Consolidate phantom stock reports across vendors',
    url: 'https://phantom-consolidator.vercel.app',
    color: '#7CC042',
  },
  {
    slug: 'dispo',
    name: 'DISPO Cleaner',
    description: 'Clean and format DISPO export files',
    url: 'https://dispo-cleaner.vercel.app',
    color: '#7CC042',
  },
  {
    slug: 'pnp-oos',
    name: 'PnP OOS Reporter',
    description: 'Pick n Pay out-of-stock reporting',
    url: '',
    color: '#7CC042',
  },
];
