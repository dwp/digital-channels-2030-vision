const setVisibleProductTagsIn = (root, actionIds) => {
  if (!root) return false;
  const actionSet = new Set(actionIds);
  const tags = root.querySelectorAll(
    ".product-tag[data-action-id], .product-tag[data-action-ids]",
  );
  if (!tags.length) return false;

  let hasVisible = false;
  tags.forEach((tag) => {
    const ids = (tag.dataset.actionIds || tag.dataset.actionId || "")
      .split(",")
      .filter(Boolean);
    const isActive = ids.some((id) => actionSet.has(id));
    tag.hidden = !isActive;
    if (isActive) hasVisible = true;
  });

  const container = root.querySelector(".product-tags");
  if (container) {
    container.hidden = !hasVisible;
  }

  return hasVisible;
};

const setVisibleProductTags = (tiles, actionIds) => {
  if (!tiles || !tiles.length) return;
  tiles.forEach((tile) => {
    setVisibleProductTagsIn(tile, actionIds);
  });
};

// Product tiles onclick active state
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".products-grid");
  if (!grid || !document.body.classList.contains("product-page")) return;
  const serviceButtons = document.querySelectorAll(
    ".services-list button[data-action-id], .activity-list button[data-action-id]",
  );
  const wheelLabels = document.querySelectorAll(
    ".nav-wheel .wheel-label[data-pillar-id]",
  );
  const fixedTooltip =
    typeof tippy === "function"
      ? tippy(grid, {
          trigger: "manual",
          allowHTML: true,
          interactive: true,
          theme: "product",
          maxWidth: 400,
          appendTo: () => grid,
          offset: [0, 115],
          placement: "auto",
          onShow(instance) {
            const activeButton = document.querySelector(
              ".services-list button.is-active, .activity-list button.is-active",
            );
            const actionIds = activeButton
              ? [activeButton.dataset.actionId].filter(Boolean)
              : (instance.reference.dataset.actionIds || "")
                  .split(",")
                  .filter(Boolean);

            setVisibleProductTagsIn(instance.popper, actionIds);

            const popper = instance.popper;
            if (!popper || popper.dataset.closeBound === "true") return;

            popper.dataset.closeBound = "true";
            popper.addEventListener("click", (event) => {
              const closeButton = event.target.closest("[data-tooltip-close]");
              if (closeButton) {
                instance.hide();
              }
            });
          },
          onHide(instance) {
            const tiles = grid.querySelectorAll("li.active");
            tiles.forEach((tile) => {
              tile.setAttribute("aria-expanded", "false");
              tile.classList.remove("active");
            });
          },
        })
      : null;

  const setActivePillars = (pillarIds) => {
    if (!wheelLabels.length) return;
    const pillarSet = new Set(pillarIds);

    wheelLabels.forEach((label) => {
      const isActive = pillarSet.has(label.dataset.pillarId);
      label.classList.toggle("active", isActive);
    });
  };

  const setActiveButtons = (actionIds) => {
    if (!serviceButtons.length) return;
    const actionSet = new Set(actionIds);
    const pillarSet = new Set();

    serviceButtons.forEach((button) => {
      const isActive = actionSet.has(button.dataset.actionId);
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");

      if (isActive) {
        const pillarIds = (button.dataset.pillarIds || "")
          .split(",")
          .filter(Boolean);
        pillarIds.forEach((pillarId) => pillarSet.add(pillarId));
      }
    });

    setActivePillars(Array.from(pillarSet));
  };

  grid.addEventListener("click", (event) => {
    const tile = event.target.closest("li");
    if (!tile || !grid.contains(tile)) return;

    grid.querySelectorAll("li.active").forEach((activeTile) => {
      if (activeTile !== tile) {
        activeTile.classList.remove("active");
        activeTile.setAttribute("aria-expanded", "false");
      }
    });

    tile.classList.add("active");
    tile.setAttribute("aria-expanded", "true");

    const actionIds = (tile.dataset.actionIds || "").split(",").filter(Boolean);
    setActiveButtons(actionIds);
    setVisibleProductTags(grid.querySelectorAll("li"), actionIds);

    if (fixedTooltip) {
      const instance = Array.isArray(fixedTooltip)
        ? fixedTooltip[0]
        : fixedTooltip;
      const template = tile.querySelector(".product-tooltip-template");
      if (template && instance) {
        instance.reference.dataset.actionIds = actionIds.join(",");
        instance.setContent(template.innerHTML);
        instance.show();
      }
    }
  });
});

