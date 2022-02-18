import { makePlatter } from "./makePlatter";
import { Tracker } from "meteor/tracker";
import { SubjectsCollection } from "../subject/subjectApi";

export const subjectsTreePlatter = makePlatter(({ update }) => {

  // https://docs.meteor.com/api/tracker.html
  Tracker.autorun(() => {
    const subjects = SubjectsCollection.find({}).fetch();

    console.log("subjects", subjects);

    update((currentState) => ({
      ...currentState,
      loading: false,
      subjects,
    }));
  });
})

