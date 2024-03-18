import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { isObject } from 'class-validator'
import { Observable, throwError } from 'rxjs'

import { RpcRequest } from 'src/core/interfaces/rpc'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  protected readonly logger = new Logger('Exception')

  catch(
    exception: (Error | HttpException | RpcException) & { statusCode?: number },
    host: ArgumentsHost,
  ): Observable<unknown> {
    const { headers, user } = this.getRequestFromContext(host)

    if (exception.message && exception.statusCode) {
      this.logger.error({ headers, user, exception })

      return this.buildResponseFromContext(host, exception)
    }

    const httpException = <HttpException>exception

    if (httpException.getResponse) {
      const res = httpException.getResponse()

      const error = isObject(res) ? res : { message: res }

      this.logger.error({ headers, user, error })

      return this.buildResponseFromContext(host, {
        statusCode: httpException.getStatus(),
        ...error,
      })
    }

    const stack = exception.stack || undefined

    this.logger.error({ headers, user, exception, stack })

    return this.buildResponseFromContext(host, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    })
  }

  private getRequestFromContext(host: ArgumentsHost): RpcRequest<unknown> {
    const contextType = host.getType()

    switch (contextType) {
      case 'http':
        return host.switchToHttp().getRequest()
      case 'rpc':
        return host.switchToRpc().getData()
      case 'ws':
        return host.switchToWs().getData()
      default: {
        const unhandledType: never = contextType

        throw new BadRequestException(`Unhandled execution context type ${unhandledType}`)
      }
    }
  }

  private buildResponseFromContext(host: ArgumentsHost, response: unknown): Observable<unknown> {
    const contextType = host.getType()

    switch (contextType) {
      case 'http':
        return host
          .switchToHttp()
          .getResponse()
          .status((<{ statusCode: number }>response)?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
          .json(response)
      case 'rpc':
      case 'ws':
        return throwError(() => response)
      default: {
        const unhandledType: never = contextType

        throw new BadRequestException(`Unhandled execution context type ${unhandledType}`)
      }
    }
  }
}
