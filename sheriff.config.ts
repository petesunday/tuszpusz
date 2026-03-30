import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  enableBarrelLess: true,
  modules: {
    'src/app': {
      core: 'type:core',
      shared: {
        utils: ['domain:shared', 'type:util'],
        '<type>': ['domain:shared', 'type:<type>'],
        '<type>/<module>': ['domain:shared', 'type:<type>'],
      },
      // When you add a domain, follow this pattern:
      // <domain>: {
      //   '<type>': ['domain:<domain>', 'type:<type>'],
      // },
    },
  },
  depRules: {
    root: ['type:feature', 'type:core', 'domain:shared'],
    'type:core': ['domain:shared'],
    'domain:*': [sameTag, 'domain:shared'],
    'type:feature': ['type:data', 'type:ui', 'type:util'],
    'type:data': ['type:util'],
    'type:ui': ['type:util'],
    'type:util': [],
  },
};
