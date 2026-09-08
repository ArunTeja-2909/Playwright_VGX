import { expect } from "@playwright/test";
import { Locator, Page } from "playwright";

export default class Login {
  Page: Page;
  logo: Locator;
  username: Locator;
  password: Locator;
  signIn: Locator;
  monitoring: Locator;

  constructor(page: Page) {
    this.Page = page;
    this.logo = this.Page.locator(".bg-white");
    this.username = this.Page.getByLabel("Email");
    this.password = this.Page.getByLabel("password");
    this.signIn = this.Page.getByRole("button", { name: "Sign In" });
    this.monitoring = this.Page.locator('//*[text()="Monitoring"]');
  }

  /**
   * launch the url and verifying the website logo
   */

  async navigateToWebsite(url: string) {
    await this.Page.goto(url);
    await this.Page.waitForLoadState("domcontentloaded");
    await this.logo.waitFor({ state: "visible" });
  }

  /**
   * entering the username
   */

  async fillUsername(username: string) {
    expect(this.username).toBeVisible();
    await this.username.fill(username);
  }

  /**
   * entering the password
   */

  async fillPassword(password: string) {
    expect(this.password).toBeVisible();
    await this.password.fill(password);
  }

  /**
   * Click on the sign in button and verifying the user login
   */

  async clickOnSignInButton() {
    expect(this.signIn).toBeVisible();
    await this.signIn.click();
    await this.monitoring.waitFor({ state: "visible" });
  }
}
