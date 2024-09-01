import slugify from 'slugify';

export const makeSlug = (str: string | undefined) => {
	if (!str) return '';

	const slug = slugify(str, { replacement: '-', lower: true });
	return slug;
};
