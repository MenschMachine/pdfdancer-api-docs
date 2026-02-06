import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docs: [
        {
            type: 'category',
            label: 'Getting Started',
            collapsed: false,
            items: [
                'introduction',
                'getting-started',
                'getting-started-python',
                'getting-started-typescript',
                'getting-started-java',
                'getting-started-ai',
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
                'deleting-content',
            ],
        },
        {
            type: 'category',
            label: 'Working with Content',
            collapsed: false,
            items: [
                'extracting-text',
                'working-with-text',
                'working-with-images',
                'working-with-pages',
                'working-with-fonts',
                'working-with-templates',
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
                'working-with-snapshots',
                'redaction',
                'reflow-internals',
                'advanced',
            ],
        },
        {
            type: 'category',
            label: 'Reference',
            collapsed: false,
            items: [
                'available-fonts',
                'cookbook',
                'error-handling',
                'glossary',
                'sdk-versions',
                'roadmap',
            ],
        },
    ],
};

export default sidebars;
