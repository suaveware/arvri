import { Meteor } from "meteor/meteor";
import App from "../imports/App.svelte";
import { contentMethods } from "../imports/entities/content/contentApi";
import { subjectMethods } from "../imports/entities/subject/subjectApi";

Meteor.startup(() => {
  new App({
    target: document.getElementById("app"),
  });
});

Meteor.methods({
  ...contentMethods,
  ...subjectMethods,
});
