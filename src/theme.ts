"use client";

import { createTheme, MantineColorsTuple } from "@mantine/core";

// Cyberpunk "NEO-HÀNH" color palette
// Void Black - Dark theme base
const dark: MantineColorsTuple = [
    "#C1C2C5",
    "#A6A7AB",
    "#909296",
    "#5C5F66",
    "#373A40",
    "#2C2E33",
    "#1A1B1E",
    "#0a0a0a", // Void Black
    "#050505", // Deep Void
    "#000000",
];

// Cyber Cyan - Primary accent
const cyan: MantineColorsTuple = [
    "#e0fcff",
    "#b8f3ff",
    "#8aebff",
    "#5ce3ff",
    "#2edbff",
    "#00f2ff", // Cyber Cyan - Primary
    "#00c4cc",
    "#009699",
    "#006866",
    "#003a33",
];

// Neon Magenta - Secondary accent
const magenta: MantineColorsTuple = [
    "#ffe0f0",
    "#ffb8d9",
    "#ff8abf",
    "#ff5ca5",
    "#ff2e8b",
    "#ff0055", // Fire/Neon Magenta
    "#cc0044",
    "#990033",
    "#660022",
    "#330011",
];

// Neon Green - Wood element
const neonGreen: MantineColorsTuple = [
    "#e0ffe6",
    "#b8ffc7",
    "#8affa3",
    "#5cff7f",
    "#2eff5b",
    "#00ff9d", // Neon Green
    "#00cc7d",
    "#00995e",
    "#00663e",
    "#00331f",
];

export const theme = createTheme({
    // Force dark color scheme
    primaryColor: "cyan",
    primaryShade: 5,

    colors: {
        dark,
        cyan,
        magenta,
        neonGreen,
    },

    // Typography - Chakra Petch for tech/cyberpunk look with Vietnamese support
    fontFamily: "'Chakra Petch', 'Segoe UI', sans-serif",
    headings: {
        fontFamily: "'Chakra Petch', 'Segoe UI', sans-serif",
        fontWeight: "700",
    },

    // Sharp corners for cyberpunk aesthetic
    defaultRadius: 0,

    // Component overrides for Cyberpunk vibe
    components: {
        Paper: {
            defaultProps: {
                bg: "dark.8",
            },
            styles: {
                root: {
                    border: "1px solid rgba(0, 242, 255, 0.2)",
                    boxShadow: "0 0 20px rgba(0, 242, 255, 0.1)",
                },
            },
        },

        Modal: {
            defaultProps: {
                centered: true,
                overlayProps: {
                    opacity: 0.9,
                    blur: 5,
                },
            },
            styles: {
                content: {
                    borderRadius: 0,
                    border: "1px solid #00f2ff",
                    backgroundColor: "rgba(10, 10, 10, 0.95)",
                    boxShadow: "0 0 30px rgba(0, 242, 255, 0.2)",
                },
                header: {
                    backgroundColor: "transparent",
                    borderBottom: "1px solid rgba(0, 242, 255, 0.3)",
                },
            },
        },

        Button: {
            styles: {
                root: {
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.15em",
                    clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    transition: "all 0.2s ease",
                },
            },
        },

        Card: {
            defaultProps: {
                bg: "dark.8",
            },
            styles: {
                root: {
                    border: "1px solid rgba(0, 242, 255, 0.15)",
                    boxShadow: "0 0 15px rgba(0, 242, 255, 0.1)",
                },
            },
        },

        ActionIcon: {
            styles: {
                root: {
                    transition: "all 0.2s ease",
                    "&:hover": {
                        boxShadow: "0 0 15px rgba(0, 242, 255, 0.5)",
                    },
                },
            },
        },

        Tooltip: {
            styles: {
                tooltip: {
                    backgroundColor: "#0a0a0a",
                    color: "#00f2ff",
                    border: "1px solid rgba(0, 242, 255, 0.5)",
                    fontFamily: "'Chakra Petch', sans-serif",
                },
            },
        },
    },
});
