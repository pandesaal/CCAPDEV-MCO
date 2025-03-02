const Comment = require('../models/Comment');

const getCommentsData = async ({search} = {}) => {
    const filters = {};
    
    try {
        if (search?.get('q')) {
            filters.$or = [
                { content: { $regex: search.get('q'), $options: 'i' } }
            ];
        }

        const comments = await Comment.find(filters).populate('author').lean();

        return comments.map(comment => ({
            ...comment,
            datePosted: new Date(comment.datePosted).toISOString().split('T')[0],
            dateEdited: new Date(comment.dateEdited).toISOString().split('T')[0]
        }));
        
    } catch (error) {
        console.error(error);
        return [];
    }
};

module.exports = getCommentsData;
