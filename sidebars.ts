import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docs: [
        {
            type: 'category',
            label: 'Getting Started',
            collapsed: false,
            items: [
                'getting-started',
                'quickstart',
                'authentication',
            ],
        },
        {
            type: 'category',
            label: 'Core Concepts',
            collapsed: false,
            items: [
                'concepts',
                'finding-content',
                'positioning',
            ],
        },
        {
            type: 'category',
            label: 'Working with Content',
            collapsed: false,
            items: [
                'working-with-text',
                'working-with-images',
                'working-with-pages',
                'working-with-fonts',
            ],
        },
        {
            type: 'category',
            label: 'Forms & Advanced',
            collapsed: false,
            items: [
                'working-with-acroforms',
                'working-with-formxobjects',
                'working-with-vector-graphics',
                'advanced',
            ],
        },
        {
            type: 'category',
            label: 'Reference',
            collapsed: false,
            items: [
                'cookbook',
                'error-handling',
                'sdk-versions',
            ],
        },
    ],
};

export default sidebars;
