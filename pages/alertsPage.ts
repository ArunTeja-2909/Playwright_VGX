import { expect, Locator, Page } from "@playwright/test";
import { toZonedTime } from "date-fns-tz";
import waits from "../utils/timeOuts";
let rowTime: any, getTypeFromRow: any, getStatusFromRow: any;

export default class AlertsPage {
  Page: Page;
  sidebarAlert: Locator;
  alertBody: Locator;
  columnHeader: Locator;
  tableContent: Locator;
  tableBody: Locator;
  filtersColumn: Locator;
  listBox: Locator;
  tableHeader: Locator;
  searchBar: Locator;
  dropdowns: Locator;
  columnRow: Locator;
  reviewButton: Locator;
  reviewContent: Locator;
  siteDropdownValue: Locator;
  dropdownValue: Locator;
  noResult: Locator;
  closeButton: Locator;
  getByRole: Locator;
  alertsPageHeader: string;
  getTimeZoneFromReviewPopup: Locator;
  rows: Locator;

  constructor(page: Page) {
    this.Page = page;
    this.tableHeader = this.Page.locator('[class*="md:flex-row"]');
    this.sidebarAlert = this.Page.locator('//*[text()="Alerts"]').nth(0);
    this.alertBody = this.Page.locator(".caption-bottom");
    this.columnHeader = this.Page.locator('[class*="flex-row"] button');
    this.tableContent = this.Page.locator("thead")
      .locator("tr")
      .filter({ hasText: "Time" })
      .locator("th")
      .filter({ hasText: "Name" })
      .locator("th")
      .filter({ hasText: "Type" })
      .locator("th")
      .filter({ hasText: "Status" })
      .locator("th")
      .filter({ hasText: "Action" });
    this.tableBody = this.Page.locator("table.w-full");
    this.filtersColumn = this.Page.locator('[class="main-select"]');
    this.listBox = this.Page.locator('[role="listbox"]');
    this.searchBar = this.Page.locator('[placeholder="Enter meta tag"]');
    this.dropdowns = this.Page.locator(".main-select");
    this.columnRow = this.Page.locator('tr[class*="border-b"]');
    this.reviewButton = this.Page.locator("td button");
    this.reviewContent = this.Page.locator(
      '[class*="shadow-table"] [alt="Camera screenshoot"]'
    );
    this.siteDropdownValue = this.Page.locator(
      '[role="listbox"] > div .relative'
    );
    this.dropdownValue = this.Page.locator('[role="listbox"] [role="option"]');
    this.noResult = this.Page.locator('//*[text()="No results."]');
    this.closeButton = this.Page.locator(
      '[class*="shadow-table"] button.cursor-pointer'
    );
    this.getByRole = this.Page.getByRole("option");
    this.alertsPageHeader = '[class*="md:flex-row"]';
    this.getTimeZoneFromReviewPopup = this.Page.locator("[class*='opacity']");
    this.rows = this.Page.locator("tbody tr");
  }

  /**
   *  Navigating to the alerts page
   */

  async navigateToAlertsPage() {
    await this.sidebarAlert.isVisible();
    await this.sidebarAlert.click();
  }

  /**
   * Verifing the content table in the alerts page
   */

  async verifyAlertsPageDataRows() {
    await this.Page.waitForLoadState("networkidle");
    await this.Page.waitForSelector(this.alertsPageHeader);
    await this.alertBody.isVisible();
  }

  /**
   *  Verifying the header and dropdown elements in the alerts page
   */

  async verifyColumnHeaderItems(count: string) {
    await this.columnHeader.count();

    if ((await this.columnHeader.count()) === Number(count)) {
      for (let i = 0; i < 6; i++) {
        await this.columnHeader.nth(i).isVisible();
      }
    } else {
      console.log("Header row items are not 6");
    }
  }

  /**
   * Verifying the table coulmn values in the alerts page
   */
  async verifyTableData() {
    await this.tableContent.isVisible();
    await this.tableBody.isVisible();
  }

  /**
   * Verifying and applying the column filters in the alerts page
   */

  async verifyColumnFilters(
    expectedDropdownItems: string[],
    applyFilters: string[]
  ) {
    const nameFilter = "Name";
    const action = "Action";

    if (await this.filtersColumn.isVisible()) {
      await this.filtersColumn.click();
      await this.listBox.isVisible();

      const dropdownItemsText = await this.listBox.innerText();
      const dropdownItems = dropdownItemsText
        .split("\n")
        .map((item) => item.trim());

      expect(dropdownItems).toEqual(expectedDropdownItems);
      await this.listBox.waitFor({ state: "visible" });

      for (const item of applyFilters) {
        const option = this.listBox.getByText(item);
        if (await option.isVisible()) {
          await option.click();
          await this.listBox.isVisible();
          const filterLocator = this.Page.locator(
            `//div[text()='${item}']`
          ).nth(0);
          expect(await filterLocator.isVisible()).toBeTruthy();
          await option.click();
        } else {
          console.log(`Dropdown item "${item}" is not visible.`);
        }
      }
    } else {
      console.log("Dropdown is not visible.");
    }
    if (await this.listBox.isVisible()) {
      const option = this.listBox.getByText(nameFilter);
      if (await option.isVisible()) {
        await option.click();
        await this.listBox.isVisible();
        const filterLocator = this.Page.locator(
          `//div[text()='${action}']`
        ).nth(0);
        expect(await filterLocator.isVisible()).toBeTruthy();
        await option.click();
      } else {
        console.log(`Dropdown item "${nameFilter}" is not visible.`);
      }
    }
  }

