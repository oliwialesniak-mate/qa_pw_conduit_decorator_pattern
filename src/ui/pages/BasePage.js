import {
  decorateWithUserId,
  decorateWithTitleFromFunction,
  decorateWithTiming,
  expect,
} from '../../common/helpers/pw';
import { test } from '@playwright/test';

export class BasePage {
  _url;

  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.step = decorateWithUserId(test.step, this.userId);
    this.step = decorateWithTitleFromFunction(this.step);
    this.step = decorateWithTiming(this.step);
  }

  _pageName() {
    return this.constructor.name.replace('Page', '');
  }

  url() {
    if (this._url) {
      return this._url;
    } else {
      throw Error(`The property '_url' must be implemented`);
    }
  }

  async open(directUrl = undefined) {
    await this.step(`Open ${this._pageName()} page`, async () => {
      const url = directUrl ? directUrl : this.url();
      await this.page.goto(url);
    });
  }

  getCurrentPageUrl() {
    return this.page.url();
  }

  async assertOpened() {
    await this.step(`Assert ${this._pageName()} page is opened`, async () => {
      await this.page.waitForURL(this.url());
      await expect(this.page).toHaveURL(this.url());
    });
  }
}