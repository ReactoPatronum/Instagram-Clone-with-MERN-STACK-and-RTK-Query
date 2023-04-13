function convertDate(param) {
  const date = new Date(param);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  return date.toLocaleDateString("tr-TR", options);
}

function getTimeDifference(createdDate) {
  const now = new Date();
  const difference = now.getTime() - new Date(createdDate).getTime();
  const minutes = Math.floor(difference / 1000 / 60);

  if (minutes < 1) {
    return "Şimdi";
  } else if (minutes < 60) {
    return `${minutes} dakika önce`;
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} saat önce`;
  } else {
    return `${Math.floor(minutes / 1440)} gün önce`;
  }
}

module.exports = { convertDate, getTimeDifference };
