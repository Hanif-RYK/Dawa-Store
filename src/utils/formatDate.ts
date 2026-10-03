// Human-readable order dates (e.g. "9 Sept 2026"), shared by account and admin views.
export const formatOrderDate = (dateStr?: string, createdAt?: string): string => {
  const raw = dateStr || createdAt;
  if (!raw) return 'N/A';
  const normalized = raw.replace(/Sept/i, 'Sep');
  const d = new Date(normalized);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return raw;
};
