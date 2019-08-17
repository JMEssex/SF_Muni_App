import { GeoJson } from './geo-json.builder';

describe('GeoJson', () => {
  it('should create an instance', () => {
    expect(new GeoJson(null, null)).toBeTruthy();
  });
});
