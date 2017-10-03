import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppNavComponent } from './app-nav.component';
import { DashboardComponent } from './dashboard.component';

import { ManagerModule } from '../manager/manager.module';
import { DataModule } from '../data/data.module';
import { SetupModule } from '../setup/setup.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ManagerModule,
    DataModule,
    SetupModule
  ],
  declarations: [
    AppComponent,
    AppNavComponent,
    DashboardComponent,
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
  ]
})
export class AppModule { }
