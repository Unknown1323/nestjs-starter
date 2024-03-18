export enum RpcRequestFieldCast {
  Number = 'number',
  Json = 'json',
}

export interface RpcRequestFieldDecoratorConfig<T> {
  cast?: RpcRequestFieldCast
  convertEmpty?: boolean
  defaultValue?: T
}

export interface RpcRequestHeaders {
  traceId: string
}

export interface RpcRequest<PayloadType> {
  headers: RpcRequestHeaders
  user: unknown
  payload: PayloadType
}

export interface RpcResponse<DataType> {
  data: DataType
}

export interface RpcListResponse<DataType> {
  data: DataType[]
  meta: {
    total: number
  }
}
