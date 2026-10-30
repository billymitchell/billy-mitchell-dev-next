export function projectSlug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\/,:]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
