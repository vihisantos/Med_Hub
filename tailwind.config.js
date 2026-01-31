/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // --- BASE SURFACES (Zinc - Neutral Dark) ---
                'brand-bg': '#09090b',         // Zinc 950 - Deepest Neutral
                'brand-surface': '#18181b',    // Zinc 900 - Cards
                'brand-surface-highlight': '#27272a', // Zinc 800 - Hover
                'brand-border': '#27272a',     // Zinc 800 - Borders

                // --- TYPOGRAPHY ---
                'brand-text': '#fafafa',       // Zinc 50 - Primary
                'brand-subtext': '#a1a1aa',    // Zinc 400 - Secondary

                // --- PRIMARY BRAND (Medical Teal) ---
                // Full scale for UI depth (badges, backgrounds, borders)
                'brand-primary': {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4', // Light accents
                    400: '#2dd4bf',
                    500: '#14b8a6', // MAIN BRAND COLOR (Buttons/Active)
                    600: '#0d9488', // Hover States
                    700: '#0f766e', // Deep Text/Borders
                    800: '#115e59',
                    900: '#134e4a',
                },

                // --- LEGACY MAPPINGS (Preserving existing class usage) ---
                'brand-accent': '#14b8a6',     // Mapped to Primary 500
                'brand-accent-hover': '#0d9488', // Mapped to Primary 600
                'brand-light-blue': '#14b8a6', // Redirecting old blue to teal
                'brand-dark': '#09090b',       // Mapped to Zinc 950 (was #0f172a)
                'brand-beige': '#0f172a',      // Unified dark theme
                'brand-grey': '#94a3b8',
            },
            fontFamily: {
                'display': ['Poppins', 'sans-serif'],
                'sans': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
