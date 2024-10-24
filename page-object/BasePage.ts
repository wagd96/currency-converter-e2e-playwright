import { Page } from "@playwright/test";

export default abstract class BasePage {
  readonly page: Page;
  public path: string;

  constructor(page: Page) {
    this.page = page;
  }
  setPath(path: string) {
    this.path = path;
  }
  async navigate() {
    await this.page.goto(this.path);
  }

  async clickElementByText(text) {
    await this.page.getByText(text).click();
  }

  async clickElementByPlaceholder(placeholder) {
    await this.page.getByPlaceholder(placeholder).click();
  }

  async clickElementByLabel(label) {
    await this.page.getByLabel(label).click();
  }

  async clickElementByRole(role, options) {
    await this.page.getByRole(role, options).click();
  }
}