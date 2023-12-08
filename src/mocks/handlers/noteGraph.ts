import { http } from "msw";
import {
  getGraphDataResolver,
  updateGraphDataResolver,
} from "../resolvers/noteGraphResolvers";

// These request handlers focus on the endpoints
// that concern the user.

export const handlers = [
  http.get("/daynote/:noteId", getGraphDataResolver),
  http.post("/daynote/:noteId", updateGraphDataResolver),
  // http.post("/login", loginResolver),
  // http.delete("/user/:userId", deleteUserResolver),
];
