interface IVehicle {
  id: string;
  lon: string;
  routeTag: string;
  predictable: string;
  speedKmHr: string;
  dirTag: string;
  heading: string;
  lat: string;
  secsSinceReport: string;
}

interface ILastTime {
  time: string;
}

interface IError {
  content: string;
  shouldRetry: string;
}

export interface IBusMap {
  vehicle: IVehicle[];
  lastTime: ILastTime;
  copyright: string;
  Error: IError; // NOTE: The key of `Error` has an Uppercase `E`
}
