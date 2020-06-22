import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IOrder, OrdersService } from '../../orders';
import { AppPath, AuthService } from '../../shared';

@Injectable({
    providedIn: 'root',
})
export class ResolveAdminOrdersGuard implements Resolve<IOrder[] | null> {
    constructor(
        private router: Router,
        private ordersService: OrdersService,
        private authService: AuthService,
    ) {}

    resolve(): Observable<IOrder[] | null> {
        const { userInfo } = this.authService.getAuthData();
        if (!userInfo) {
            this.router.navigate([AppPath.Admin]);
            return of(null);
        }
        return this.ordersService.getAllOrders().pipe(
            tap(orders => {
                if (!orders.length) {
                    this.router.navigate([AppPath.Admin]);
                    return of(null);
                }
            }),
        );
    }
}
