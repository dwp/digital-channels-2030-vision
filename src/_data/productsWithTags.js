const products = require("./products.json");

const buildTags = (tagsByService) => {
  if (!tagsByService) return [];

  const tagMap = new Map();

  Object.entries(tagsByService).forEach(([actionId, tags]) => {
    if (!Array.isArray(tags)) return;
    tags.forEach((tag) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, new Set());
      }
      tagMap.get(tag).add(actionId);
    });
  });

  return Array.from(tagMap.entries()).map(([label, ids]) => ({
    label,
    actionIds: Array.from(ids),
  }));
};

module.exports = products.map((product) => ({
  ...product,
  tags: buildTags(product.tagsByService),
}));
