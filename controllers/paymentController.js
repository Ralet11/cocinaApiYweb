import Stripe from 'stripe';


const stripe = new Stripe("sk_test_51OJV6vCtqRjqS5chtpxR0cKFJLK8jf3WRVchpsfCFZx3JdiyPV0xcHZgYbaJ70XYsmdkssJpHiwdCmEun6X7mThj00IB3NQI0C");

export const paymentIntent = async (req, res) => {
    const { amount } = req.body;
    console.log(req.body, "body")

    if (!amount || typeof amount !== 'number' || amount <= 0) {
   
        return res.status(400).json({ error: 'Invalid or missing amount' });
       
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.floor(amount), // Asegúrate de que sea un número entero
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: 'Payment processing failed. Please try again.' });
    }
};
