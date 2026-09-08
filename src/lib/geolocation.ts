// Resolves the device's coordinates into an Indian State / District using
// OpenStreetMap's Nominatim reverse-geocoding service.
//
// Notes:
//  - Browser geolocation requires a secure context (HTTPS or localhost).
//    Over plain HTTP on a LAN address the browser blocks it outright, which
//    is reported back as a specific, actionable error.
//  - Nominatim's usage policy asks for max ~1 request/second. This only ever
//    fires on an explicit button press, so that is satisfied.
//  - Results are a convenience only; State/District stay manually editable
//    because rural reverse-geocoding is not always exact.

export interface ResolvedLocation {
  state: string;
  district: string;
}

export class LocationError extends Error {}

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(
        new LocationError(
          'This browser does not support location detection. Please enter the State and District manually.'
        )
      );
      return;
    }

    // Geolocation is unavailable on insecure origins; surface that clearly
    // rather than letting it fail as a generic permission error.
    if (!window.isSecureContext) {
      reject(
        new LocationError(
          'Location needs a secure (HTTPS) connection. Please enter the State and District manually.'
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        reject(
          new LocationError(
            'Location permission was denied. Please enter the State and District manually.'
          )
        );
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        reject(
          new LocationError(
            'Location is unavailable right now. Please enter the State and District manually.'
          )
        );
      } else {
        reject(
          new LocationError(
            'Could not get your location in time. Please try again or enter it manually.'
          )
        );
      }
    }, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  });
}

interface NominatimAddress {
  state?: string;
  state_district?: string;
  county?: string;
  district?: string;
}

export async function detectStateAndDistrict(): Promise<ResolvedLocation> {
  const position = await getPosition();
  const { latitude, longitude } = position.coords;

  const url =
    `${NOMINATIM_ENDPOINT}?format=jsonv2&zoom=10&addressdetails=1` +
    `&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;

  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch {
    throw new LocationError(
      'Could not reach the location service. Check your internet connection or enter it manually.'
    );
  }

  if (!response.ok) {
    throw new LocationError(
      'The location service did not respond. Please enter the State and District manually.'
    );
  }

  const data = (await response.json()) as { address?: NominatimAddress };
  const address = data.address;

  if (!address) {
    throw new LocationError(
      'Could not identify your area. Please enter the State and District manually.'
    );
  }

  // Indian districts surface under different keys depending on the region.
  const district =
    address.state_district ?? address.county ?? address.district ?? '';
  const state = address.state ?? '';

  if (!state && !district) {
    throw new LocationError(
      'Could not identify your State or District. Please enter them manually.'
    );
  }

  return { state, district };
}