// Outcome tabs
document.addEventListener("DOMContentLoaded", () => {
  const navs = document.querySelectorAll(".outcome-nav");
  if (!navs.length) return;

  navs.forEach((nav) => {
    const buttons = nav.querySelectorAll("button[data-outcome-id]");
    const descriptions = nav.parentElement?.querySelectorAll(
      ".outcome-descriptions [data-outcome-id]",
    );
    const serviceLabels = document.querySelectorAll(".service-label");
    const grid = nav.closest("body")?.querySelector(".products-grid");
    const tiles = grid?.querySelectorAll("li[data-product-id]");

    if (!buttons.length || !descriptions?.length) return;

    const setDisabledServiceLabels = (activityIds) => {
      if (!serviceLabels.length) return;
      if (!activityIds?.length) {
        serviceLabels.forEach((button) => {
          button.disabled = false;
          button.setAttribute("aria-disabled", "false");
        });
        return;
      }

      const activitySet = new Set(activityIds);

      serviceLabels.forEach((button) => {
        const actionId = button.dataset.actionId;
        const isMatch = actionId ? activitySet.has(actionId) : false;

        button.disabled = !isMatch;
        button.setAttribute("aria-disabled", isMatch ? "false" : "true");
        if (!isMatch) {
          button.classList.remove("is-active");
          button.setAttribute("aria-pressed", "false");
        }
      });
    };

    const setActive = (button) => {
      const outcomeId = button.dataset.outcomeId;
      const activityIds = (button.dataset.activityIds || "")
        .split(",")
        .filter(Boolean);
      const productIds = (button.dataset.productIds || "")
        .split(",")
        .filter(Boolean);
      const productSet = new Set(productIds);

      buttons.forEach((button) => {
        const isActive = button.dataset.outcomeId === outcomeId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      descriptions.forEach((description) => {
        description.hidden = description.dataset.outcomeId !== outcomeId;
      });

      setDisabledServiceLabels(activityIds);

      // tiles?.forEach((tile) => {
      //   const isActive = productSet.has(tile.dataset.productId);
      //   tile.classList.toggle("active", isActive);
      // });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        setActive(button);
      });
    });

    const initialButton = nav.querySelector("button.is-active") || buttons[0];
    if (initialButton) setActive(initialButton);
  });
});

// Service labels tooltips
document.addEventListener("DOMContentLoaded", () => {
  const tooltipTargets = document.querySelectorAll(
    ".service-label[data-tippy-content]",
  );
  if (!tooltipTargets.length) return;
  if (typeof tippy !== "function") return;

  tippy(tooltipTargets, {
    placement: "top",
    allowHTML: false,
  });
});

