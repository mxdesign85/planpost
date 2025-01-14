const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var mySchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    name: { type: String, required: true },
    plan_name: { type: String },
    create_time: { type: Date },
    planId: { type: String },
    id: { type: String },
    links: { type: Array },
    product_id: { type: String },
    status: { type: String },
    usage_type: { type: String },
    price: { type: Number },
    description: { type: String },
    time_period: { type: String },
    ai_text_generate: { type: Boolean },
    ai_image_generate: { type: Boolean },
    post_per_month: { type: Number },
    editor_access: { type: Boolean },
    interval: { type: Number, default: 1 },
    interval_unit: { type: String, default: 1 },
    post_type: { type: String },
    trial_period: { type: Number },
    active_status: { type: Boolean, default: true },
    type: { type: String },
    object: { type: Object },
    socialIntregation: { type: Array },


});
module.exports = mongoose.models['subscriptionPlan'] || mongoose.model('subscriptionPlan', mySchema)