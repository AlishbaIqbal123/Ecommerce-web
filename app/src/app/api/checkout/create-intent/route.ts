import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
    try {
        const { items, amount, currency = 'usd' } = await req.json();

        // In a real app, you should calculate the amount on the server 
        // based on items from your database to prevent manipulation.
        // For now, we'll use the amount sent from the frontend.

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amounts in cents
            currency,
            metadata: {
                integration_check: 'accept_a_payment',
                items: JSON.stringify(items.map((i: any) => i.id)),
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
