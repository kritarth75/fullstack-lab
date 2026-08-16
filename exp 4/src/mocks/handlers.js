import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/events", () => {
    return HttpResponse.json([
      { id: "1", title: "Mock Event", day: "Mon", time: "09:00" }
    ]);
  }),

  http.post("/api/events", async ({ request }) => {
    const newEvent = await request.json();
    return HttpResponse.json({ ...newEvent, id: "99" }, { status: 201 });
  })
];
