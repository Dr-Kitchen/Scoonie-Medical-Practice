const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/forms");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("public");

  // Watch CSS changes
  eleventyConfig.addWatchTarget("src/assets/css/main.css");
  eleventyConfig.addWatchTarget("tailwind.config.js");

  // Date filter for news posts
  eleventyConfig.addFilter("dateFormat", function(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    });
  });

  // Readable date filter
  eleventyConfig.addFilter("readableDate", function(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    });
  });

  // Head filter — returns first N items from array
  eleventyConfig.addFilter("head", function(array, n) {
    if (!Array.isArray(array)) return array;
    return array.slice(0, n);
  });

  // CMS-managed collections
  eleventyConfig.addCollection("services", function(api) {
    return api.getFilteredByGlob("src/content/services/*.md")
      .filter(item => item.data.active !== false)
      .sort((a, b) => (a.data.sort_order || 10) - (b.data.sort_order || 10));
  });

  eleventyConfig.addCollection("staff", function(api) {
    return api.getFilteredByGlob("src/content/staff/*.md")
      .filter(item => item.data.active !== false)
      .sort((a, b) => (a.data.sort_order || 10) - (b.data.sort_order || 10));
  });

  eleventyConfig.addCollection("news", function(api) {
    return api.getFilteredByGlob("src/content/news/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  eleventyConfig.addCollection("alerts", function(api) {
    return api.getFilteredByGlob("src/content/alerts/*.md");
  });

  eleventyConfig.addCollection("campaigns", function(api) {
    return api.getFilteredByGlob("src/content/campaigns/*.md")
      .filter(item => {
        if (item.data.active === false) return false;
        const now = new Date();
        if (item.data.start_date && new Date(item.data.start_date) > now) return false;
        if (item.data.end_date && new Date(item.data.end_date) < now) return false;
        return true;
      });
  });

  // Filter: returns only currently active alerts, respecting optional date range
  eleventyConfig.addFilter("activeAlerts", function(alerts) {
    const now = new Date();
    return (alerts || []).filter(alert => {
      if (alert.data.active === false) return false;
      if (alert.data.start_date && new Date(alert.data.start_date) > now) return false;
      if (alert.data.end_date && new Date(alert.data.end_date) < now) return false;
      return true;
    });
  });

  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
