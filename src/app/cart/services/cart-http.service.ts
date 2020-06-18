import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICartProduct, IBaseCartProduct } from '../models';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'any',
})
export class CartHttpService {
    constructor(private http: HttpClient) {}

    getProduct(id: string): Observable<ICartProduct> {
        return this.http
            .get<IBaseCartProduct>(
                `${environment.apiUrl}/${environment.apiCartPrefix}/${id}`,
            )
            .pipe(map(this.transformBaseProductToProduct));
    }

    getProducts(): Observable<ICartProduct[]> {
        return this.http
            .get<IBaseCartProduct[]>(
                `${environment.apiUrl}/${environment.apiCartPrefix}`,
            )
            .pipe(
                map(products => {
                    return products.map(this.transformBaseProductToProduct);
                }),
            );
    }

    addProduct(product: Omit<ICartProduct, 'id'>): Observable<ICartProduct> {
        return this.http
            .post<IBaseCartProduct>(
                `${environment.apiUrl}/${environment.apiCartPrefix}`,
                this.transformProductToBaseProduct(product),
            )
            .pipe(map(this.transformBaseProductToProduct));
    }

    updateProduct(product: ICartProduct): Observable<ICartProduct> {
        return this.http
            .put<IBaseCartProduct>(
                `${environment.apiUrl}/${environment.apiCartPrefix}/${product.id}`,
                this.transformProductToBaseProduct(product),
            )
            .pipe(map(this.transformBaseProductToProduct));
    }

    deleteProduct(id: string) {
        return this.http.delete(
            `${environment.apiUrl}/${environment.apiCartPrefix}/${id}`,
        );
    }

    private transformProductToBaseProduct({
        quantity,
        cost,
        name,
        description,
        price,
        category,
        colors,
        isAvailable,
        updateDate,
        sizes,
    }: Omit<ICartProduct, 'id'>): Omit<IBaseCartProduct, 'id'> {
        return {
            quantity,
            cost,
            name,
            description,
            price,
            category,
            colors,
            isAvailable,
            updateDate,
            sizes,
        };
    }

    private transformBaseProductToProduct(
        baseProduct: IBaseCartProduct,
    ): ICartProduct {
        return {
            ...baseProduct,
            isSelected: false,
        };
    }
}
