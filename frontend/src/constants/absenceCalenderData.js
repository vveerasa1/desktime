export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
 export const leaveTypes = {
  personal: "#FFE8C8",
  paid: "#C8FFD9",
};

export const teamMembers = [
  {
    id: 1,
    name: "Abraham Joel",
    role: "Web Developer",
    avatar: "A",
    leaves: [
      {
        type: "personal",
        startDay: 0,
        endDay: 1,
        rason: "Personal Leave",
        dateRange: "Jun 16–17",
      },
    ],
  },
  {
    id: 2,
    name: "William Smith",
    role: "Web Developer",
    avatar: "W",
    leaves: [
      {
        type: "paid",
        startDay: 1,
        endDay: 1,
        reason: "Paid Leave",
        dateRange: "Jun 17",
      },
    ],
  },
];