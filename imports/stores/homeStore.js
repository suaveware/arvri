import { CurriculumsCollection } from "../curriculum/curriculumApi";
import { Tracker } from "meteor/tracker";
import { writable } from "svelte/store";

const store = writable({});

export const makeHomeStore = () => {
  Meteor.subscribe("user.details");
  Meteor.subscribe("home");

  store.set({ loading: true });

  Tracker.autorun(() => {
    const curriculums = CurriculumsCollection.find({}).fetch();
    console.log("curriculums", curriculums);

    store.update((currentState) => ({
      ...currentState,
      loading: false,
      curriculums,
    }));
  });

  return store;
};
