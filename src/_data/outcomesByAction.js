const outcomes = require("./outcomes.json");

const grouped = outcomes.reduce((byAction, outcome) => {
  outcome.actionIds.forEach((actionId) => {
    if (!byAction[actionId]) {
      byAction[actionId] = new Set();
    }
    byAction[actionId].add(outcome.pillarId);
  });

  return byAction;
}, {});

module.exports = Object.fromEntries(
  Object.entries(grouped).map(([actionId, pillarIds]) => [
    actionId,
    Array.from(pillarIds),
  ]),
);
