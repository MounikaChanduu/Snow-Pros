import { HttpInterceptorFn } from '@angular/common/http';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsoluteUrl = /^https?:\/\//i.test(req.url);
  const isAssetRequest = req.url.startsWith('assets/') || req.url.startsWith('/assets/');

  if (isAbsoluteUrl || isAssetRequest) {
    return next(req);
  }

  const normalizedUrl = req.url.startsWith('/') ? req.url : `/${req.url}`;
  const token = localStorage.getItem('hotel_booking_token');

  return next(
    req.clone({
      url: `/api${normalizedUrl}`,
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
    })
  );
};
