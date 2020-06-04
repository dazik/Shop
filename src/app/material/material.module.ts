import { NgModule } from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    exports: [
        MatDividerModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTabsModule,
    ],
})
export class MaterialModule {}