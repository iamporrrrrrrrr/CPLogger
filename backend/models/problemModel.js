import mongoose from 'mongoose'

const problemSchema = mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        status: {
            type: Number,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

export const Problem = mongoose.model('Problem', problemSchema)