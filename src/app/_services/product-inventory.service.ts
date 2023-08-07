import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { ProductInventory } from '@app/_models/product-inventory';

@Injectable({ providedIn: 'root' })
export class ProductInventoryService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    getAll(filterDate: any) {
        return this.http.get<ProductInventory[]>(`${environment.apiUrl}/product-inventory/${filterDate}`);
    }

    create(productInventory: ProductInventory) {
        return this.http.post(`${environment.apiUrl}/product-inventory`, productInventory);
    }

    getById(id: string) {
        return this.http.get<ProductInventory>(`${environment.apiUrl}/product-inventory/edit/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/product-inventory/${id}`, params)
            .pipe(map(x => {
                return x;
            }));
    }
}