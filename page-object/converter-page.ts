import { Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class ConverterPage extends BasePage {
    readonly path: string = "/";

    readonly fromCurrencyInput: Locator;
    readonly fromCurrencyOptions: Locator;
    readonly toCurrencyInput: Locator;
    readonly toCurrencyOptions: Locator;
    readonly currencyMxnOption: Locator;
    readonly currencyOptionEur: Locator;
    readonly currencyOptionUsd: Locator;
    readonly invertButton: Locator;
    readonly exchangeRateLabel: Locator;
    readonly createQuoteButton: Locator;

    constructor(page: Page) {
        super(page);
        super.setPath(this.path);

        this.fromCurrencyInput = page.getByTestId('currency-input-from');
        this.fromCurrencyOptions = page.getByTestId('currency-wrapper-from').locator('svg');
        this.toCurrencyInput = page.getByTestId('currency-input-to');
        this.toCurrencyOptions = page.getByTestId('currency-wrapper-to').locator('svg');
        this.invertButton = page.getByRole('button', { name: 'Invertir orden' });
        this.exchangeRateLabel = page.getByTestId('exchange-rate');
        this.createQuoteButton = page.getByRole('button', { name: 'Realizar conversión' });
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

    async getFromInputValue(): Promise<string>{
        return this.fromCurrencyInput.inputValue();
    }

    async getToInputValue(): Promise<string>{
        return this.toCurrencyInput.inputValue();
    }

    async getExchangeRateLabelContent(): Promise<string> {
        return this.exchangeRateLabel.innerText();
    }

    async getExchangeRateValue():Promise<number>{
        let str = await this.getExchangeRateLabelContent();
        return Number(str.match(/(\d+)/));
    }

}