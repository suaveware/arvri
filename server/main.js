import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { contentMethods } from "../imports/entities/content/contentApi";
import { subjectMethods } from "../imports/entities/subject/subjectApi";
import {
  CurriculumsCollection,
  curriculumMethods,
  makeCurriculum,
} from "../imports/entities/curriculum/curriculumApi";
import "../imports/publications"

Meteor.startup(() => {

  if (Meteor.isDevelopment) {
    const users = Meteor.users.find({}).fetch();
    if (!users.find(({ username }) => username === "admin")) {
      Accounts.createUser({
        username: "user",
        password: "user",
      });
      Accounts.createUser({
        username: "admin",
        password: "admin",
      });
      Meteor.users.update({ username: "admin" }, { $set: { isAdmin: true } });
    }
  }

  const curriculums = CurriculumsCollection.find({}).fetch();
  if (!curriculums.length) {
    CurriculumsCollection.insert(
      makeCurriculum({
        name: "Computer Science",
        slug: "computer-sciente",
        description:
          "Computer science is the study of algorithmic processes, computational machines and computation itself. As a discipline, computer science spans a range of topics from theoretical studies of algorithms, computation and information to the practical issues of implementing computational systems in hardware and software.",
      })
    );
    CurriculumsCollection.insert(
      makeCurriculum({
        name: "Arvri Documentation",
        slug: "arvri-documentation",
        description:
          "So you want to contribute to Arvri's development? This documentation was built using Arvri and bellow you'll find all the subjects you need to master so you can become an elite contributor!",
      })
    );
  }
});

Meteor.methods({
  ...contentMethods,
  ...subjectMethods,
  ...curriculumMethods,
});
