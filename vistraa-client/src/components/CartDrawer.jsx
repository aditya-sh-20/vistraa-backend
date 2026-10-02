import React, { useState } from 'react';
import { createPaymentOrder, triggerPaymentWebhook } from '../services/paymentApi';

export default function CartDrawer({ isOpen, onClose, cartItems, clearCart }) {
    const [loading, setLoading] = useState(false);
    const [checkoutStatus, setCheckoutStatus] = useState(null);

    if (!isOpen) return null;

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + (item.price || 129.0) * (item.quantity || 1),
        0
    );

    const handleCheckout = async () => {
        setLoading(true);
        setCheckoutStatus('Processing Order...');

        try {
            // 1. Spring Boot se transaction order create karein
            const orderData = await createPaymentOrder({
                userEmail: 'user@vistraa.com',
                totalAmount: totalAmount > 0 ? totalAmount : 129.0,
                sentiment: cartItems[0]?.sentiment || 'CALM',
                size: cartItems[0]?.size || 'M',
                palette: cartItems[0]?.palette || ['#0077B6', '#00B4D8'],
            });

            setCheckoutStatus(`Order Created: ${orderData.transactionOrderId}. Authorizing Payment...`);

            // 2. Mock payment confirmation / Gateway simulation
            const mockPaymentId = `pay_vstr_${Math.random().toString(36).substr(2, 9)}`;

            // 3. Status update via webhook call
            await triggerPaymentWebhook(orderData.transactionOrderId, mockPaymentId);

            setCheckoutStatus('Payment Successful! Order Confirmed.');

            setTimeout(() => {
                if (clearCart) clearCart();
                setCheckoutStatus(null);
                setLoading(false);
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Checkout failed:', error);
            setCheckoutStatus('Checkout Failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-slate-900 text-white h-full p-6 flex flex-col justify-between shadow-2xl">
                <div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold tracking-wide">YOUR SHOPPING CART</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white text-lg font-semibold"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {cartItems.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">Your cart is empty.</p>
                        ) : (
                            cartItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                                    <div>
                                        <h4 className="font-semibold">{item.name || 'Custom Garment'}</h4>
                                        <p className="text-xs text-slate-400">Size: {item.size || 'M'} | Sentiment: {item.sentiment || 'CALM'}</p>
                                    </div>
                                    <span className="font-bold text-teal-400">${item.price || 129.0}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-teal-400">${totalAmount.toFixed(2)}</span>
                    </div>

                    {checkoutStatus && (
                        <div className="p-3 bg-slate-800 border border-teal-500/30 text-teal-300 text-xs text-center rounded-md">
                            {checkoutStatus}
                        </div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={loading || cartItems.length === 0}
                        className={`w-full py-3.5 rounded-lg font-semibold tracking-wider transition-all ${loading || cartItems.length === 0
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20'
                            }`}
                    >
                        {loading ? 'PROCESSING...' : 'PROCEED TO CHECKOUT'}
                    </button>
                </div>
            </div>
        </div>
    );
}