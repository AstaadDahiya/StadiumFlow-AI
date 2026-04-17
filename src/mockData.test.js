import { describe, it, expect } from 'vitest';
import { ZONES, CONCESSION_STALLS, STALL_FILTERS, ALERT_FILTERS, ALERTS, SEAT_DATA, NEARBY_AMENITIES, RESTROOM_LOCATIONS } from './mockData';

describe('mockData.js — Data Integrity', () => {
  
  describe('ZONES', () => {
    it('should contain 9 stadium zones', () => {
      expect(ZONES).toHaveLength(9);
    });

    it('every zone should have required properties', () => {
      ZONES.forEach(zone => {
        expect(zone).toHaveProperty('id');
        expect(zone).toHaveProperty('name');
        expect(zone).toHaveProperty('section');
        expect(zone).toHaveProperty('density');
        expect(zone).toHaveProperty('capacity');
        expect(zone).toHaveProperty('current');
        expect(zone).toHaveProperty('type');
      });
    });

    it('density values should be between 0 and 1', () => {
      ZONES.forEach(zone => {
        expect(zone.density).toBeGreaterThanOrEqual(0);
        expect(zone.density).toBeLessThanOrEqual(1);
      });
    });

    it('current occupancy should not exceed capacity', () => {
      ZONES.forEach(zone => {
        expect(zone.current).toBeLessThanOrEqual(zone.capacity);
      });
    });

    it('type should be one of low, medium, or high', () => {
      ZONES.forEach(zone => {
        expect(['low', 'medium', 'high']).toContain(zone.type);
      });
    });

    it('all zone IDs should be unique', () => {
      const ids = ZONES.map(z => z.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('CONCESSION_STALLS', () => {
    it('should contain at least 1 stall', () => {
      expect(CONCESSION_STALLS.length).toBeGreaterThanOrEqual(1);
    });

    it('every stall should have required properties', () => {
      CONCESSION_STALLS.forEach(stall => {
        expect(stall).toHaveProperty('id');
        expect(stall).toHaveProperty('name');
        expect(stall).toHaveProperty('icon');
        expect(stall).toHaveProperty('location');
        expect(stall).toHaveProperty('type');
        expect(stall).toHaveProperty('waitMin');
        expect(stall).toHaveProperty('menu');
      });
    });

    it('wait times should be non-negative numbers', () => {
      CONCESSION_STALLS.forEach(stall => {
        expect(stall.waitMin).toBeGreaterThanOrEqual(0);
        expect(typeof stall.waitMin).toBe('number');
      });
    });

    it('every stall menu should have at least 1 item', () => {
      CONCESSION_STALLS.forEach(stall => {
        expect(stall.menu.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('menu items should have id, name, price, and emoji', () => {
      CONCESSION_STALLS.forEach(stall => {
        stall.menu.forEach(item => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('name');
          expect(item).toHaveProperty('price');
          expect(item).toHaveProperty('emoji');
          expect(item.price).toBeGreaterThan(0);
        });
      });
    });

    it('stall types should match available filter categories', () => {
      const validTypes = STALL_FILTERS.filter(f => f !== 'All');
      CONCESSION_STALLS.forEach(stall => {
        expect(validTypes).toContain(stall.type);
      });
    });
  });

  describe('ALERTS', () => {
    it('should contain at least 1 alert', () => {
      expect(ALERTS.length).toBeGreaterThanOrEqual(1);
    });

    it('every alert should have required properties', () => {
      ALERTS.forEach(alert => {
        expect(alert).toHaveProperty('id');
        expect(alert).toHaveProperty('type');
        expect(alert).toHaveProperty('category');
        expect(alert).toHaveProperty('icon');
        expect(alert).toHaveProperty('title');
        expect(alert).toHaveProperty('message');
        expect(alert).toHaveProperty('time');
      });
    });

    it('alert categories should match available filter values', () => {
      const validCategories = ALERT_FILTERS.filter(f => f !== 'All');
      ALERTS.forEach(alert => {
        expect(validCategories).toContain(alert.category);
      });
    });

    it('all alert IDs should be unique', () => {
      const ids = ALERTS.map(a => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('SEAT_DATA', () => {
    it('should have all required seat properties', () => {
      expect(SEAT_DATA).toHaveProperty('venue');
      expect(SEAT_DATA).toHaveProperty('seat');
      expect(SEAT_DATA).toHaveProperty('event');
      expect(SEAT_DATA).toHaveProperty('date');
      expect(SEAT_DATA).toHaveProperty('gate');
      expect(SEAT_DATA).toHaveProperty('row');
      expect(SEAT_DATA).toHaveProperty('section');
    });

    it('all seat values should be non-empty strings', () => {
      Object.values(SEAT_DATA).forEach(value => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('NEARBY_AMENITIES', () => {
    it('should have at least 1 amenity', () => {
      expect(NEARBY_AMENITIES.length).toBeGreaterThanOrEqual(1);
    });

    it('every amenity should have name, distance, status, and icon', () => {
      NEARBY_AMENITIES.forEach(amenity => {
        expect(amenity).toHaveProperty('name');
        expect(amenity).toHaveProperty('distance');
        expect(amenity).toHaveProperty('status');
        expect(amenity).toHaveProperty('icon');
      });
    });
  });

  describe('RESTROOM_LOCATIONS', () => {
    it('should have at least 1 restroom', () => {
      expect(RESTROOM_LOCATIONS.length).toBeGreaterThanOrEqual(1);
    });

    it('every restroom should have valid coordinates', () => {
      RESTROOM_LOCATIONS.forEach(rr => {
        expect(rr).toHaveProperty('id');
        expect(rr).toHaveProperty('name');
        expect(typeof rr.x).toBe('number');
        expect(typeof rr.y).toBe('number');
        expect(rr.x).toBeGreaterThanOrEqual(0);
        expect(rr.y).toBeGreaterThanOrEqual(0);
      });
    });

    it('all restroom IDs should be unique', () => {
      const ids = RESTROOM_LOCATIONS.map(r => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('Filter Constants', () => {
    it('STALL_FILTERS should include "All" as first option', () => {
      expect(STALL_FILTERS[0]).toBe('All');
    });

    it('ALERT_FILTERS should include "All" as first option', () => {
      expect(ALERT_FILTERS[0]).toBe('All');
    });
  });
});
