const exampleProductivityData = {
  data: {
    date: "2025-07-01",
    session: [
      {
        time: "08:00",
        productive: 30,
        neutral: 50,
        unproductive: 20,
        apps: ["App1", "App2"],
        total: "1h 30m",
      },
      {
        time: "08:05",
        productive: 40,
        neutral: 40,
        unproductive: 20,
        apps: ["App3"],
        total: "1h 20m",
      },
      {
        time: "08:10",
        productive: 50,
        neutral: 30,
        unproductive: 20,
        apps: ["App1", "App4"],
        total: "1h 10m",
      },
      // Add more time slots as needed
    ],
  },
};

export default exampleProductivityData;
