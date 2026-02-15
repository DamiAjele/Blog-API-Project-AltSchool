const { Schema} = require('mongoose');
const mongoose = require('mongoose');

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    readCount: {
        type: Number,
        default: 0,
    },
    readingTime: {
        type: Number,
    },
    tags: {
        type: [String],
        enum: ["technology", "lifestyle", "education", "health", "travel", "food", "finance", "entertainment"],
    },
    Content: {
        type: String,
        required: true,
    }
}, { timestamps: true }
);

postSchema.index({ state: 1 });
postSchema.index({ read_count: -1 });
postSchema.index({ reading_time: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ author: "text", title: "text", tags: "text" });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;