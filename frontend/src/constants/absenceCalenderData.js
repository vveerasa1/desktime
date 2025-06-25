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
        start: 0,
        end: 1,
        label: "Personal Leave",
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
        start: 1,
        end: 1,
        label: "Paid Leave",
        dateRange: "Jun 17",
      },
    ],
  },
];