import { Mongo } from "meteor/mongo";

export const makeCurriculum = ({
  _id,
  slug = "",
  title = "",
  description = "",
  rootSubjectsIds = [],
  groupOrder = [],
} = {}) => ({
  ...(_id ? { _id } : {}),
  slug,
  title,
  description,
  rootSubjectsIds,
  groupOrder,
});

export const CurriculumsCollection = new Mongo.Collection("curriculums", {
  transform: makeCurriculum,
});

if (Meteor.isServer) {
  Meteor.publish("curriculums", () => {
    const cursor = CurriculumsCollection.find({});

    return cursor;
  });
}

export const curriculumMethods = {
  ["curriculums.save"](curriculum) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    const { _id, ...fields } = curriculum;

    if (_id) {
      return CurriculumsCollection.update(_id, {
        $set: fields,
      });
    }

    const curriculumId = CurriculumsCollection.insert(fields);

    return curriculumId;
  },
  ["curriculums.remove"](curriculumId) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    return CurriculumsCollection.remove(curriculumId);
  },
  ["curriculums.addSubject"](curriculumId, subjectId) {
    const { isAdmin } = Meteor.user() || {};
    if (!isAdmin) {
      return;
    }

    return CurriculumsCollection.update(curriculumId, {
      $addToSet: { rootSubjectsIds: subjectId },
    });
  },
};
