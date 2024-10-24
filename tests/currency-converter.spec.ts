import { test, expect } from '@playwright/test';
import { getRandomNumber, extractExchangeRate } from '../utils/numberUtils';
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

    test.only('should display correct exchange rate in to field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(50, 25000));

        await converter.setupCurrencies('Euro flag EUR', 'USA flag USD');
        await converter.enterFromAmount(valueToConvert);

        const exchangeRate = await converter.getExchangeRateLabelContent();
        const exchangeRateValue = extractExchangeRate(exchangeRate);
        const toInputValue = await converter.getToInputValue();

        const expectedQuote = Number(valueToConvert) * Number(exchangeRateValue);

        expect(Number(toInputValue)).toBeCloseTo(expectedQuote);
    });

    test.only('should display correct exchange rate in from field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = getRandomNumber(50, 25000);

        await converter.setupCurrencies('Euro flag EUR', 'USA flag USD');
        await converter.enterToAmount(String(valueToConvert));

        const exchangeRate = await converter.getExchangeRateLabelContent();
        const exchangeRateValue = extractExchangeRate(exchangeRate);
        const fromInputValue = await converter.getFromInputValue();


        if (exchangeRateValue !== null) {
            const expectedQuote = valueToConvert / exchangeRateValue;
            expect(Number(fromInputValue)).toBeCloseTo(expectedQuote);
        } else {
            throw new Error('Failed to extract a valid exchange rate from the exchange rate string.');
        }
    });

    test('should swap currencies correctly when swap button is clicked', async ({ page }) => {
        const converter = new ConverterPage(page);
        const expectedFromCurrency = "USD";
        const expectedToCurrency = "MXN";
        const valueToConvert = getRandomNumber(50, 25000);

        await converter.setupCurrencies('USA flag USD', 'Mexico flag MXN')
        await converter.enterToAmount(String(valueToConvert));

        await expect(converter.fromCurrencyWrapper).toContainText(expectedFromCurrency);
        await expect(converter.toCurrencyWrapper).toContainText(expectedToCurrency);

        await converter.clickInvertButton();

        await expect(converter.fromCurrencyWrapper).toContainText(expectedToCurrency);
        await expect(converter.toCurrencyWrapper).toContainText(expectedFromCurrency);
    })
});
