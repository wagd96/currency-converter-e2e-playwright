import { Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class Converter extends BasePage {
    readonly path: string = "/";

    readonly currencyFromInput: Locator;
    readonly currencyFromOptions: Locator;
    readonly currencyInputTo: Locator;
    readonly currencyOptionsTo: Locator;
    readonly currencyOptionMxn: Locator;
    readonly currencyOptionEur: Locator;
    readonly currencyOptionUsd: Locator;
    readonly orderSwitchButton: Locator;
    readonly exchangeRateLabel: Locator;
    readonly converterButton: Locator;

    constructor(page: Page){
        super(page);
        super.setPath(this.path);

        this.currencyFromInput = page.getByTestId('currency-input-from');
        this.currencyFromOptions = page.getByTestId('currency-wrapper-from').locator('svg');
        this.currencyInputTo = page.getByTestId('currency-input-to');
        this.currencyOptionsTo = page.getByTestId('currency-wrapper-from').locator('svg');
        this.currencyOptionMxn = page.getByRole('option', { name: 'Mexico flag MXN' });
        this.currencyOptionEur = page.getByRole('option', { name: 'Euro flag EUR' });
        this.currencyOptionUsd = page.getByRole('option', { name: 'USA flag USD' });
        this.orderSwitchButton = page.getByRole('button', { name: 'Invertir orden' });
        this.exchangeRateLabel = page.getByTestId('exchange-rate');
        this.converterButton = page.getByRole('button', { name: 'Realizar conversión' });
    }

    async getExchangeRateLabelContent(){
        return this.exchangeRateLabel.textContent();
    }

}