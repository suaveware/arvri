import { makePlatter } from "./makePlatter";
import { Tracker } from "meteor/tracker";
import { CurriculumsCollection } from "../curriculum/curriculumApi"

export const homePlatter = makePlatter(({ update }) => {
  Meteor.subscribe("curriculums");

  // https://docs.meteor.com/api/tracker.html
  Tracker.autorun(() => {
    const curriculums = CurriculumsCollection.find({}).fetch();

    update((currentState) => ({
      ...currentState,
      loading: false,
      curriculums,
    }));
  });

})

