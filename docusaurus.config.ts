import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Flip this single flag when API v3 is released. Explicit /v1 and /v3 routes
// remain stable; only the preferred version and preview metadata change.
const V3_RELEASED = true;
const preferredDocsPath = V3_RELEASED ? '/v3/' : '/v1/';

const config: Config = {
    title: 'PDFDancer SDK Docs',
    tagline: 'Unified guides for every PDFDancer SDK',
    favicon: 'img/favicon.ico',
    headTags: [
        {
            tagName: 'meta',
            attributes: {
                property: 'og:type',
                content: 'website',
            },
        },
    ],

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: 'https://docs.pdfdancer.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'The Famous Cat', // Usually your GitHub org/user name.
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
                    exclude: ['**/capabilities/**', '**/reference/**'],
                    lastVersion: V3_RELEASED ? 'current' : '1',
                    versions: {
                        current: {
                            label: V3_RELEASED ? 'API v3' : 'API v3 Preview',
                            path: 'v3',
                            banner: V3_RELEASED ? 'none' : 'unreleased',
                            badge: true,
                            noIndex: !V3_RELEASED,
                        },
                        '1': {
                            label: 'API v1',
                            path: 'v1',
                            banner: 'none',
                            badge: true,
                        },
                    },
                },
                blog: false,
                sitemap: {
                    createSitemapItems: async ({defaultCreateSitemapItems, ...params}) => {
                        const items = await defaultCreateSitemapItems(params);
                        return items.map((item) => ({
                            ...item,
                            url: item.url.endsWith('/') ? item.url : `${item.url}/`,
                        }));
                    },
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],
    plugins: [
        [
            "posthog-docusaurus",
            {
                apiKey: "phc_WtwZKShVZjSkh0Y36zP4iDMRsftMWC5tMng2hVeU7h7",
                appUrl: "https://us.i.posthog.com",
                enableInDevelopment: false, // optional
            }
        ],
        ['@pdfdancer/docusaurus-cloudflare-search', {
            indexDocs: true,
            indexBlog: false,
            language: 'en',
        }],
        ['@docusaurus/plugin-client-redirects', {
            redirects: [
                {
                    from: '/',
                    to: preferredDocsPath,
                },
                {
                    from: '/sdk/templating',
                    to: '/v3/',
                },
            ],
            createRedirects(existingPath) {
                const v3Prefix = '/v3/';
                if (!V3_RELEASED || !existingPath.startsWith(v3Prefix)) {
                    return undefined;
                }

                const legacyPath = existingPath.slice(v3Prefix.length - 1);
                return legacyPath === '/' ? undefined : legacyPath;
            },
        }],
    ],
    themeConfig: {
        //  TODO Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        colorMode: {
            defaultMode: 'dark',
            disableSwitch: false,
            respectPrefersColorScheme: false,
        },
        navbar: {
            title: 'PDFDancer SDK',
            logo: {
                alt: 'PDFDancer SDK Logo',
                src: 'img/logo-silver-512h.webp',
                href: preferredDocsPath,
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'docs',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    type: 'docsVersionDropdown',
                    position: 'left',
                },
                {
                    href: 'https://github.com/MenschMachine/pdfdancer-api-docs',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            links: [
                {
                    title: 'Product',
                    items: [
                        {
                            label: 'Docs',
                            to: preferredDocsPath,
                        },
                        {
                            label: 'Roadmap',
                            to: '/roadmap',
                        },
                        {
                            label: 'Changelog',
                            href: 'https://www.pdfdancer.com/changelog',
                        },
                        {
                            label: 'Status',
                            href: 'https://status.pdfdancer.com',
                        },
                    ],
                },
                {
                    title: 'PDFDancer',
                    items: [
                        {
                            label: 'Home',
                            href: 'https://www.pdfdancer.com/',
                        },
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
            ],
            copyright: `© ${new Date().getFullYear()} The Famous Cat Ltd. All rights reserved.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['java', 'bash'],
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
