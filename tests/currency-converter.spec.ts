import { test, expect } from '@playwright/test';
import { getRandomNumber } from '../utils/randomUtils';
import { ConverterPage } from '../page-object/converter-page';

test.describe('Currency converter', () => {
    const url = 'https://efex.vercel.app';

    test.beforeEach(async ({ page }) => {
        // Runs before each test and signs in each page.
        await page.goto(url);
    });

    test('Quote button should be enabled only when from amount is entered', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await expect(converter.createQuoteButton).not.toBeEnabled();
        await converter.enterFromAmount(valueToConvert);
        await expect(converter.createQuoteButton).toBeEnabled();
    });

    test('Quote button should be enabled only when to amount is entered', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await expect(converter.createQuoteButton).not.toBeEnabled();
        await converter.enterToAmount(valueToConvert);
        await expect(converter.createQuoteButton).toBeEnabled();
    });

    test('Exchange rate in to input field  should be correct', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await converter.selectCurrencyFrom('Euro flag EUR')
        await converter.selectCurrencyTo('USA flag USD')
        await converter.enterFromAmount(valueToConvert)

        const exchangeRateValue = converter.getExchangeRateValue();
        const expectedQuote = Number(valueToConvert) * await exchangeRateValue;
        expect(Number(converter.getToInputValue)).toBe(expectedQuote);
    });

    test('Exchange rate in from input field  should be correct', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await converter.selectCurrencyFrom('Euro flag EUR')
        await converter.selectCurrencyTo('USA flag USD')
        await converter.enterToAmount(valueToConvert)

        const exchangeRateValue = converter.getExchangeRateValue();
        const expectedQuote = Number(valueToConvert) / await exchangeRateValue;
        expect(Number(converter.getFromInputValue)).toBe(expectedQuote);
    });

});
