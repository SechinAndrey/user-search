const { defineConfig, presetIcons, presetUno } = require("unocss");
const presetWebFonts = require("@unocss/preset-web-fonts").default;

export default defineConfig({
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
