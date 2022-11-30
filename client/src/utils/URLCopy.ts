export default async function URLCopy() {
  const url = window.location.href;
  return await navigator.clipboard
    .writeText(url)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
