export const ZONES = [
  { id: 'north-upper', name: 'North Upper', section: 'Section 301–310', density: 0.85, capacity: 5200, current: 4420, type: 'high' },
  { id: 'north-lower', name: 'North Lower', section: 'Section 101–110', density: 0.62, capacity: 3800, current: 2356, type: 'medium' },
  { id: 'south-upper', name: 'South Upper', section: 'Section 311–320', density: 0.35, capacity: 5200, current: 1820, type: 'low' },
  { id: 'south-lower', name: 'South Lower', section: 'Section 111–120', density: 0.78, capacity: 3800, current: 2964, type: 'high' },
  { id: 'east-upper', name: 'East Upper', section: 'Section 201–205', density: 0.55, capacity: 2600, current: 1430, type: 'medium' },
  { id: 'east-lower', name: 'East Lower', section: 'Section 401–405', density: 0.42, capacity: 2200, current: 924, type: 'low' },
  { id: 'west-upper', name: 'West Upper', section: 'Section 206–210', density: 0.91, capacity: 2600, current: 2366, type: 'high' },
  { id: 'west-lower', name: 'West Lower', section: 'Section 406–410', density: 0.48, capacity: 2200, current: 1056, type: 'medium' },
  { id: 'field', name: 'Field Level', section: 'VIP & Press', density: 0.72, capacity: 800, current: 576, type: 'medium' },
];

export const CONCESSION_STALLS = [
  {
    id: 'grill-house', name: 'The Grill House', icon: '🔥', location: 'Section 102, Level 1',
    type: 'Grill', waitMin: 12,
    menu: [
      { id: 101, name: 'Stadium Burger', price: 14.99, emoji: '🍔' },
      { id: 102, name: 'BBQ Pulled Pork', price: 15.99, emoji: '🥩' },
      { id: 103, name: 'Chicken Tenders', price: 12.99, emoji: '🍗' },
    ],
  },
  {
    id: 'pizza-corner', name: 'Pizza Corner', icon: '🍕', location: 'Section 205, Level 2',
    type: 'Pizza', waitMin: 15,
    menu: [
      { id: 201, name: 'Margherita Pizza', price: 13.99, emoji: '🍕' },
      { id: 202, name: 'Pepperoni Pizza', price: 12.99, emoji: '🍕' },
    ],
  },
  {
    id: 'craft-taps', name: 'Craft Taps', icon: '🍺', location: 'Section 110, Level 1',
    type: 'Drinks', waitMin: 3,
    menu: [
      { id: 301, name: 'Craft IPA 16oz', price: 12.00, emoji: '🍺' },
      { id: 302, name: 'Lager Draft', price: 10.00, emoji: '🍻' },
    ],
  },
];

export const STALL_FILTERS = ['All', 'Grill', 'Pizza', 'Drinks'];

export const ALERT_FILTERS = ['All', 'Food', 'Navigation', 'Urgent'];

export const ALERTS = [
  { id: 1, type: 'danger', category: 'Urgent', icon: '⚠️', title: 'Crowd Surge Warning', message: 'Heavy foot traffic at Gate B near Section 12. Use Gate D for faster exit.', time: '2 min ago' },
  { id: 2, type: 'success', category: 'Food', icon: '🍕', title: 'Halftime Promo', message: 'Get 20% off at Pizza Corner (Section 205) for the next 15 mins!', time: '8 min ago' },
  { id: 3, type: 'info', category: 'Navigation', icon: '🚻', title: 'Restroom Availability', message: 'The West Restrooms near Section 12 are currently full.', time: '14 min ago' },
];

export const SEAT_DATA = {
  venue: 'MetLife Stadium',
  seat: 'SEC 214 • ROW F • SEAT 12',
  event: 'Giants vs Eagles',
  date: 'Today, 7:30 PM',
  gate: 'Gate A',
  row: 'F',
  section: '214',
};

export const NEARBY_AMENITIES = [
  { name: 'Restrooms', distance: '45 ft', status: 'open', icon: '🚻' },
  { name: 'Beer Garden', distance: '120 ft', status: 'busy', icon: '🍺' },
  { name: 'Fan Shop', distance: '200 ft', status: 'open', icon: '🏈' },
];

export const RESTROOM_LOCATIONS = [
  { id: 'rr1', name: 'Northwest Restroom', x: 120, y: 30 },
  { id: 'rr2', name: 'Northeast Restroom', x: 280, y: 30 },
  { id: 'rr3', name: 'West Restroom', x: 14, y: 160 },
  { id: 'rr4', name: 'East Restroom', x: 386, y: 160 },
];
