import { test, expect } from '@playwright/test';
import { getRandomNumber } from '../utils/randomUtils';
import { ConverterPage } from '../page-object/converter-page';

test.describe('Currency converter', () => {
    const url = 'https://efex.vercel.app';

    test.beforeEach(async ({ page }) => {
        // Runs before each test and signs in each page.
        await page.goto(url);
    });

    test('should enable quote button when amount is entered in from field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await expect(converter.createQuoteButton).not.toBeEnabled();
        await converter.enterFromAmount(valueToConvert);
        await expect(converter.createQuoteButton).toBeEnabled();
    });

    test('should enable quote button when amount is entered in to field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await expect(converter.createQuoteButton).not.toBeEnabled();
        await converter.enterToAmount(valueToConvert);
        await expect(converter.createQuoteButton).toBeEnabled();
    });

    test('should display correct exchange rate in to field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await converter.selectCurrencyFrom('Euro flag EUR')
        await converter.selectCurrencyTo('USA flag USD')
        await converter.enterFromAmount(valueToConvert)

        const exchangeRateValue = converter.getExchangeRateValue();
        const expectedQuote = Number(valueToConvert) * await exchangeRateValue;
        expect(Number(converter.getToInputValue)).toBe(expectedQuote);
    });

    test('should display correct exchange rate in from field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await converter.selectCurrencyFrom('Euro flag EUR')
        await converter.selectCurrencyTo('USA flag USD')
        await converter.enterToAmount(valueToConvert)

        const exchangeRateValue = converter.getExchangeRateValue();
        const expectedQuote = Number(valueToConvert) / await exchangeRateValue;
        expect(Number(converter.getFromInputValue)).toBe(expectedQuote);
    });

    test.only('should swap currencies correctly when swap button is clicked', async ({ page }) => {
        const converter = new ConverterPage(page);
        
        const expectedFromDefaultCurrency = "$USD";
        const expectedToDefaultCurrency = "$MXN";

        await expect(converter.fromCurrencyWrapper).toHaveText(expectedFromDefaultCurrency);
        await expect(converter.toCurrencyWrapper).toHaveText(expectedToDefaultCurrency);

        await converter.clickInvertButton();

        await expect(converter.fromCurrencyWrapper).toHaveText(expectedToDefaultCurrency);
        await expect(converter.toCurrencyWrapper).toHaveText(expectedFromDefaultCurrency);
    })
});
