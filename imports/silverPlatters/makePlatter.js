import { writable } from "svelte/store";
import { Tracker } from "meteor/tracker";
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
export const makePlatter = (builder, defaultState = {}) => {
  return (...builderArgs) => {
    const { subscribe, set, update } = writable({ ...makeState(), ...defaultState });
    const meta = router.meta();

    // Log the state to the console everytime it changes in development
    if (Meteor.isDevelopment && Meteor.isClient) {
      Window.logState = () => subscribe((...args) => console.info("STATE", ...args));
    }

    Tracker.autorun(() => {
      const user = Meteor.user({ fields: { username: 1, isAdmin: 1 } });
      const userId = Meteor.userId();

      update((currentState) => ({
        ...currentState,
        user,
        userId,
      }));
    });


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
      ...(builder?.({ subscribe, set, update, router, meta }, ...builderArgs) || {}),
    }
  }
}

