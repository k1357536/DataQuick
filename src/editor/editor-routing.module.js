"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var table_editor_component_1 = require("./table-editor.component");
var ROUTES = [
    { path: '', redirectTo: '/editor', pathMatch: 'full' },
    { path: 'tables', component: table_editor_component_1.TableEditorComponent }
];
var EditorRoutingModule = (function () {
    function EditorRoutingModule() {
        this.Routes = ROUTES;
    }
    return EditorRoutingModule;
}());
EditorRoutingModule = __decorate([
    core_1.NgModule({})
], EditorRoutingModule);
exports.EditorRoutingModule = EditorRoutingModule;
//# sourceMappingURL=editor-routing.module.js.map