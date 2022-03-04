import { makePlatter } from "./makePlatter";
import { router } from "tinro";
import { Tracker } from "meteor/tracker";
import { SubjectsCollection } from "../entities/subject/subjectApi";
import { CurriculumsCollection } from "../entities/curriculum/curriculumApi";
import { ContentsCollection } from "../entities/content/contentApi";
import { callMethod } from "../helpers";
import keyBy from "lodash/keyBy";

// We want the slugs so we can build the breadcrumbs from them
const extractSubjectsSlugsAndPathsFromMatch = (metaMatch) => {
  // Remove the curriculum data which is always the first value
  // Remove current subject data which is always the last value
  const [_, ...breadcrumbsSlugsAndPaths] = metaMatch
    .split("/")
    .map((slug, index) => ({
      slug,
      path: metaMatch
        .split("/")
        .slice(0, index + 1)
        .join("/"),
    }))
    .filter(({ slug }, index, array) => slug && index < array.length - 1);
  return breadcrumbsSlugsAndPaths;
};

// This has to be outside, otherwise we'll have a stale closure
// https://dilshankelsen.com/understanding-stale-closures-in-javascript/
export const subjectPlatter = makePlatter(
  ({ update }) => {
    const meta = router.meta();
    const breadcrumbsSlugsAndPaths = extractSubjectsSlugsAndPathsFromMatch(meta.match);
    const breadcrumbsSlugs = breadcrumbsSlugsAndPaths.map(({ slug }) => slug);;

    Meteor.subscribe("page.subject", {
      curriculumSlug: meta.params.curriculumSlug,
      subjectSlug: meta.params.subjectSlug,
      breadcrumbsSlugs,
    });

    // React to database change and also to navigation
    // https://github.com/AlexxNB/tinro#route-meta
    Tracker.autorun(() => {
      const subject =
        SubjectsCollection.findOne({
          slug: meta.params.subjectSlug,
        }) || {};
      const curriculum =
        CurriculumsCollection.findOne({
          slug: meta.params.curriculumSlug,
        }) || {};
      const subjectContents = ContentsCollection.find({
        subjectId: subject?._id,
      }).fetch();
      const childrenSubjects = SubjectsCollection.find({
        _id: { $in: subject?.childrenIds || [] },
      }).fetch();

      const breadcrumbsSubjects = SubjectsCollection.find(
        { slug: { $in: breadcrumbsSlugs } },
        { fields: { title: 1, slug: 1 } }
      ).fetch();
      const subjectBySlug = keyBy(breadcrumbsSubjects, "slug");
      const breadcrumbs = [
        {
          name: "Home",
          path: `/`,
        },
        { name: curriculum?.title, path: `/${curriculum.slug}` },
        ...breadcrumbsSlugsAndPaths.map(({ slug, path }) => ({
          name: subjectBySlug[slug]?.title,
          path,
        })),
      ];

      update((currentState) => ({
        ...currentState,
        loading: !subject,
        subject,
        curriculum,
        curriculumSlug: meta.params.curriculumSlug,
        subjectSlug: meta.params.subjectSlug,
        urlMatch: meta.match,
        subjectContents,
        childrenSubjects,
        breadcrumbs,
      }));
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
  { subject: {}, curriculum: {}, childrenSubjects: [], breadcrumbs: [] }
);
