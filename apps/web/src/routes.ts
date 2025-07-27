import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./routes/index.tsx"),
  route("/:id", "./routes/counter-detail.tsx"),
] satisfies RouteConfig;
