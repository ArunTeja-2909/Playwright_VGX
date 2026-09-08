import { test as baseTest } from "@playwright/test";
import Login from "../pages/loginpage";
import AlertsPage from "../pages/alertsPage";
import LogOut from "../pages/logOut";

const test = baseTest.extend<{
  loginPage: Login;
  alertsPage: AlertsPage;
  logOut: LogOut;
}>({
  loginPage: async ({ page }, use) => {
    await use(new Login(page));
  },

  alertsPage: async ({ page }, use) => {
    await use(new AlertsPage(page));
  },

  logOut: async ({ page }, use) => {
    await use(new LogOut(page));
  },
});

export default test;
