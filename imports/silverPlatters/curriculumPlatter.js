import { makePlatter } from "./makePlatter";
import { router } from "tinro";
import { callMethod } from "../helpers";
import groupBy from "lodash/groupBy";
import { Tracker } from "meteor/tracker";
import { CurriculumsCollection } from "../curriculum/curriculumApi";
import { SubjectsCollection } from "../subject/subjectApi";

export const curriculumPlatter = makePlatter(({ update }) => {
  const meta = router.meta();

  Meteor.subscribe("curriculums");
  Meteor.subscribe("subjects");

  // https://docs.meteor.com/api/tracker.html
  Tracker.autorun(() => {
    const curriculum = CurriculumsCollection.findOne({ slug: meta.params.curriculumSlug });
    const rootSubjects = SubjectsCollection.find({ _id: { $in: curriculum?.rootSubjectsIds || [] } }).fetch();
    const groupOrder = Array.from(
      new Set([
        ...(curriculum?.groupOrder || []),
        ...(rootSubjects?.map(({ group }) => group) || []),
      ])
    )
    const rootSubjectsByGroup = groupBy(rootSubjects, "group");

    update((currentState) => ({
      ...currentState,
      loading: !curriculum,
      curriculum,
      curriculumSlug: meta.params.curriculumSlug,
      rootSubjectsByGroup,
      groupOrder,
      selectedGroup:
        groupOrder?.find((groupName) => rootSubjectsByGroup[groupName]?.length)
    }));
  });

  return {
    selectGroup: groupName =>
      update(currentState => ({ ...currentState, selectedGroup: groupName })),

    // Subject
    saveSubject: (subject) => callMethod("subjects.save", subject),

    // Curriculum
    addSubjectToCurriculum: (curriculumId, subjectId) =>
      callMethod("curriculums.addSubject", curriculumId, subjectId),
  }
}, { rootSubjects: [] });

