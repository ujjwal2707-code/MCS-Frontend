import axios from "axios";

const API_KEY = "938ea26e62e254b8c376b7c74eb1d4f3dcc5ef8af3587bcf5fbd92cd66872b2a";
const BASE_URL = "https://www.virustotal.com/api/v3";

export const fetchScanResults = async (scanId: string) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/analyses/${scanId}`, {
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
        "x-apikey": API_KEY
      },
    });
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching scan results:",
      error.response?.data || error
    );
    throw new Error("Failed to fetch scan results.");
  }
};
