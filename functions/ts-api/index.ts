import {
  HandlerContext,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import mysql from "mysql";

let pool = mysql.createPool(
  `${process.env.DATABASE_URL}?connectionLimit=5&ssl={"rejectUnauthorized": false}`
);

async function handler(
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> {
  let pathSegments = event.path.split("/");
  let pokemon = pathSegments[pathSegments.length - 1];
  if (!pokemon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Did not find Pokemon name to query." }),
    };
  }
  return new Promise((resolve, reject) => {
    pool.query(
      "select cast(id as char) as pokemonId, name, hp, legendary_or_mythical from pokemon where slug = ?",
      [pokemon],
      (error, results, fields) => {
        if (error) {
          resolve({
            statusCode: 400,
            body: JSON.stringify(error),
          });
        } else {
          let result = results[0];
          resolve({
            statusCode: 200,
            body: JSON.stringify({
              id: result["pokemonId"],
              name: result["name"],
              hp: result["hp"],
              legendary_or_mythical: result["legendary_or_mythical"] === 1,
            }),
          });
        }
      }
    );
  });
}

export { handler };
