import { makePlatter } from "./makePlatter";

export const loginPlatter = makePlatter(({ update }) => {
  // https://docs.meteor.com/api/tracker.html
  return {
    loginWithPassword: Meteor.loginWithPassword,
  }
})

