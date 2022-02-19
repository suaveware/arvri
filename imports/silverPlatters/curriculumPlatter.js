import { makePlatter } from "./makePlatter";
import { Tracker } from "meteor/tracker";
import { CurriculumsCollection } from "../curriculum/curriculumApi";
import { SubjectsCollection } from "../subject/subjectApi";

export const curriculumPlatter = makePlatter(({ update, meta }) => {

  // https://docs.meteor.com/api/tracker.html
  Tracker.autorun(() => {
    const curriculum = CurriculumsCollection.findOne({ slug: meta.params.curriculumSlug });
    const rootSubjects = SubjectsCollection.find({ _id: { $in: curriculum?.rootSubjectsIds || [] } }).fetch();

    update((currentState) => ({
      ...currentState,
      loading: !!curriculum,
      curriculum,
      rootSubjects,
      curriculumSlug: meta.params.curriculumSlug
    }));
  });
}, { rootSubjects: [] });

