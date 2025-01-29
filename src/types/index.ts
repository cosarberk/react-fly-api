
export type apiConfigItem ={
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
  }
  
  export type apiConfigtype = {
    [category: string]: apiConfigItem[],
  };


export type networkConfigType = {
    ssl: boolean;
    domain: string;
    port: number;
    ws_port?: number;
    prefix: string;
    headers: Record<string, string>;
    timeout:number;
  };
  