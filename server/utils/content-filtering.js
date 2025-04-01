const { RegExpMatcher, englishDataset, englishRecommendedTransformers } = require('obscenity');

const contentFilterMatcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers,
});

module.exports = {contentFilterMatcher};