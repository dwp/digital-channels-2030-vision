const outcomes = require("./outcomes.json");

module.exports = outcomes.reduce((byPillar, outcome) => {
  if (!byPillar[outcome.pillarId]) {
    byPillar[outcome.pillarId] = [];
  }
  byPillar[outcome.pillarId].push(outcome);
  return byPillar;
}, {});
