import { format } from 'date-fns';

const formatDateTime = (date: string) => {
  const today = new Date();
  const commentDate = new Date(date);
  const diff = Math.abs(today.getTime() - commentDate.getTime());
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

  if (diffDays <= 1) {
    const diffHours = Math.ceil(diff / (1000 * 3600));
    if (diffHours <= 1) {
      const diffMinutes = Math.ceil(diff / (1000 * 60));
      if (diffMinutes <= 1) {
        return 'Just now';
      }
      return `${diffMinutes - 1} minute${diffMinutes - 1 === 1 ? '' : 's'} ago`;
    }
    return `${diffHours - 1} hour${diffHours - 1 === 1 ? '' : 's'} ago`;
  }

  if (diffDays <= 7) {
    return `${diffDays - 1} day${diffDays - 1 === 1 ? '' : 's'} ago`;
  }

  if (diffDays < 365) {
    return format(commentDate, 'MMM dd • HH:mm');
  }

  return format(commentDate, 'MMM dd, yyyy');
};

export default formatDateTime;
