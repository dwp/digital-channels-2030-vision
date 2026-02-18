const actions = require("./services.json");

const grouped = actions.reduce((byProduct, action) => {
  if (!Array.isArray(action.productIds)) {
    return byProduct;
  }

  action.productIds.forEach((productId) => {
    if (!byProduct[productId]) {
      byProduct[productId] = new Set();
    }
    byProduct[productId].add(action.id);
  });

  return byProduct;
}, {});

module.exports = Object.fromEntries(
  Object.entries(grouped).map(([productId, actionIds]) => [
    productId,
    Array.from(actionIds),
  ]),
);
