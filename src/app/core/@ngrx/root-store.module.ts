import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { ProductsStoreModule } from './products';
import { environment } from '../../../environments/environment';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forRoot(
            {},
            {
                runtimeChecks: {
                    strictStateImmutability: true, // default value is true
                    strictActionImmutability: true, // default value is true
                    strictStateSerializability: true, // default value is false
                    strictActionSerializability: true, // default value is false
                    strictActionWithinNgZone: true, // default value is false
                },
            },
        ),
        EffectsModule.forRoot([]),
        ProductsStoreModule,
        // Instrumentation must be imported after importing StoreModule (config is optional)
        !environment.production ? StoreDevtoolsModule.instrument() : [],
    ],
})
export class RootStoreModule {}
