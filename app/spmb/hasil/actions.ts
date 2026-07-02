"use server";

export async function fetchCsvData(url: string) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return { success: true, data: text };
  } catch (error: any) {
    console.error("Failed to fetch CSV:", error);
    return { success: false, error: error.message };
  }
}
