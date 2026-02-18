const purgecss = require("@fullhuman/postcss-purgecss");
const cssnano = require("cssnano");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  plugins: isProduction
    ? [
        purgecss({
          content: [
            "./src/**/*.njk",
            "./src/**/*.html",
            "./src/**/*.js",
            "./assets/**/*.js",
          ],

          safelist: [
            "body",
            "header",
            "footer",
            "main",
            "ul",
            "li",
            "home-page",
            "outcome-page",
            "produce-page",
            "nav-wheel",
            "wheel-center",
            "wheel-label",
            "tile-content",
            "tile-icon",
            "tile-label",
            "tile-bg",
            "bg-tile-icons",
            "container",
            "product-tooltip-template",
            "product-tooltip-card",
            "product-tooltip-title",
            "product-tooltip-description",
            "tippy-box",
            "tippy-content",
            "tippy-arrow",
            "l1",
            "l2",
            "l3",
            "l4",
            "l5",
            "l6",
            "is-active--mapped",
          ],
        }),
        cssnano({ preset: "default" }),
      ]
    : [],
};
