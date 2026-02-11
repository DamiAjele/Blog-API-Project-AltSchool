const { Schema, model } = require('mongoose');

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
postSchema.index({ author: " ", title: "text", tags: "text" });

const postModel = model('Post', postSchema);

module.exports = postModel;