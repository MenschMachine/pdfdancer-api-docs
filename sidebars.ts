import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'getting-started',
    'authentication',
    {
      type: 'category',
      label: 'Java SDK',
      items: ['java/installation', 'java/quickstart', 'java/advanced'],
    },
    {
      type: 'category',
      label: 'Python SDK',
      items: ['python/installation', 'python/quickstart', 'python/advanced'],
    },
    {
      type: 'category',
      label: 'TypeScript SDK',
      items: ['typescript/installation', 'typescript/quickstart', 'typescript/advanced'],
    },
  ],
};

export default sidebars;
