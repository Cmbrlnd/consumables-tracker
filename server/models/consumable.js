const mongoose = require('mongoose')

const ConsumableSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        make: { type: String, required: true },
        model: { type: String, required: true },
        minQty: { type: Number, required: true},
        maxQty: { type: Number, required: true },
        currentQty: { type: Number, required: true }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Consumable', ConsumableSchema)