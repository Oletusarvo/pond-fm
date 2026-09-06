export async function extractJsonBody(res: Response) {
  try {
    return await res.json();
  } catch (error) {
    return null;
  }
}
