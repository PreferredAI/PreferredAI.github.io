import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

export function generateStaticParams() {
  return [{ params: [] }];
}

const isServer =
  process.env.NEXT_OUTPUT_MODE === "server" ||
  process.env.NODE_ENV !== "production";

const dummyHandler = async () =>
  new Response("Keystatic API disabled in static export mode", {
    status: 404,
  });

const routeHandler = isServer
  ? makeRouteHandler({ config })
  : {
      GET: dummyHandler,
      POST: dummyHandler,
    };

export const GET = routeHandler.GET;
export const POST = routeHandler.POST;
