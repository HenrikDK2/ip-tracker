import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
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
};

export { handler };
