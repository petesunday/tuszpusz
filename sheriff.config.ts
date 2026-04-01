import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  enableBarrelLess: true,
  autoTagging: false,
  modules: {
    'src/app': {
      shared: {
        util: ['domain:shared', 'type:util'],
        '<type>': ['domain:shared', 'type:<type>'],
        '<type>/<module>': ['domain:shared', 'type:<type>'],
      },
      auth: {
        '<type>': ['domain:auth', 'type:<type>'],
      },
      home: {
        '<type>': ['domain:home', 'type:<type>'],
      },
    },
  },
  depRules: {
    root: [
      'type:feature',
      'type:core',
      'type:data-access',
      'domain:shared',
      'domain:auth',
      'domain:home',
    ],
    'type:core': ['domain:shared'],
    'domain:*': [sameTag, 'domain:shared', 'domain:auth'],
    'type:feature': ['type:data-access', 'type:ui', 'type:util', 'type:model'],
    'type:data-access': ['type:util', 'type:model'],
    'type:model': [],
    'type:ui': ['type:util', 'type:directives'],
    'type:util': [],
  },
};
