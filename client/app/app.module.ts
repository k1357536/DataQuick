import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { ManagerModule } from '../manager/manager.module';
import { DataModule } from '../data/data.module';
import { SetupModule } from '../setup/setup.module';

import { AppComponent } from './app.component';
import { AppNavComponent } from './app-nav.component';
import { DashboardComponent } from './dashboard.component';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ManagerModule,
    DataModule,
    SetupModule
  ],
  declarations: [
    AppComponent,
    AppNavComponent,
    DashboardComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
