const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Jumlah produk minimal 1.']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Harga tidak boleh negatif.']
    }
});
const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: [true, 'ID User wajib diisi.']
    },
    orderItems: [OrderItemSchema],
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['CreditCard', 'TransferBank', 'COD', 'E-Wallet'], // Contoh opsi
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    }

}, {
    timestamps: true
});
module.exports = mongoose.model('Order', OrderSchema);