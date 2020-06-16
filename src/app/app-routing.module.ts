import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PathNotFoundComponent } from './layout';
import { AuthGuard } from './core/guards/auth.guard';
import { AppPath } from './shared';
import { AdminGuard } from './admin/guards';

export const appRoutes: Routes = [
    {
        path: AppPath.Cart,
        loadChildren: () =>
            import('./cart/cart.module').then(m => m.CartModule),
        canActivate: [AuthGuard],
    },
    {
        path: AppPath.Orders,
        loadChildren: () =>
            import('./orders/orders.module').then(m => m.OrdersModule),
        canActivate: [AuthGuard],
    },
    {
        path: AppPath.Admin,
        loadChildren: () =>
            import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [AdminGuard, AuthGuard],
    },
    {
        path: AppPath.Empty,
        redirectTo: AppPath.ProductsList,
        pathMatch: 'full',
    },
    {
        // The router will match this route if the URL requested
        // doesn't match any Path for routes defined in our configuration
        path: '**',
        component: PathNotFoundComponent,
    },
];

function RouterErrorHandler(error) {
    console.log(error);
}

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            errorHandler: RouterErrorHandler,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
