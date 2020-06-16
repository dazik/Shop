import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';
import { pluck, catchError } from 'rxjs/operators';

import {
    SnakeService,
    AppPaths,
    HOVER_BACKGROUND_COLOR,
    ISelectableEntity,
    OrderByPipe,
    WithRouteData,
} from '../../../shared';
import {
    IOrder,
    IOrderSortByField,
    IOrderSortByFieldId,
    ISelectableOrder,
} from '../../models';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';
import { OrdersService } from '../../services';
import { OrdersPaths } from '../../orders.constants';

@Component({
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent extends WithRouteData implements OnInit {
    orders: ISelectableOrder[] = [];
    HOVER_BACKGROUND_COLOR = HOVER_BACKGROUND_COLOR;
    sortByFields: IOrderSortByField[] = [
        { id: 'date', name: 'Date' },
        { id: 'cost', name: 'Cost' },
        { id: 'quantity', name: 'Quantity' },
    ];
    isDescOrder = true;
    isCheckAllSelected = false;

    private activeSortByFieldId: IOrderSortByFieldId = 'date';

    constructor(
        private activeRoute: ActivatedRoute,
        private router: Router,
        private snake: SnakeService,
        private orderService: OrdersService,
        private orderBy: OrderByPipe,
    ) {
        super(activeRoute);
    }

    ngOnInit(): void {
        const activeRoute$ = this.activeRoute.data
            .pipe(
                pluck('orders'),
                catchError(() => {
                    this.snake.show({ message: 'Something went wrong' });
                    this.router.navigate([AppPaths.Orders]);
                    return of(null);
                }),
            )
            .subscribe((orders: IOrder[] | null) => {
                this.orders = orders.map(order => ({
                    ...order,
                    isSelected: false,
                }));
            });
        this.subscriptions.push(activeRoute$);
    }

    onToggleCheckAll(event: MatCheckboxChange) {
        if (event.checked) {
            this.checkAllOrders();
        } else {
            this.unCheckAllOrders();
        }
    }

    checkAllOrders() {
        this.orders = this.orders.map(order => {
            order.isSelected = true;
            return order;
        });
    }

    unCheckAllOrders() {
        this.orders = this.orders.map(order => {
            order.isSelected = false;
            return order;
        });
    }

    onSelectOrderBy(sortByField: MatSelectChange) {
        this.activeSortByFieldId = this.sortByFields.find(
            field => field.id === sortByField.value,
        )?.id;
    }

    get sortBy(): IOrderSortByFieldId {
        return this.activeSortByFieldId;
    }

    set sortBy(sortBy: IOrderSortByFieldId) {
        this.activeSortByFieldId = sortBy;
    }

    onToggleOrder() {
        this.isDescOrder = !this.isDescOrder;
    }

    onNavigateToOrderDetails(order: IOrder) {
        this.router.navigate([
            AppPaths.Orders,
            OrdersPaths.OrderDetails,
            order.id,
        ]);
    }

    isSomeItemSelected(): boolean {
        return this.orders.some(order => order.isSelected);
    }

    removeSelectedItems() {
        const itemsToRemove = this.orders.filter(product => product.isSelected);

        itemsToRemove.map(({ id }) => this.orderService.removeOrder(id));
        this.isCheckAllSelected = false;
        if (itemsToRemove.length === this.orders.length) {
            this.router.navigate([AppPaths.ProductsList]);
        }
    }

    trackBy(_, order?: IOrder & ISelectableEntity) {
        return order
            ? `${order.id}${order.quantity}${order.isSelected}`
            : undefined;
    }

    getSortedOrders() {
        return this.orderBy.transform(
            this.orders,
            this.activeSortByFieldId,
            this.isDescOrder,
        );
    }

    getSelectedOrders(): ISelectableOrder[] {
        return this.orders.filter(({ isSelected }) => isSelected);
    }

    getRejectButtonText(): string {
        return this.getSelectedOrders().length > 1
            ? 'Reject Orders'
            : 'Reject Order';
    }
}