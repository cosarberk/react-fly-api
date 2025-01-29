import axios, { AxiosInstance } from 'axios';
import { networkConfigType } from '../types';

let Client: AxiosInstance | null = null; // Dinamik olarak oluşturulan Axios örneği

// Client Yapılandırma Fonksiyonu
export const axiosClient = (config:networkConfigType): AxiosInstance => {
  if (!config || !config.domain || !config.port) {
    throw new Error('Invalid configuration. "domain" and "port" are required.');
  }

  // Network yapılandırmasını dinamik olarak kullan
  const baseURL = `${config.ssl ? 'https' : 'http'}://${config.domain}:${config.port}${config.prefix || ''}`;

  Client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    timeout: config.timeout || 10000, // Varsayılan zaman aşımı
  });

  console.log('Axios Client configured with baseURL:', baseURL);

  // Interceptor'lar
  Client.interceptors.request.use(
    async (reqConfig) => {
      console.log(`Request made to ${reqConfig.url} with method ${reqConfig.method}`);
      return reqConfig;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  Client.interceptors.response.use(
    (response) => {
      console.log(`Response received from ${response.config.url}:`, response.data);
      return response.data; // Kullanıcının doğrudan verilere erişmesini sağla
    },
    (error) => {
      if (error.response) {
        console.error(`Response Error ${error.response.status}:`, error.response.data);
      } else {
        console.error('Network Error:', error.message);
      }
      return Promise.reject(error);
    }
  );
  return Client;
};

// Yardımcı Fonksiyonlar
export const get = (url: any, params = {}) => {
  if (!Client) throw new Error('Axios Client is not configured. Call "configureClient" first.');
  return Client.get(url, { params });
};

export const post = (url: any, data = {}) => {
  if (!Client) throw new Error('Axios Client is not configured. Call "configureClient" first.');
  return Client.post(url, data);
};

export const put = (url: any, data = {}) => {
  if (!Client) throw new Error('Axios Client is not configured. Call "configureClient" first.');
  return Client.put(url, data);
};

export const del = (url: any) => {
  if (!Client) throw new Error('Axios Client is not configured. Call "configureClient" first.');
  return Client.delete(url);
};

export { Client };