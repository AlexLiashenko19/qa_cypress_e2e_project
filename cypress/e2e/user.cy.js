/// <reference types='cypress' />
/// <reference types='../support' />

import SignInPageObject from '../support/pages/signIn.pageObject';

const signInPage = new SignInPageObject();

describe('User', () => {
  let userTarget;
  let userFollower;

  before(() => {
    cy.task('db:clear');
    return cy.task('generateUser').then((generatedUser) => {
      userTarget = { ...generatedUser };
      return cy.register(
        userTarget.email,
        userTarget.username,
        userTarget.password
      ).then(() => {
        userFollower = {
          email: generatedUser.email + 'world',
          username: generatedUser.username + 'follower',
          password: generatedUser.password
        };
        return cy.register(
          userFollower.email,
          userFollower.username,
          userFollower.password
        );
      });
    });
  });

  it('should be able to follow the another user', () => {
    signInPage.visit();

    signInPage.typeEmail(userFollower.email);
    signInPage.typePassword(userFollower.password);

    signInPage.clickSignInBtn();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.visit(`/#/@${userTarget.username.replace('follower', '')}`);

    cy.contains('button', `Follow ${userTarget.username.replace('follower', '')}`).click();
  });
});
