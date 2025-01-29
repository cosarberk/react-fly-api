
# React Fly Api

## react-fly-api
Fast communication system based on Axios and React Query for React


React Fly Api is a utility library designed to simplify API interactions in React applications. It leverages `axios` for HTTP requests and `react-query` for state management, offering a dynamic and easy-to-use API solution.

## Features

- **Dynamic API Methods:** Automatically generates `useQuery` and `useMutation` hooks for API endpoints.
- **Axios Integration:** Pre-configured Axios client for flexible and efficient HTTP requests.
- **React Query Support:** Seamless integration with `react-query` for state management and caching.
- **TypeScript Ready:** Full support for TypeScript with strict type definitions.

## Installation

```bash
npm install react-fly-api
```

## Usage

### Step 1: Wrap Your Application with the Provider
To enable `react-query`'s features, wrap your application with the `ReactFlyApiProvider`.

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { ReactFlyApiProvider } from 'react-fly-api';

ReactDOM.render(
  <ReactFlyApiProvider>
    <App />
  </ReactFlyApiProvider>,
  document.getElementById('root')
);
```

### Step 2: Configure APIs
Before using the library, configure your API list and Axios client settings using the `configureApis` function.

```tsx
import { configureApis } from 'react-fly-api';

const apilist = {
  user: [
    { name: 'getUser', method: 'GET', endpoint: '/user' },
    { name: 'createUser', method: 'POST', endpoint: '/user' },
    { name: 'user_info', method: 'POST', endpoint: '/user_info' },

  ],
};

const clientConfig = {
  ssl: true,
  domain: 'api.example.com',
  port: 443,
  prefix: '/v1',
  headers: { Authorization: 'Bearer token' },
};

configureApis(apilist, clientConfig);
```

### Step 3: Use APIs
Use the `useApis` hook to access dynamically generated methods for a specific category.

```tsx
import { useApis } from 'react-fly-api';

function App() {
  const { getUser, user_info } = useApis('user');

  const { data, isLoading } = getUser();
  const { data: infoData, isLoading: infoIsLoading, isError: infoIsError, mutate: infoMutate, isSuccess: infoIsSuccess } = user_info();
  
  const getUserInfo=()=>{
      infoMutate(
            {userid:"custom-id"},
            {
              onSuccess: async (rd: any) => {
              },
              onError: (error: any) => {
                console.log('Error:', error);
              },
            }
          );

  }

  return (
    <div>
      <h1>User Info</h1>
      {isLoading ? <p>Loading...</p> : <pre>{JSON.stringify(data)}</pre>}
      <button onClick={() => getUserInfo("custom-id")}>get User info</button>
    </div>
  );
}

export default App;
```

## API Reference

### `configureApis`
Configures the global API client and API list.

#### Parameters:
- `apilist`: An object defining categories and their API configurations.
- `clientConfig`: (Optional) Axios client configuration. Defaults to the provided default settings.

### `useApis`
Returns dynamically generated API methods for a given category.

#### Parameters:
- `category`: The name of the category (must exist in the configured `apilist`).

#### Returns:
- An object containing `useQuery` and `useMutation` hooks for each API in the category.

## Example Configuration

```typescript
const apilist = {
  product: [
    { name: 'getProducts', method: 'GET', endpoint: '/products' },
    { name: 'createProduct', method: 'POST', endpoint: '/products' },
  ],
};

const clientConfig = {
  ssl: true,
  domain: 'api.example.com',
  port: 443,
  prefix: '/api',
  headers: { Authorization: 'Bearer example-token' },
  timeout: 10000,
};

configureApis(apilist, clientConfig);
```

## License

This project is licensed under the MIT License.
