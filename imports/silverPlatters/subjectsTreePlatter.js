import { makePlatter } from "./makePlatter";
import { router } from "tinro";
import { Tracker } from "meteor/tracker";
import { SubjectsCollection } from "../entities/subject/subjectApi";
import { CurriculumsCollection } from "../entities/curriculum/curriculumApi";
import { ContentsCollection } from "../entities/content/contentApi";
import { callMethod } from "../helpers";

// This has to be outside, otherwise we'll have a stale closure
// https://dilshankelsen.com/understanding-stale-closures-in-javascript/
let meta;
export const subjectsTreePlatter = makePlatter(
  ({ update }) => {
    meta = router.meta();

    Meteor.subscribe("page.subjectsTree", {
      curriculumSlug: meta.params.curriculumSlug,
      subjectSlug: meta.params.subjectSlug,
    });

    const refreshState = () => {
      const subject = SubjectsCollection.findOne({
        slug: meta.params.subjectSlug,
      });
      const curriculum = CurriculumsCollection.findOne({
        slug: meta.params.curriculumSlug,
      });
      const subjectContents = ContentsCollection.find({
        subjectId: subject?._id,
      }).fetch();
      const childrenSubjects = SubjectsCollection.find({
        _id: { $in: subject?.childrenIds || [] },
      }).fetch();

      update((currentState) => ({
        ...currentState,
        loading: !subject,
        subject,
        curriculum,
        curriculumSlug: meta.params.curriculumSlug,
        subjectSlug: meta.params.subjectSlug,
        breadcrumbs: meta.breadcrumbs,
        urlMatch: meta.match,
        subjectContents,
        childrenSubjects,
      }));
    };

    // React to database change and also to navigation
    // https://github.com/AlexxNB/tinro#route-meta
    Tracker.autorun(refreshState);
    meta.subscribe((newMeta) => {
      meta = newMeta || meta;

      refreshState();
    });

    return {
      // Content
      saveContent: (content) => callMethod("contents.save", content),
      upvoteContent: (contentId) => callMethod("contents.upvote", contentId),

      // Subject
      saveSubject: (subject) => callMethod("subjects.save", subject),
      removeSubject: (subjectId) => callMethod("subjects.remove", subjectId),
      reorderChildren: (subjectId, newOrder) =>
        callMethod("subjects.reorderChildren", subjectId, newOrder),
      addSubjectChild: (subjectId, childId) =>
        callMethod("subjects.addSubjectChild", subjectId, childId),

      // Curriculum
      addSubjectToCurriculum: (curriculumId, subjectId) =>
        callMethod("curriculums.addSubject", curriculumId, subjectId),
    };
  },
  { childrenSubjects: [], breadcrumbs: [] }
);
