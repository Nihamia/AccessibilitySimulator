import { createGoogleStreetView } from "./googleStreetView";
import { createMapillaryView } from "./mapillaryView";

export const STREET_VIEW_PROVIDERS = {
  GOOGLE: "google",
  MAPILLARY: "mapillary",
};

export function createStreetViewManager(container) {
  let currentView = null;
  let activeProvider = null;

  async function switchProvider(provider) {
    if (provider === activeProvider && currentView) return;

    currentView?.destroy();
    currentView = null;
    container.innerHTML = "";
    activeProvider = provider;

    if (provider === STREET_VIEW_PROVIDERS.GOOGLE) {
      currentView = await createGoogleStreetView(container);
      return;
    }

    currentView = createMapillaryView(container);
  }

  return {
    switchProvider,
    getProvider() {
      return activeProvider;
    },
    destroy() {
      currentView?.destroy();
      currentView = null;
      activeProvider = null;
    },
  };
}

export function bindStreetViewProviderSelects(manager, ...selects) {
  const validSelects = selects.filter(Boolean);
  if (!validSelects.length) return;

  const syncSelects = (value) => {
    validSelects.forEach((select) => {
      if (select.value !== value) {
        select.value = value;
      }
    });
  };

  const onChange = async (event) => {
    const provider = event.target.value;
    syncSelects(provider);
    await manager.switchProvider(provider);
  };

  validSelects.forEach((select) => {
    select.addEventListener("change", onChange);
  });

  return {
    async setProvider(provider) {
      syncSelects(provider);
      await manager.switchProvider(provider);
    },
  };
}
