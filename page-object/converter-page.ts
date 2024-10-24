import { Locator, Page } from "@playwright/test";
import { extractExchangeRate } from '../utils/numberUtils';
import BasePage from "./BasePage";


export class ConverterPage extends BasePage {
    readonly path: string = "/";

    readonly fromCurrencyWrapper: Locator;
    readonly fromCurrencyInput: Locator;
    readonly fromCurrencyOptions: Locator;
    readonly toCurrencyWrapper: Locator;
    readonly toCurrencyInput: Locator;
    readonly toCurrencyOptions: Locator;
    readonly currencyMxnOption: Locator;
    readonly currencyOptionEur: Locator;
    readonly currencyOptionUsd: Locator;
    readonly invertButton: Locator;
    readonly exchangeRateLabel: Locator;
    readonly createQuoteButton: Locator;
    readonly historyTable: Locator;
    readonly historyResults: Locator;

    constructor(page: Page) {
        super(page);
        super.setPath(this.path);

        this.fromCurrencyWrapper = page.getByTestId('currency-wrapper-from');
        this.fromCurrencyInput = page.getByTestId('currency-input-from');
        this.fromCurrencyOptions = this.fromCurrencyWrapper.locator('svg');

        this.toCurrencyWrapper = page.getByTestId('currency-wrapper-to');
        this.toCurrencyInput = page.getByTestId('currency-input-to');
        this.toCurrencyOptions = page.getByTestId('currency-wrapper-to').locator('svg');

        this.invertButton = page.getByRole('button', { name: 'Invertir orden' });
        this.exchangeRateLabel = page.getByTestId('exchange-rate');
        this.createQuoteButton = page.getByRole('button', { name: 'Realizar conversión' });

        this.historyTable = page.getByRole('table');
        this.historyResults = this.historyTable.locator('tbody');
    }

    async selectCurrencyFrom(currency: string) {
        await this.fromCurrencyOptions.click();
        await this.page.getByRole('option', { name: `${currency}` }).click();
    }

    async enterFromAmount(amount: string) {
        await this.fromCurrencyInput.fill(amount);
    }

    async selectCurrencyTo(currency: string) {
        await this.toCurrencyOptions.click();
        await this.page.getByRole('option', { name: `${currency}` }).click();
    }

    async enterToAmount(amount: string) {
        await this.toCurrencyInput.fill(amount);
    }

    async clickInvertButton() {
        await this.invertButton.click();
    }

    async clickCreateQuoteButton() {
        await this.createQuoteButton.click();
    }

    async getFromInputValue(): Promise<string> {
        return await this.fromCurrencyInput.inputValue();
    }

    async getToInputValue(): Promise<string> {
        return await this.toCurrencyInput.inputValue();
    }

    async getExchangeRateLabelContent(): Promise<string> {
        return await this.exchangeRateLabel.innerText();
    }

    async getExchangeRateValue(): Promise<number>{
        const exchangeRate = await this.getExchangeRateLabelContent();
        return extractExchangeRate(exchangeRate);
    }

    async setupCurrencies(from: string, to: string) {
        await this.selectCurrencyFrom(from);
        await this.selectCurrencyTo(to);
    }

    async getAllHistoryResults() {
        return await this.historyResults.locator('tr').all();
    }

    async getFirstHistoryResult() {
        return this.historyResults.locator('tr').first().locator('td').all();
    }

    async getLastHistoryResult() {
        return this.historyResults.locator('tr').last().locator('td').all();
    }

    async getSpecificHistoryResult(rowId: number) {
        return this.historyResults.locator('tr').nth(rowId).locator('td').all();
    }
}