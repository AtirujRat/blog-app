export function TimeAgoHandle({ date }) {
  const now = new Date();
  const secondsPast = Math.floor((now - new Date(date)) / 1000);

  if (secondsPast < 60) {
    return `${1} min`;
  }
  if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return minutes === 1 ? "1 min" : `${minutes} mins`;
  }
  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  if (secondsPast < 2592000) {
    const days = Math.floor(secondsPast / 86400);
    return days === 1 ? "1 day" : `${days} days`;
  }
  if (secondsPast < 31536000) {
    const months = Math.floor(secondsPast / 2592000);
    return months === 1 ? "1 month" : `${months} months`;
  }
  const years = Math.floor(secondsPast / 31536000);
  return years === 1 ? "1 year" : `${years} years`;
}
