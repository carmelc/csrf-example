describe('React application', () => {
  it('should display title', async () => {
    await page.goto('http://localhost:3100/app');
    await page.waitForSelector('h2');

    expect(
      await page.$eval('h2', (e: HTMLHeadingElement) => e.innerText),
    ).toEqual('Welcome to the currency app, please login');
  });
});
