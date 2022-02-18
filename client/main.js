import { Meteor } from "meteor/meteor";
import App from "../imports/App.svelte";
import { contentMethods } from "../imports/content/contentApi";
import { subjectMethods } from "../imports/subject/subjectApi";

Meteor.startup(() => {
  new App({
    target: document.getElementById("app"),
  });
});

Meteor.methods({
  ...contentMethods,
  ...subjectMethods,
});
