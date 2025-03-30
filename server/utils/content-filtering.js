import {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} from 'obscenity';

export const contentFilterMatcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers,
});