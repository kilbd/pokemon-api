import {
  HandlerContext,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import mysql from "mysql";

let pool = mysql.createPool(`${process.env.DATABASE_URL}?connectionLimit=5`);

async function handler(
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> {
  let pokemon = event.path.split("/")[-1];
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
          resolve({
            statusCode: 200,
            body: JSON.stringify(results),
          });
        }
      }
    );
  });
}

export { handler };
