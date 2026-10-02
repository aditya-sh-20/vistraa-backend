const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8082';

export const createPaymentOrder = async (orderPayload) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: orderPayload.userEmail || 'customer@vistraa.com',
                amount: orderPayload.totalAmount,
                currency: 'USD',
                sentiment: orderPayload.sentiment || 'NEUTRAL',
                size: orderPayload.size || 'M',
                palette: orderPayload.palette || ['#000000', '#FFFFFF'],
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in createPaymentOrder:', error);
        throw error;
    }
};

export const triggerPaymentWebhook = async (transactionOrderId, paymentId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/payments/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transactionOrderId,
                paymentId,
                status: 'COMPLETED',
            }),
        });

        if (!response.ok) {
            throw new Error(`Webhook trigger failed: ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error in triggerPaymentWebhook:', error);
        throw error;
    }
};