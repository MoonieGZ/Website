export function generateShortLink(id: number) {
  const ab = "0JbyY7pLxMVG6kjR-sCz4Fhl_Ttw2qgNX5ZQn9S1v8fc3PDdrKHBmW";
  let ret = "";
  const base = ab.length;
  let iterations = 6;
  
  while (id && iterations) {
    ret = ab[id % base] + ret;
    id = Math.floor(id / base);
    iterations--;
  }
  
  if (id) {
    throw new Error('Failed to process ID');
  }
  
  return ret;
}
  
export function cleanFormeName(formename: string) {
  return formename
    .replace(" Forme", "")
    .replace(" Flower", "")
    .replace(" Pattern", "")
    .replace(" Drive", "")
    .replace("Type: ", "")
    .replace(" Mode", "");
}