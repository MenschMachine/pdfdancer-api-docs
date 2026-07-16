import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docs: [
        {
            type: 'category',
            label: 'Start Here',
            collapsed: false,
            items: [
                'getting-started',
                'getting-started-python',
                'getting-started-typescript',
                'getting-started-java',
                'authentication',
            ],
        },
        {
            type: 'category',
            label: 'Understand Documents',
            items: [
                'concepts',
                'finding-content',
                'positioning',
            ],
        },
        {
            type: 'category',
            label: 'Edit Content',
            items: [
                {
                    type: 'category',
                    label: 'Text Editing',
                    items: ['working-with-text', 'editing-text', 'styling-text', 'text-layout'],
                },
                'working-with-pages',
                'working-with-images',
                'working-with-vector-graphics',
                'working-with-fonts',
            ],
        },
        {
            type: 'category',
            label: 'Forms',
            items: ['working-with-acroforms', 'working-with-formxobjects'],
        },
        {
            type: 'category',
            label: 'Production',
            items: [
                'preservation-and-pdfa',
                'error-handling',
                'advanced',
                'troubleshooting',
            ],
        },
        {
            type: 'category',
            label: 'Reference',
            items: [
                'reference/index',
                'reference/python/index',
                'reference/typescript/index',
                'reference/java/index',
                'available-fonts',
                'sdk-versions',
                'glossary',
                'migrating-from-v1',
            ],
        },
    ],
};

export default sidebars;
