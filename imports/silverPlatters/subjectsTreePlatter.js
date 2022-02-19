import { makePlatter } from "./makePlatter";
import { Tracker } from "meteor/tracker";
import { SubjectsCollection } from "../subject/subjectApi";
import { CurriculumsCollection } from "../curriculum/curriculumApi";
import { callMethod } from "../helpers";

export const subjectsTreePlatter = makePlatter(({ update, meta }) => {
  // https://docs.meteor.com/api/tracker.html
  Tracker.autorun(() => {
    const subject = SubjectsCollection.findOne({ slug: meta.params.subjectSlug });
    const curriculum = CurriculumsCollection.findOne({ slug: meta.params.curriculumSlug });
    const subjectContents = ContentsCollection.find({ subjectId: subject?._id }).fetch();
    const childrenSubjects = SubjectsCollection.find({ _id: { $in: subject?.childrenIds || [] } }).fetch();

    update((currentState) => ({
      ...currentState,
      loading: !subject,
      subject,
      curriculum,
      curriculumSlug: meta.params.curriculumSlug,
      breadcrumbs: meta.breadcrumbs,
      subjectContents,
      childrenSubjects,
    }));
  });

  return {
    upvoteContent: (contentId) => callMethod("contents.upvote", contentId),
    reorderChildren: (subjectId, newOrder) =>
      callMethod("subjects.reorderChildren", subjectId, newOrder),
  }
}, { childrenSubjects: [], breadcrumbs: [] })

