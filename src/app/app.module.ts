import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from './layout';
import { ConstantsService } from './core';
import { APP_CONSTANTS, APP_RANDOM_STRING_5 } from './provider-tokens';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsModule } from './products';
import {
    SharedModule,
    GeneratorFactory,
    GeneratorService,
    LocalStorageService,
} from './shared';
import { RootStoreModule } from './core/@ngrx';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        LayoutModule,
        SharedModule,
        RootStoreModule,
        ProductsModule,
        /**
         * Should be last
         */
        AppRoutingModule,
    ],
    declarations: [AppComponent],
    providers: [
        {
            provide: LocalStorageService,
            useClass: LocalStorageService,
        },
        {
            provide: APP_CONSTANTS,
            useValue: ConstantsService,
        },
        {
            provide: APP_RANDOM_STRING_5,
            useFactory: GeneratorFactory(5),
            deps: [GeneratorService],
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(router: Router) {
        const replacer = (key: string, value: any): string =>
            typeof value === 'function' ? value.name : value;
        console.log('App Routes: ', JSON.stringify(router.config, replacer, 2));
    }
}
