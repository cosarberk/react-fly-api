import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../axios';
import { apiConfigtype, networkConfigType } from '../types';
import { AxiosInstance } from 'axios';

// Global değişkenler
let globalClient: ReturnType<typeof axiosClient>;
let globalApiList: apiConfigtype;

const defaultClientConfig: networkConfigType = {
  ssl: false,
  domain: 'localhost',
  port: 80,
  prefix: 'api/v1',
  headers: {
     'Content-Type': 'application/json'
  },
  timeout: 15000,
};

/**
 * Configures the global API client and API list for use in the application.
 *
 * This function should be called once during application initialization
 * to set up the Axios client and API configurations. These configurations
 * will be used by the `useApis` hook.
 *
 * @param {apiConfigtype} apilist - The API configuration object, where keys are categories and values are arrays of API endpoints.
 * @param {networkConfigType} [clientConfig=defaultClientConfig] - Optional Axios client configuration. Defaults to `defaultClientConfig`.
 * 
 * @example
 * const apilist = {
 *   user: [
 *     { name: 'getUser', method: 'GET', endpoint: '/user' },
 *     { name: 'user_info', method: 'POST', endpoint: '/user_info' },
 *   ],
 * };
 * const clientConfig = {
 *   ssl: true,
 *   domain: 'api.example.com',
 *   port: 443,
 *   prefix: '/v1',
 *   headers: { Authorization: 'Bearer token' },
 * };
 * configureApis(apilist, clientConfig);
 */
export const configureApis = (apilist: apiConfigtype, clientConfig: networkConfigType = defaultClientConfig) => {
  globalClient = axiosClient(clientConfig); 
  globalApiList = apilist; 
};

export const configureApisAndClient = (apilist: apiConfigtype, client:AxiosInstance ) => {
  globalClient = client; 
  globalApiList = apilist; 
};

type ApiCategory = keyof typeof globalApiList;


/**
 * A React hook that generates API methods for a given category.
 *
 * This hook relies on the global API configurations set up using `configureApis`.
 * It provides query and mutation methods for the specified category in the API configuration.
 *
 * @param {ApiCategory} category - The category of APIs to retrieve. Must match one of the keys in the configured API list.
 * @returns {Record<string, Function>} An object containing dynamically generated API methods.
 *
 * @throws {Error} If `configureApis` was not called before using this hook.
 *
 * @example
 * const { user_info, createUser } = useApis('user');
 * 
 * // Example usage
 *   const { data: infoData, isLoading: infoIsLoading, isError: infoIsError, mutate: infoMutate, isSuccess: infoIsSuccess } = user_info();
 *   infoMutate(
 *     {},
 *     {
 *       onSuccess: async (rd: any) => {
 *       },
 *       onError: (error: any) => {
 *         console.log('Error:', error);
 *       },
 *     }
 *   );
 */
export const useApis = (category: ApiCategory) => {
    const queryClient = useQueryClient();

    if (!queryClient) {
      throw new Error(
        'ReactFlyApiProvider is missing. Please wrap your application with ReactFlyApiProvider.'
      );
    }

  if (!globalClient || !globalApiList) {
    throw new Error('APIs are not configured. Call "configureApis" before using "useApis".');
  }

  const apiMethods: Record<string, any> = {};

  const configList = globalApiList[category];
  if (!configList) {
    console.warn(`No configuration found for category: ${category}`);
    return apiMethods;
  }

  configList.forEach(config => {
    if (config.method === 'GET') {
      apiMethods[config.name] = () =>
        useQuery({
          queryKey: [category, config.name],
          queryFn: async () => {
            const { data } = await globalClient.get(config.endpoint);
            return data;
          },
        });
    } else if (config.method === 'POST') {
      apiMethods[config.name] = () =>
        useMutation({
          mutationFn: async (body: any) => {
            const { data } = await globalClient.post(config.endpoint, body);
            return data;
          },
        });
    } else if (config.method === 'PUT') {
      apiMethods[config.name] = () =>
        useMutation({
          mutationFn: async (body: any) => {
            const { data } = await globalClient.put(config.endpoint, body);
            return data;
          },
        });
    } else if (config.method === 'DELETE') {
      apiMethods[config.name] = () =>
        useMutation({
          mutationFn: async (id: string) => {
            await globalClient.delete(`${config.endpoint}/${id}`);
          },
        });
    }
  });

  return apiMethods;
};