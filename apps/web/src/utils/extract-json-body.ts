/**Extracts the body of a Response as json. Returns null if it couldn't be parsed as such. */
export async function extractJsonBody(res: Response) {
  try {
    return await res.json();
  } catch (error) {
    return null;
  }
}
