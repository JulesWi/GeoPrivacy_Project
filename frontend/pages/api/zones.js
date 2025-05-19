// pages/api/zones.js
export default function handler(req, res) {
  const zones = [
    { id: '1', name: 'Zone A', type: 'type1', radius: 100, visits: 5, lastVisit: '2025-05-18T10:00:00Z' },
    { id: '2', name: 'Zone B', type: 'type2', radius: 200, visits: 10, lastVisit: '2025-05-19T12:00:00Z' },
    // Add more zone objects as needed
  ];

  res.status(200).json(zones);
}
