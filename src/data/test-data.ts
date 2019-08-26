import { IBusMap } from './../app/interfaces/map.interface';

export const testData: IBusMap = {
  vehicle: [
    {
      id: '1455',
      lon: '-122.493721',
      routeTag: 'N',
      predictable: 'true',
      speedKmHr: '27',
      dirTag: 'N____O_F00',
      heading: '255',
      lat: '37.760983',
      secsSinceReport: '37'
    }
  ],
  lastTime: {
    time: '1567028104380'
  },
  copyright: 'All data copyright San Francisco Muni 2019.',
  Error: {
    content: 'last time parameter must be specified in query string',
    shouldRetry: 'false'
  }
};
