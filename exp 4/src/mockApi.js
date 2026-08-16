// Simulates a GET /api/events call. In a real app this would be a fetch() call.
const initialEvents = [
  { id: "1", title: "Team Standup", day: "Mon", time: "09:00" },
  { id: "2", title: "Design Review", day: "Tue", time: "11:00" },
  { id: "3", title: "1:1 with Manager", day: "Wed", time: "13:00" },
  { id: "4", title: "Sprint Planning", day: "Thu", time: "10:00" },
  { id: "5", title: "Demo Day", day: "Fri", time: "14:00" }
];

export function fetchEvents() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(initialEvents), 300);
  });
}
