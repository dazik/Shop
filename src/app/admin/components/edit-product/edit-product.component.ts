import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { pluck } from 'rxjs/operators';

import { WithRouteData, AppPath, ConfirmationService } from '../../../shared';
import {
    IProduct,
    ProductColors,
    ProductSizes,
    Category,
} from '../../../products';
import { AdminPath } from '../..';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState, ProductActions } from '../../../core/@ngrx';

@Component({
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent extends WithRouteData implements OnInit {
    product: IProduct;
    initialProductSnapshot: string;

    ProductColors = ProductColors;
    ProductSizes = ProductSizes;
    Category = Category;

    constructor(
        private activeRoute: ActivatedRoute,
        private router: Router,
        private confirmation: ConfirmationService,
        private store: Store<IAppState>,
    ) {
        super(activeRoute);
    }

    ngOnInit(): void {
        const activeRoute$ = this.activeRoute.data
            .pipe(pluck('product'))
            .subscribe((product: IProduct) => {
                this.product = { ...product };
                this.initialProductSnapshot = JSON.stringify(product);
            });
        this.subscriptions.push(activeRoute$);
    }

    isProductChanged(): boolean {
        return JSON.stringify(this.product) !== this.initialProductSnapshot;
    }

    onSave() {
        this.store.dispatch(
            ProductActions.updateProduct({
                id: this.product.id,
                product: this.product,
            }),
        );
        this.initialProductSnapshot = JSON.stringify(this.product);
        this.router.navigate([AppPath.Admin, AdminPath.Products]);
    }

    canDeactivate() {
        return this.isProductChanged()
            ? this.confirmation.ask({
                  message:
                      'Are you sure you want to leave this page? All data will be lost',
              })
            : of(true);
    }
}
