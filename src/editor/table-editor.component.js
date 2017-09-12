"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var ColumnType = (function () {
    function ColumnType() {
    }
    return ColumnType;
}());
var AUTO = { id: 0, name: "Auto Increment", SQL: "INT AUTO INCREMENT" }, NUMBER = { id: 1, name: "Number", SQL: "INT" }, STRING = { id: 2, name: "Text", SQL: "STRING" }, DATE = { id: 3, name: "Date", SQL: "DATE" }, BOOL = { id: 4, name: "Yes/No", SQL: "BOOLEAN" };
var Column = (function () {
    function Column() {
        this.name = "";
        this.type = STRING;
        this.readonly = false;
        this.key = false;
    }
    return Column;
}());
var TableEditorComponent = (function () {
    function TableEditorComponent() {
        this.tableName = "Table 1";
        this.tableSQL = "";
        this.columnTypes = [
            AUTO,
            NUMBER,
            STRING,
            DATE,
            BOOL
        ];
        this.columns = [{
                name: "Id",
                type: AUTO,
                readonly: true,
                key: true,
            }];
    }
    TableEditorComponent.prototype.add = function () {
        var c = new Column();
        this.columns.push(c);
    };
    TableEditorComponent.prototype.changeType = function (col, type) {
        col.type = this.columnTypes[type];
        console.log(col);
    };
    TableEditorComponent.prototype.save = function () {
        this.tableSQL = "CEATE TABLE \"" + this.tableName + "\" (";
        var b = false;
        for (var _i = 0, _a = this.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (b)
                this.tableSQL += ", ";
            this.tableSQL += col.name + " ";
            if (col.key)
                this.tableSQL += "PRIMARY KEY ";
            this.tableSQL += col.type.SQL;
            b = true;
        }
        this.tableSQL += ");";
    };
    return TableEditorComponent;
}());
TableEditorComponent = __decorate([
    core_1.Component({
        selector: 'table-editor',
        templateUrl: './table-editor.component.html'
    })
], TableEditorComponent);
exports.TableEditorComponent = TableEditorComponent;
//# sourceMappingURL=table-editor.component.js.map