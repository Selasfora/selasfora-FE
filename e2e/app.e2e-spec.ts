import { SelasforaFePage } from './app.po';

describe('selasfora-fe App', () => {
  let page: SelasforaFePage;

  beforeEach(() => {
    page = new SelasforaFePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
