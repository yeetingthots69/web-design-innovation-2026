import type {Metadata} from "next";
import {Chakra_Petch} from "next/font/google";
import {MantineProvider, ColorSchemeScript} from "@mantine/core";
import {theme} from "@/theme";

// Import Mantine core styles
import "@mantine/core/styles.css";
import "./globals.css";

// Chakra Petch font - tech look with Vietnamese support
const chakraPetch = Chakra_Petch({
    variable: "--font-chakra",
    subsets: ["latin", "vietnamese"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

// Be Vietnam Pro font
// const beVietnamPro = Be_Vietnam_Pro({
//     variable: "--font-vietnam",
//     subsets: ["latin", "vietnamese"],
//     weight: ["300", "400", "500", "600", "700"],
//     display: "swap",
// });

export const metadata: Metadata = {
    title: "Geomancer | The Harmony Architect",
    description:
        "Trò chơi xếp hình 3D dựa trên triết lý Ngũ Hành của Việt Nam, tái hiện trong phong cách Cyberpunk.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="vi"
            className={chakraPetch.variable}
            suppressHydrationWarning
        >
        <head>
            <ColorSchemeScript forceColorScheme="dark"/>
        </head>
        <body>
        <MantineProvider theme={theme} forceColorScheme="dark">
            {children}
        </MantineProvider>
        </body>
        </html>
    );
}
