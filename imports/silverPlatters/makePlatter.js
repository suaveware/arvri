import { writable } from "svelte/store";
import { router } from "tinro";

const makeState = ({
  alerts = [],
  loading = true,
} = {}) => ({
  alerts,
  loading,
});

// This constructs a platter function that has to be called inside a svelte
// component initialization (in the root indentation of a <script> tag).
// Platter functions serve the state in a silver plattter.
export const makePlatter = (builder) => {
  const { subscribe, set, update } = writable(makeState());

  // Log the state to the console everytime it changes in development
  if (Meteor.isDevelopment) {
    subscribe((...args) => console.info("STATE", ...args));
  }

  return () => {
    const meta = router.meta();

    return {
      subscribe,
      set,
      update,

      // General actions
      addAlert: ({ message, state, duration = 5000, dismissable = true }) => {
        const newAlert = { message, state, duration, dismissable };
        const closeAlert = () =>
          update((currentState) => ({
            ...currentState,
            alerts: currentState.alerts.filter((alert) => alert !== newAlert),
          }));
        newAlert.closeAlert = closeAlert;

        // Add alert
        update((currentState) => ({
          ...currentState,
          alerts: [...currentState.alerts, newAlert],
        }));

        // Delete it after duration
        setTimeout(() => closeAlert(), duration);

        return newAlert;
      },

      // The builder function can modify the state with update, set and add 
      // more methods to the platter
      ...(builder?.({ subscribe, set, update, router, meta }) || {}),
    }
  }
}