// Product tiles tooltips
document.addEventListener("DOMContentLoaded", () => {
  const tiles = document.querySelectorAll(".products-grid li");
  if (!tiles.length) return;
  if (typeof tippy !== "function") return;
  if (document.body.classList.contains("product-page")) return;

  tiles.forEach((tile) => {
    tile.setAttribute("aria-expanded", "false");
  });

  tippy(tiles, {
    trigger: "click",
    allowHTML: true,
    interactive: true,
    theme: "product",
    maxWidth: 400,
    offset: [0, 12],
    placement: "auto",
    content: (reference) => {
      const template = reference.querySelector(".product-tooltip-template");
      return template ? template.innerHTML : "";
    },
    onShow(instance) {
      instance.reference.setAttribute("aria-expanded", "true");

      const activeButton = document.querySelector(
        ".services-list button.is-active, .activity-list button.is-active",
      );
      const actionIds = activeButton
        ? [activeButton.dataset.actionId].filter(Boolean)
        : (instance.reference.dataset.actionIds || "")
            .split(",")
            .filter(Boolean);

      setVisibleProductTagsIn(instance.popper, actionIds);

      // Close tooltip button
      const popper = instance.popper;
      if (!popper || popper.dataset.closeBound === "true") return;

      popper.dataset.closeBound = "true";
      popper.addEventListener("click", (event) => {
        const closeButton = event.target.closest("[data-tooltip-close]");
        if (closeButton) {
          instance.hide();
        }
      });
    },
    onHide(instance) {
      instance.reference.setAttribute("aria-expanded", "false");
    },
    popperOptions: {
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: ["right", "left", "top", "bottom"],
          },
        },
      ],
    },
  });
});

// Service and activity filters
document.addEventListener("DOMContentLoaded", () => {
  const lists = document.querySelectorAll(".services-list, .activity-list");
  if (!lists.length) return;

  const isOutcomePage = document.body.classList.contains("outcome-page");
  const buttons = document.querySelectorAll(
    ".services-list button, .activity-list button",
  );
  const activityButtons = Array.from(
    document.querySelectorAll(".activity-list button[data-action-id]"),
  );
  const activityButtonsById = new Map(
    activityButtons.map((button) => [button.dataset.actionId, button]),
  );
  const grid = document.querySelector(".products-grid");
  const tiles = grid?.querySelectorAll("li[data-product-id]") || [];
  const wheelLabels = document.querySelectorAll(
    ".nav-wheel .wheel-label[data-pillar-id]",
  );

  const setActivePillars = (pillarIds) => {
    if (!wheelLabels.length) return;
    const pillarSet = new Set(pillarIds);

    wheelLabels.forEach((label) => {
      const isActive = pillarSet.has(label.dataset.pillarId);
      label.classList.toggle("active", isActive);
    });
  };

  // services to activities mapping
  const setMappedActivities = (activeButton) => {
    if (!isOutcomePage || !activityButtons.length) return;

    activityButtons.forEach((button) => {
      button.classList.remove("is-active--mapped");
    });

    if (!activeButton?.closest(".services-list")) return;
    const activityIds = (activeButton.dataset.activityIds || "")
      .split(",")
      .filter(Boolean);

    activityIds.forEach((activityId) => {
      const mappedButton = activityButtonsById.get(activityId);
      if (mappedButton) mappedButton.classList.add("is-active--mapped");
    });
  };

  const setActive = (activeButton) => {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    setMappedActivities(activeButton);

    const pillarIds = (activeButton?.dataset.pillarIds || "")
      .split(",")
      .filter(Boolean);
    if (pillarIds.length) {
      setActivePillars(pillarIds);
    }

    if (!tiles.length) return;
    const productIds = (activeButton?.dataset.productIds || "")
      .split(",")
      .filter(Boolean);
    const productSet = new Set(productIds);

    tiles.forEach((tile) => {
      const isActive = productSet.has(tile.dataset.productId);
      tile.classList.toggle("active", isActive);
    });

    setVisibleProductTags(
      tiles,
      [activeButton?.dataset.actionId].filter(Boolean),
    );
  };

  lists.forEach((list) => {
    list.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || !list.contains(button)) return;
      setActive(button);
    });
  });

  const initialButton = Array.from(buttons).find((button) =>
    button.classList.contains("is-active"),
  );
  if (initialButton) {
    setActive(initialButton);
  } else {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
    });
  }
});

// View selector
document.addEventListener("DOMContentLoaded", () => {
  const selector = document.querySelector(".view-selector");
  if (!selector) return;

  selector.addEventListener("change", (event) => {
    const value = event.target.value;
    if (!value) return;
    window.location.assign(value);
  });
});
