import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'PDFDancer SDK Docs',
    tagline: 'Unified guides for every PDFDancer SDK SDK',
    favicon: 'img/favicon.ico',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: 'https://MenschMachine.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'MenschMachine', // Usually your GitHub org/user name.
    projectName: 'pdfdancer-api-docs', // Usually your repo name.

    onBrokenLinks: 'throw',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    routeBasePath: '/', // Serve the docs at the site's root
                    sidebarPath: './sidebars.ts',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        colorMode: {
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: 'PDFDancer SDK',
            logo: {
                alt: 'PDFDancer SDK Logo',
                src: 'img/logo-orange-512h.webp',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'docs',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    href: 'https://github.com/MenschMachine/pdfdancer-api-docs',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'PDFDancer',
                    items: [
                        {
                            label: 'Docs',
                            to: '/',
                        },
                        {
                            label: 'Status',
                            href: 'https://status.pdfdancer.com',
                        },
                        {
                            label: 'Blog',
                            href: 'https://www.pdfdancer.com/blog',
                        },
                    ],
                },
                {
                    title: 'Company',
                    items: [
                        {
                            label: 'Privacy',
                            href: 'https://www.pdfdancer.com/privacy',
                        },
                        {
                            label: 'Terms of Service',
                            href: 'https://www.pdfdancer.com/terms-of-service',
                        },
                        {
                            label: 'Refund Policy',
                            href: 'https://www.pdfdancer.com/refund-policy',
                        },
                        {
                            label: 'Contact',
                            href: 'https://www.pdfdancer.com/contact',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/MenschMachine/pdfdancer',
                        },
                    ],
                },
            ],
            copyright: `© ${new Date().getFullYear()} PDFDancer. All rights reserved.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['java', 'bash'],
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
