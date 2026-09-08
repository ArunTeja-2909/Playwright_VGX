import test from "../utils/baseTest";
import data from "../fixtures/data.json";
import dotenv from "dotenv";
dotenv.config();

test.describe("vxg cloud services application", () => {
  const url = process.env.BASE_URL as string;

  test.beforeEach(async ({ loginPage, alertsPage }) => {
    await loginPage.navigateToWebsite(url);
    await loginPage.fillUsername(data.userName);
    await loginPage.fillPassword(data.password);
    await loginPage.clickOnSignInButton();
    await alertsPage.navigateToAlertsPage();
    await alertsPage.verifyAlertsPageDataRows();
  });

  test("verify alert page content", async ({ alertsPage }) => {
    await alertsPage.verifyColumnHeaderItems(data.count);
    await alertsPage.verifySearchBarIsVisible();
    await alertsPage.verifyTableData();
    await alertsPage.verifyReviewButtonIsVisible();
  });

  test("verify column filters are applied in the alert page", async ({
    alertsPage,
  }) => {
    await alertsPage.verifyTableData();
    await alertsPage.getTheFiltersFromTheColumnAndVerify(
      data.expectedDropdownItems
    );
    await alertsPage.verifyTheAppliedFilters(data.verifyFilters);
  });

  test("verify the review popup is opened", async ({ alertsPage }) => {
    await alertsPage.verifyTableData();
    await alertsPage.verifythePreviewPopupIsVisible();
  });

  test("verify the Sites dropdown in the alert page", async ({
    alertsPage,
  }) => {
    await alertsPage.selectValueFromDropdown(data.site, data.selectSite);
    await alertsPage.extractDataFromRows();
    await alertsPage.verifyDataFromReviewPopup();
  });

  test("verify the Cameras dropdown in the alert page", async ({
    alertsPage,
  }) => {
    await alertsPage.selectValueFromDropdown(data.cameras, data.cameraName);
    await alertsPage.extractDataFromRows();
    await alertsPage.verifyDataFromReviewPopup();
  });

  test("verify the Names dropdown in the alert page", async ({
    alertsPage,
  }) => {
    await alertsPage.selectValueFromDropdown(data.name, data.nameValue);
    await alertsPage.extractDataFromRows();
    await alertsPage.verifyDataFromReviewPopup();
  });

  test("verify the Days filter in the alert page", async ({ alertsPage }) => {
    await alertsPage.selectValueFromDropdown(data.last30Days, data.last30Days);
    await alertsPage.extractDataFromRows();
    await alertsPage.verifyDataFromReviewPopup();
  });

  test.afterEach(async ({ logOut }) => {
    await logOut.logOutTheUser();
    await logOut.verifyUserIsLoggedOut();
  });
});
