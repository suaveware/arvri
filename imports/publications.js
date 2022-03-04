import { CurriculumsCollection } from "../imports/entities/curriculum/curriculumApi";
import { SubjectsCollection } from "../imports/entities/subject/subjectApi";

Meteor.publish("user.details", () => {
  return Meteor.users.find(
    { _id: Meteor.userId() },
    { fields: { isAdmin: 1 } }
  );
});

Meteor.publish("page.home", () => {
  return CurriculumsCollection.find({});
});

Meteor.publish("page.curriculum", ({ curriculumSlug }) => {
  const curriculumCursor = CurriculumsCollection.find({
    slug: curriculumSlug,
  });
  const [curriculum] = curriculumCursor.fetch();
  const subjectsCursor = SubjectsCollection.find({
    _id: { $in: curriculum?.rootSubjectsIds || [] },
  });

  return [curriculumCursor, subjectsCursor];
});

Meteor.publish(
  "page.subject",
  ({ curriculumSlug, subjectSlug, breadcrumbsSlugs }) => {
    const curriculumCursor = CurriculumsCollection.find({
      slug: curriculumSlug,
    });
    const subjectCursor = SubjectsCollection.find(
      {
        slug: subjectSlug,
      },
      { fields: { _id: 1, childrenIds: 1 } }
    );
    const [subject] = subjectCursor.fetch();
    const subjectsCursor = SubjectsCollection.find({
      $or: [
        { _id: { $in: [subject._id, ...subject.childrenIds] } },
        { slug: { $in: breadcrumbsSlugs } },
      ],
    });

    return [curriculumCursor, subjectsCursor];
  }
);
