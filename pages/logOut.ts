import { expect, Locator, Page } from "@playwright/test";
export default class LogOut {
  Page: Page;
  userProfile: Locator;
  loginForm: Locator;
  signOutButton: Locator;

  constructor(page: Page) {
    this.Page = page;
    this.userProfile = this.Page.locator('[class*="ml-auto"]');
    this.loginForm = this.Page.locator(".bg-white").first();
    this.signOutButton = this.Page.getByText("Sign Out");
  }

  /**
   * Click on the user profile and then click on the sign out button
   */
  
  async logOutTheUser() {
    await this.userProfile.isVisible();
    await this.userProfile.click();
    await this.signOutButton.isVisible();
    await this.signOutButton.click();
  }

  /**
   * Verify the user is logged out
   */

  async verifyUserIsLoggedOut() {
    await this.loginForm.isVisible();
  }
}
