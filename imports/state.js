import { writable } from "svelte/store";
import { Tracker } from "meteor/tracker";
import { SubjectsCollection } from "../imports/subject/subjectApi";
import { ContentsCollection } from "../imports/content/contentApi";
import { CurriculumsCollection } from "../imports/curriculum/curriculumApi";
import { callMethod } from "./helpers";

const makeState = ({
  user = null,
  userId = null,
  currentSubject = null,
  subjects = [],
  contents = [],
  curriculums = [],
  alerts = [],
  loading = true,
} = {}) => ({
  user,
  userId,
  currentSubject,
  subjects,
  contents,
  curriculums,
  alerts,
  loading,
});

export const state = (() => {
  const { subscribe, set, update } = writable(makeState());

  // https://docs.meteor.com/api/tracker.html
  Tracker.autorun(() => {
    const user = Meteor.user({ fields: { username: 1, isAdmin: 1 } });
    const userId = Meteor.userId();
    const subjects = SubjectsCollection.find({}).fetch();
    const contents = ContentsCollection.find({}).fetch();
    const curriculums = CurriculumsCollection.find({}).fetch();

    update((currentState) =>
      makeState({
        ...currentState,
        user,
        userId,
        subjects,
        contents,
        curriculums,
        loading: !subjects.length,
      })
    );
  });

  return {
    subscribe,
    set,
    update,

    // General
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

    // Subject
    saveSubject: (subject) => callMethod("subjects.save", subject),
    removeSubject: (subjectId) => callMethod("subjects.remove", subjectId),
    addSubjectChild: (subjectId, childId) =>
      callMethod("subjects.addSubjectChild", subjectId, childId),
    reorderChildren: (subjectId, newOrder) =>
      callMethod("subjects.reorderChildren", subjectId, newOrder),

    // Content
    saveContent: (content) => callMethod("contents.save", content),
    upvoteContent: (contentId) => callMethod("contents.upvote", contentId),

    // Curriculum
    addSubjectToCurriculum: (curriculumId, subjectId) =>
      callMethod("curriculums.addSubject", curriculumId, subjectId),

    // Account
    logout: Meteor.logout,
    loginWithPassword: Meteor.loginWithPassword,
  };
})();

if (Meteor.isClient) {
  // TODO: change subscription based on route
  // router.subscribe((data) => {
  Meteor.subscribe("subjects");
  Meteor.subscribe("contents");
  Meteor.subscribe("curriculums");
  Meteor.subscribe("user.details");

  if (Meteor.isDevelopment) {
    window.state = state;
    window.SubjectsCollection = SubjectsCollection;
    window.ContentsCollection = ContentsCollection;
    window.CurriculumsCollection = CurriculumsCollection;
    window.addAlerts = () => {
      state.addAlert({
        message: "Message for this alert",
        state: "error",
        duration: 5000,
      });
      state.addAlert({
        message: "Message for this alert",
        state: "warning",
        duration: 5000,
      });
      state.addAlert({
        message: "Message for this alert",
        state: "success",
        duration: 5000,
      });
      state.addAlert({
        message: "Message for this alert",
        state: "info",
        duration: 5000,
      });
      state.addAlert({ message: "Message for this alert", duration: 5000 });
    };
  }
}
