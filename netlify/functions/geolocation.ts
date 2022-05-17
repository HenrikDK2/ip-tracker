import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

const handler: Handler = async (event) => {
  try {
    if (!event.queryStringParameters.ip) {
      return { statusCode: 400, body: "ip parameter is required" };
    }

    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEOLOCATION_APIKEY}&ip=${event.queryStringParameters.ip}`
    );

    if (!response.ok) return { statusCode: 400, body: response.statusText };
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }
};

export { handler };
