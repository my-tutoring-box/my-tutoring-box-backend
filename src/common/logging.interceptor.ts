import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

// 모든 API 요청의 응답 시간을 측정하는 미들웨어
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`[${req.method}] ${req.url} — ${Date.now() - now}ms`),
        ),
      );
  }
}
