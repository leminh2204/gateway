export default function authHeader() {
  const accesstoken = JSON.parse(localStorage.getItem('accesstoken'));

  if (accesstoken) {
    return { Authorization: 'Bearer ' + accesstoken };
  } else {
    return {};
  }
}