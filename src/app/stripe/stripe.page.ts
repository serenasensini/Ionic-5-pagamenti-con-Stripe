import { Component } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-stripe',
  templateUrl: 'stripe.page.html',
  styleUrls: ['stripe.page.scss'],
})
export class StripePage {
  totale: string = '33.33';
  currency: string = 'EUR';
  moneta: string = '€';
  stripe_key = 'CHIAVE_STRIPE';
  dettCarta: any = {};

  constructor(private stripe: Stripe, private http: HttpClient) {
  }

  pagaConStripe() {
    this.stripe.setPublishableKey(this.stripe_key);

    this.dettCarta = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
    };

    this.stripe.createCardToken(this.dettCarta)
      .then(token => {
        /* Risposta tipo
        {
          card: "Visa",
          exp_month: 12,
          exp_year: 2020,
          funding: "credit",
          last4: "4242",
          id: "tok_1234567890asdfghjk",
          type: "card"
        }
        * */
        console.log(token);
        this.effettuaPagamento(token.id);
      })
      .catch(error => console.error(error));
  }

  effettuaPagamento(token) {
    this.http
      .post('https://XXXX/payWithStripe', {
        token: token.id
      })
      .subscribe(data => {
        console.log(data);
        /* risposta tipo:
        {
    "id": "xxx",
    "object": "charge",
    "amount": 100,
    "amount_refunded": 0,
    ...
	 "failure_code": null,
    "failure_message": null,
    "payment_method_details": {
        "card": {
            "brand": "visa",
			...
            "country": "US",
            "description": "Visa Classic",
            "exp_month": 2,
            "exp_year": 2024,
            "fingerprint": "xxx",
            "funding": "credit",
            "last4": "4242",

        },
        "type": "card"
    },
    "receipt_url": "https://pay.stripe.com/receipts/XXX",
...
}
        * */
      });
  }

}
