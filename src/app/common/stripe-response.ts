export class StripeResponse {
    amount!: number;
    receipt_email!: string;
    payment_method!: string;
    id!: string;
    status!: string;

    constructor(amount: number, 
        receipt_email: string,
        payment_method: string,
        id: string,
        status: string
        ) {
            this.amount = amount;
            this.receipt_email = receipt_email;
            this.payment_method = payment_method;
            this.id = id;
            this.status = status;
    }
}