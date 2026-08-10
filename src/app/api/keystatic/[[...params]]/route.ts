import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

export function generateStaticParams() {
  return [{ params: [] }];
}

export const { POST, GET } = makeRouteHandler({
  config,
});
