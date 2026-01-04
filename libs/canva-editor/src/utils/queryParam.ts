export function searchQueryParam(param: string): string | null {
  const queryString = window.location.search.substring(1);
  const paramsArray = queryString.split('&');

  for (const paramPair of paramsArray) {
    const [key, value] = paramPair.split('=');
    if (key === param && value !== undefined) {
      return decodeURIComponent(value);
    }
  }

  return null;
}
