const { defineConfig, presetIcons, presetUno } = require("unocss");
const presetWebFonts = require("@unocss/preset-web-fonts").default;

export default defineConfig({
  theme: {
    breakpoints: {
      xss: "320px",
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.4,
      prefix: "i-",
      extraProperties: {
        display: "inline-block",
      },
      warn: true,
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        "roboto-condensed": "Roboto Condensed",
      },
    }),
  ],
});
