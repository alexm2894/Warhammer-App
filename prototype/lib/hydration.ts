// Keep server HTML and the first hydration render identical before reading device storage.
export const subscribeHydration = () => () => {};
export const clientHydrated = () => true;
export const serverHydrated = () => false;