  /**
   *  Extracting the filters from the column and verifying in the alerts page
   */

  async getTheFiltersFromTheColumnAndVerify(expectedDropdownItems: string[]) {
    await this.filtersColumn.isVisible();
    await this.filtersColumn.click();
    await this.listBox.isVisible();

    const dropdownItemsText = await this.listBox.innerText();
    const dropdownItems = dropdownItemsText
      .split("\n")
      .map((item) => item.trim());

    expect(dropdownItems).toEqual(expectedDropdownItems);
  }

  /**
   *  Verifying the filters are applied
   */

  async verifyTheAppliedFilters(verifyFilters: string[]) {
    for (let i = 0; i < verifyFilters.length; i++) {
      const item = verifyFilters[i];
      const option = this.listBox.getByText(item);
      if (await option.isVisible()) {
        await option.click();
        await this.listBox.isVisible();
        for (let j = 0; j <= i; j++) {
          const filterLocator = this.Page.locator(
            `//div[text()='${verifyFilters[j]}']`
          );
          expect(await filterLocator.isVisible()).toBeTruthy(); // Assert that the item is visible
        }
      }
    }
  }

  /**
   * Verifying the search bar is visible in the alerts page
   */

  async verifySearchBarIsVisible() {
    await this.searchBar.isVisible();
  }

  /**
   *  Verifying the review button and in the alerts page
   */

  async verifyReviewButtonIsVisible() {
    if (await this.reviewButton.nth(0).isVisible()) {
      await this.reviewButton.nth(0).click();
      if (await this.reviewContent.isVisible()) {
        await this.closeButton.click();
      } else {
        console.log("Review content is not visible.");
      }
    } else {
      console.log("Review button is not visible.");
    }
  }

  /**
   * Verifying the preview popup is opened by selecting the preview button in the alerts page
   */

  async verifythePreviewPopupIsVisible() {
    await this.Page.getByRole("button", { name: "Review" }).first().click();
    await this.Page.waitForLoadState("load");

    await this.Page.getByRole("img", {
      name: "Camera screenshoot",
    }).isVisible();
  }

  /**
   * Selecting the value from the dropdown in the alerts page an verifying it is selected
   */

  async selectValueFromDropdown(dropdownName: string, siteName: string) {
    const dropdown = this.dropdowns.filter({ hasText: dropdownName });
    await expect(dropdown).toBeVisible();
    await dropdown.click();

    const siteOption = this.getByRole.filter({ hasText: siteName }).first();
    await expect(siteOption).toBeVisible();
    await siteOption.click();

    expect(this.dropdowns.filter({ hasText: siteName })).toBeVisible();
  }

  /**
   * Extracting the data from the rows to compare with the review popup
   */

  async extractDataFromRows() {
    this.Page.locator("tbody tr");
    await this.Page.waitForLoadState("load");
    await this.Page.waitForLoadState("networkidle");
    await this.Page.waitForTimeout(waits.veryShortWait);

    const isNoResultVisible = await this.noResult.isVisible();
    if (!isNoResultVisible) {
      const firstRowText = await this.rows.first().innerText();

      if (firstRowText.trim()) {
        const getData = this.rows.locator("td");
        rowTime = await getData.nth(0).innerText();
        getTypeFromRow = await getData.nth(2).innerText();
        getStatusFromRow = await getData.nth(3).innerText();
      }
    }
  }

  /**
   * Verifying the Extracted data and verify it to the review popup
   */

  async verifyDataFromReviewPopup() {
    await this.Page.getByRole("button", { name: "Review" }).first().click();
    await this.Page.waitForLoadState("load");

    await this.Page.getByRole("img", {
      name: "Camera screenshoot",
    }).isVisible();

    const getTimeFromPopup = await this.getTimeZoneFromReviewPopup
      .first()
      .innerText();
    const getStatusFromPopup = await this.getTimeZoneFromReviewPopup
      .nth(1)
      .innerText();
    await this.Page.locator(`//div[contains(text(), '${getTypeFromRow}')]`)
      .first()
      .isVisible();
    expect(getStatusFromRow).toEqual(getStatusFromPopup);

    const timeZone = "UTC";
    const rowDate = new Date(rowTime);
    const columnDate = new Date(getTimeFromPopup);
    const rowTimeInUTC = toZonedTime(rowDate, timeZone);

    const normalizeDateToSeconds = (date: Date) => {
      date.setMilliseconds(0);
      return date.toISOString();
    };

    expect(normalizeDateToSeconds(rowTimeInUTC)).toEqual(
      normalizeDateToSeconds(columnDate)
    );
  }
}
