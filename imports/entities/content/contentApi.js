import { Mongo } from "meteor/mongo";
import { isValidUrl } from "../../helpers";

export const makeContent = ({
  _id,
  title = "",
  description = "",
  url = "",
  upvotedBy = [],
  rating = 0,
  subjectId = "",
} = {}) => ({
  ...(_id ? { _id } : {}),
  title,
  description,
  url,
  upvotedBy,
  rating,
  subjectId,
});

export const ContentsCollection = new Mongo.Collection("contents", {
  transform: makeContent,
});

if (Meteor.isServer) {
  Meteor.publish("contents", () => {
    const cursor = ContentsCollection.find({});

    return cursor;
  });
}

export const contentMethods = {
  ["contents.save"](content) {
    if (!this.userId) {
      throw new Meteor.Error(
        "account-required",
        "An account is required to add more content."
      );
      return;
    }

    const { _id, ...fields } = content;

    // This is the job for a schema. I'll add in the future but not for this
    // hackaton.
    const errors = {};

    if (!content.title) {
      errors.title = "You can't create a subject without a title";
    }

    if (!content.url) {
      errors.url = "You can't create a subject without a url";
    }

    if (!errors.url && !isValidUrl(content.url)) {
      errors.url = "This is not a valid url";
    }

    if (Object.keys(errors).length) {
      throw new Meteor.Error(
        "invalid-content",
        "The provided content object is invalid.",
        { errors }
      );
    }

    if (_id) {
      ContentsCollection.update(_id, { $set: fields });
      return;
    }

    return ContentsCollection.insert(fields);
  },
  ["contents.upvote"](contentId) {
    if (!this.userId) {
      throw new Meteor.Error(
        "account-required",
        "An account is required to upvote content."
      );
    }

    const { upvotedBy } = ContentsCollection.findOne(contentId, {
      fields: { upvotedBy: 1 },
    });

    if (upvotedBy.find((userId) => userId === this.userId)) {
      return ContentsCollection.update(contentId, {
        $pull: { upvotedBy: this.userId },
      });
    }

    return ContentsCollection.update(contentId, {
      $addToSet: { upvotedBy: this.userId },
    });
  },
};
