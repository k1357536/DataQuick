import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ServicesModule } from '../services/services.module';

import { FoldersComponent } from './folders.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    ServicesModule
  ],
  declarations: [
    FoldersComponent
  ],
})
export class FoldersModule { }
