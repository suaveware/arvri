import { Mongo } from "meteor/mongo";
import slugify from "slugify";
import { CurriculumsCollection } from "../curriculum/curriculumApi";

export const makeSubject = ({
  _id = "",
  slug = "",
  title = "",
  description = "",
  group = "",
  children = [],
  dependencies = [],
} = {}) => ({
  _id,
  slug: slug || slugify(title, { lower: true }),
  title,
  description,
  group,
  children,
  dependencies,
});

export const SubjectsCollection = new Mongo.Collection("subjects", {
  transform: makeSubject,
});

if (Meteor.isServer) {
  Meteor.publish("subjects", () => {
    const cursor = SubjectsCollection.find({});

    return cursor;
  });
}

export const subjectMethods = {
  ["subjects.save"](subject) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    const { _id, ...fields } = subject;

    // This is the job for a schema. I'll add in the future but not for this
    // hackaton.
    const errors = {};

    if (!subject.title) {
      errors.title = "You can't create a subject without a title";
    }

    if (Object.keys(errors).length) {
      throw new Meteor.Error(
        "invalid-subject",
        "The provided content object is invalid.",
        { errors }
      );
    }

    if (_id) {
      return SubjectsCollection.update(_id, {
        $set: fields,
      });
    }

    const subjectId = SubjectsCollection.insert(fields);

    return subjectId;
  },
  ["subjects.addSubjectChild"](subjectId, childId) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    return SubjectsCollection.update(subjectId, {
      $addToSet: { children: childId },
    });
  },
  ["subjects.reorderChildren"](subjectId, newOrder) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    return SubjectsCollection.update(subjectId, {
      $set: { children: newOrder },
    });
  },
  ["subjects.remove"](subjectId) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    const parentSubjects = SubjectsCollection.find(
      { children: subjectId },
      { fields: { _id: 1 } }
    ).fetch();
    const parentCurriculums = CurriculumsCollection.find(
      { rootSubjects: subjectId },
      { fields: { _id: 1 } }
    ).fetch();
    const parentSubjectsIds = parentSubjects.map(({ _id }) => _id);
    const parentCurriculumsIds = parentCurriculums.map(({ _id }) => _id);

    SubjectsCollection.update(
      { _id: { $in: parentSubjectsIds } },
      { $pull: { children: subjectId } },
      { multi: true }
    );
    CurriculumsCollection.update(
      { _id: { $in: parentCurriculumsIds } },
      { $pull: { rootSubjects: subjectId } },
      { multi: true }
    );

    return SubjectsCollection.remove(subjectId);
  },
  ["subjects.addToGroup"](subjectId, groupName) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    return SubjectsCollection.update(subjectId, {
      $addToSet: { groups: groupName },
    });
  },
  ["subjects.removeFromGroup"](subjectId, groupName) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    return SubjectsCollection.update(subjectId, {
      $pull: { groups: groupName },
    });
  },
};
