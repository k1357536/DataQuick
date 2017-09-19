import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { AppNavComponent } from './app-nav.component';
import { DashboardComponent } from './dashboard.component';

import { EditorModule } from '../editor/editor.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule,
    NgbModule.forRoot(),
    EditorModule
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
