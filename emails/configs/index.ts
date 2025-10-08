import { type TailwindConfig } from '@react-email/components';

const tailwingConfigs = {
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.9900 0 0)',
        foreground: 'oklch(0 0 0)',
        card: 'oklch(1 0 0)',
        'card-foreground': 'oklch(0 0 0)',
        popover: 'oklch(0.9900 0 0)',
        'popover-foreground': 'oklch(0 0 0)',
        primary: 'oklch(0 0 0)',
        'primary-foreground': 'oklch(1 0 0)',
        secondary: 'oklch(0.9400 0 0)',
        'secondary-foreground': 'oklch(0 0 0)',
        muted: 'oklch(0.9700 0 0)',
        'muted-foreground': 'oklch(0.4400 0 0)',
        accent: 'oklch(0.9400 0 0)',
        'accent-foreground': 'oklch(0 0 0)',
        destructive: 'oklch(0.6300 0.1900 23.0300)',
        'destructive-foreground': 'oklch(1 0 0)',
        border: 'oklch(0.9200 0 0)',
        input: 'oklch(0.9400 0 0)',
        ring: 'oklch(0 0 0)',
        'chart-1': 'oklch(0.8100 0.1700 75.3500)',
        'chart-2': 'oklch(0.5500 0.2200 264.5300)',
        'chart-3': 'oklch(0.7200 0 0)',
        'chart-4': 'oklch(0.9200 0 0)',
        'chart-5': 'oklch(0.5600 0 0)',
        sidebar: 'oklch(0.9900 0 0)',
        'sidebar-foreground': 'oklch(0 0 0)',
        'sidebar-primary': 'oklch(0 0 0)',
        'sidebar-primary-foreground': 'oklch(1 0 0)',
        'sidebar-accent': 'oklch(0.9400 0 0)',
        'sidebar-accent-foreground': 'oklch(0 0 0)',
        'sidebar-border': 'oklch(0.9400 0 0)',
        'sidebar-ring': 'oklch(0 0 0)',
      },
      fontFamily: {
        sans: 'Geist, sans-serif',
        serif: 'Georgia, serif',
        mono: 'Geist Mono, monospace',
      },
    },
  },
  darkMode: 'class',
} satisfies TailwindConfig;

export default tailwingConfigs;
