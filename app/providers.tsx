"use client";

import { ThemeProvider } from "next-themes";

/*
  attribute="data-theme" (not "class") because the palettes in base.css key off
  [data-theme]. `system` stamps nothing at all, which is why :root must carry a
  complete light palette and the dark media query is guarded with
  :not([data-theme="light"]).

  defaultTheme is "dark", not "system": the hero is a window onto a dark 3D world,
  so dark is the intended first impression. System and light remain available in
  the switch, and an explicit choice is remembered.

  disableTransitionOnChange stops every themed element animating its colour when
  the user flips the switch — on a page this size that reads as a lurch.
*/
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
}
