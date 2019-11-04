import API_ENDPOINTS from './api_endpoints.json';
import AUTH_ENDPOINTS from './auth_endpoints.json';
import DATACENTERS from './datacenters.json';

interface Endpoints {
  default: string;
  [region: string]: string;
}

interface Datacenter {
  code: string;
  country: string;
  region?: string;
  subregion?: string;
}

export const getDatacenter = (code: string) =>
  (DATACENTERS as Datacenter[]).find(dc => dc.code === code);

const getEndpoint = (code: string, endpoints: Endpoints) => {
  const datacenter = getDatacenter(code);
  if (datacenter) {
    return (
      endpoints[datacenter.code] ||
      endpoints[datacenter.country] ||
      (datacenter.subregion && endpoints[datacenter.subregion]) ||
      (datacenter.region && endpoints[datacenter.region]) ||
      endpoints.default
    );
  }

  return endpoints.default;
};

export const getAPIEndpoint = (code: string) =>
  getEndpoint(code, API_ENDPOINTS as Endpoints);

export const getAuthEndpoint = (code: string) =>
  getEndpoint(code, AUTH_ENDPOINTS as Endpoints);
