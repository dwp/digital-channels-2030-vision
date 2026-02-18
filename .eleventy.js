const htmlmin = require("html-minifier-terser");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: "assets", icons: "icons" });
  eleventyConfig.addWatchTarget("./src/styles/");

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        return htmlmin.minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
        });
      }

      return content;
    });
  }

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
