export const slugify = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/ +/g, '-');
};
