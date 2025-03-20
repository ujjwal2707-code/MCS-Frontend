import axios from "axios";

const API_KEY = "938ea26e62e254b8c376b7c74eb1d4f3dcc5ef8af3587bcf5fbd92cd66872b2a";
const BASE_URL = "https://www.virustotal.com/api/v3";

export const scanUrl = async (inputUrl: string) => {
  console.log("inputUrl :",inputUrl)
  try {
    const { data } = await axios.post(
      `${BASE_URL}/urls`,
      `url=${encodeURIComponent(inputUrl)}`,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
          "x-apikey": API_KEY,
        },
      }
    );
    return data.data.id;
  } catch (error: any) {
    console.error("Error submitting URL:", error.response?.data || error);
    throw new Error("Failed to submit URL for scanning.");
  }
};
