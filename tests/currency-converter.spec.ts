import { CURRENCIES, URLS } from '../utils/constants';
import { test, expect } from '@playwright/test';
import { getRandomNumber } from '../utils/numberUtils';
import { ConverterPage } from '../page-object/converter-page';

test.describe('Currency converter', () => {
    const url = URLS.HOME;
    const minValue = 50;
    const maxValue = 25000;

    test.beforeEach(async ({ page }) => {
        // Runs before each test and signs in each page.
        await page.goto(url);
    });

    test('should enable quote button when amount is entered in from field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(minValue, maxValue));

        await expect(converter.createQuoteButton).not.toBeEnabled();
        await converter.enterFromAmount(valueToConvert);
        await expect(converter.createQuoteButton).toBeEnabled();
    });

    test('should enable quote button when amount is entered in to field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(minValue, maxValue));

        await expect(converter.createQuoteButton).not.toBeEnabled();
        await converter.enterToAmount(valueToConvert);
        await expect(converter.createQuoteButton).toBeEnabled();
    });

    test('should display correct exchange rate in to field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(minValue, maxValue));
        const eur = CURRENCIES.EUR;
        const usd = CURRENCIES.USD;

        await converter.setupCurrencies(eur.selectLabel, usd.selectLabel);
        await converter.enterFromAmount(valueToConvert);

        const exchangeRateValue = await converter.getExchangeRateValue();
        const toInputValue = await converter.getToInputValue();

        const expectedQuote = Number(valueToConvert) * Number(exchangeRateValue);

        expect(Number(toInputValue)).toBeCloseTo(expectedQuote);
    });

    test('should display correct exchange rate in from field', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = getRandomNumber(minValue, maxValue);
        const eur = CURRENCIES.EUR;
        const usd = CURRENCIES.USD;

        await converter.setupCurrencies(eur.selectLabel, usd.selectLabel);
        await converter.enterToAmount(String(valueToConvert));

        const exchangeRateValue = await converter.getExchangeRateValue();
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
        const valueToConvert = getRandomNumber(minValue, maxValue);
        const usd = CURRENCIES.USD;
        const mxn = CURRENCIES.MXN;

        await converter.setupCurrencies(usd.selectLabel, mxn.selectLabel)
        await converter.enterToAmount(String(valueToConvert));

        await expect(converter.fromCurrencyWrapper).toContainText(usd.currency);
        await expect(converter.toCurrencyWrapper).toContainText(mxn.currency);

        await converter.clickInvertButton();

        await expect(converter.fromCurrencyWrapper).toContainText(mxn.currency);
        await expect(converter.toCurrencyWrapper).toContainText(usd.currency);
    });

    test.only('should save conversion in history after successful quote', async ({ page }) => {
        const converter = new ConverterPage(page);
        const valueToConvert = String(getRandomNumber(minValue, maxValue));
        const usd = CURRENCIES.USD;
        const mxn = CURRENCIES.MXN;

        await converter.setupCurrencies(usd.selectLabel, mxn.selectLabel);
        await converter.enterFromAmount(String(valueToConvert));

        const exchangeRateValue = await converter.getExchangeRateValue();
        const expectedQuote = Number(valueToConvert) * Number(exchangeRateValue);

        await converter.clickCreateQuoteButton();

        await converter.historyTable.scrollIntoViewIfNeeded();
        await expect(converter.historyTable).toBeVisible();

        const quoteResultRow = await converter.getFirstHistoryResult();
        const currencyFrom = await quoteResultRow[1].innerText();
        const currencyTo = await quoteResultRow[2].innerText();
        const amountFrom = await quoteResultRow[3].innerText();
        const amountTo = await quoteResultRow[4].innerText();
        const exchangeRate = await quoteResultRow[5].innerText();

        expect(currencyFrom?.trim()).toBe(usd.currency);
        expect(currencyTo?.trim()).toBe(mxn.currency);
        expect(Number(amountFrom)).toBe(Number(valueToConvert));
        expect(Number(amountTo)).toBeCloseTo(expectedQuote);
        expect(Number(exchangeRate)).toBeCloseTo(exchangeRateValue);
    });
});
