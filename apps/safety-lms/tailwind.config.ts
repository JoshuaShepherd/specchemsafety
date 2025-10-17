import type { Config } from "tailwindcss";
import {
  colors,
  spacing,
  layoutSpacing,
  borderRadius,
  shadows,
  breakpoints,
  typography,
  motionTokens,
  componentTokens,
  layoutTokens,
} from "./src/lib/design-tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SpecChem Brand Colors
        primary: colors.primary.blue,
        secondary: colors.primary.yellow,
        tertiary: colors.primary.tertiary,
        semantic: colors.semantic,
        neutral: colors.neutral,

        // shadcn/ui colors (for compatibility)
        border: "#e5e7eb", // Neutral gray borders instead of yellow
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Chart Colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      // Spacing scale from design tokens
      spacing: {
        ...spacing,
        // Layout spacing utilities
        "component-tight": layoutSpacing.component.tight,
        "component-normal": layoutSpacing.component.normal,
        "component-relaxed": layoutSpacing.component.relaxed,
        "component-loose": layoutSpacing.component.loose,
        "section-tight": layoutSpacing.section.tight,
        "section-normal": layoutSpacing.section.normal,
        "section-relaxed": layoutSpacing.section.relaxed,
        "section-loose": layoutSpacing.section.loose,
      },

      // Typography from design tokens
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,

      // Border radius from design tokens
      borderRadius: borderRadius,

      // Shadows from design tokens
      boxShadow: shadows,

      // Breakpoints from design tokens
      screens: breakpoints,

      // Animation from motion tokens
      transitionDuration: motionTokens.duration,
      transitionTimingFunction: motionTokens.easing,

      // Custom utilities for modern LMS components
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },

      // Custom utilities for layout spacing
      gap: {
        ...spacing,
        "stack-tight": layoutTokens.stack.gap.tight,
        "stack-normal": layoutTokens.stack.gap.normal,
        "stack-relaxed": layoutTokens.stack.gap.relaxed,
        "stack-loose": layoutTokens.stack.gap.loose,
        "inline-tight": layoutTokens.inline.gap.tight,
        "inline-normal": layoutTokens.inline.gap.normal,
        "inline-relaxed": layoutTokens.inline.gap.relaxed,
        "inline-loose": layoutTokens.inline.gap.loose,
        "grid-tight": layoutTokens.grid.gap.tight,
        "grid-normal": layoutTokens.grid.gap.normal,
        "grid-relaxed": layoutTokens.grid.gap.relaxed,
        "grid-loose": layoutTokens.grid.gap.loose,
      },

      // Container configuration
      container: {
        center: true,
        padding: {
          DEFAULT: layoutTokens.container.padding.mobile,
          sm: layoutTokens.container.padding.tablet,
          lg: layoutTokens.container.padding.desktop,
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
    },
  },
  plugins: [],
};

export default config;
