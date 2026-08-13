import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // If data already has success/data structure (e.g. paginated result with meta), just format it
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
           return {
             success: true,
             data: data.data,
             meta: data.meta
           }
        }
        return {
          success: true,
          data,
        };
      }),
    );
  }
}
