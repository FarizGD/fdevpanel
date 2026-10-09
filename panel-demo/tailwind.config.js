const colors = require('tailwindcss/colors');

const blue = {
    50: '#eaf6ff',
    100: '#ceeaff',
    200: '#a8d8fa',
    300: '#75beff',
    400: '#389edc',
    500: '#2678ce',
    600: '#236ab7',
    700: '#1e5796',
    800: '#12456b',
    900: '#13253b',
};

const gray = {
    50: '#f5f8fc',
    100: '#f0f5fb',
    200: '#edf3fa',
    300: '#becdde',
    400: '#a2b1c3',
    500: '#637b93',
    600: '#293b50',
    700: '#1b2838',
    800: '#131c28',
    900: '#0c1119',
};

module.exports = {
    content: ['./resources/scripts/**/*.{js,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                header: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
                sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#080c12',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: blue,
                blue: blue,
                gray: gray,
                neutral: gray,
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: (theme) => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
};
