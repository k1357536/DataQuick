import { StringConstraint, NumberConstraint, DateConstraint, FKConstraint } from '../../shared/metadata.model';
import { Columns, Folders } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

interface TestData {
  age: number,
  name: string,
  date_of_birth: Date,
  executive: boolean,
  image: Buffer | null,
  salary: number,
  liter: number,
  completeness: number,
  ref: number
};

export async function create(metadataService: MetadataService): Promise<string> {
  await metadataService.addFolder('Test Folder', Folders.getRoot());

  const f = (await metadataService.getFolders()).find(f => f.name === 'Test Folder');

  if (f == null)
    throw new Error('Error getting folder!');

  await metadataService.addTable('Test', f);

  const tbl = (await metadataService.getTables()).find(tbl => tbl.name === 'Test');

  if (tbl == null)
    throw new Error('Error getting table!');

  tbl.columns[0].inSummary = false;

  tbl.columns.push(Columns.create('Age', 'INT',
    {
      notNull: true,
      unique: false,
      min: 1,
      max: 120
    } as NumberConstraint));

  tbl.columns.push(Columns.create('Name', 'STRING',
    {
      notNull: true,
      unique: true,
      maxLength: 30,
      regExp: '^[a-zA-Z0-9 ]*$'
    } as StringConstraint,
    true));

  tbl.columns.push(Columns.create('Date of Birth', 'DATE',
    {
      notNull: false,
      unique: false,
      min: new Date(1900, 1, 1),
      max: new Date(2018, 1, 1)
    } as DateConstraint));

  tbl.columns.push(Columns.create('Executive', 'BOOL',
    {
      notNull: true,
      unique: false
    }));

  tbl.columns.push(Columns.create('Image', 'IMAGE',
    {
      notNull: false,
      unique: false
    }));

  tbl.columns.push(Columns.create('Salary', 'MONEY',
    {
      notNull: true,
      unique: false,
      min: 100,
      max: 1000000
    } as NumberConstraint));

  tbl.columns.push(Columns.create('Liter', 'REAL',
    {
      notNull: true,
      unique: false,
      min: 0.5,
      max: 3.5
    } as NumberConstraint));

  tbl.columns.push(Columns.create('Completeness', 'PERCENT',
    {
      notNull: true,
      unique: false,
      min: 0,
      max: 2
    } as NumberConstraint));

  tbl.columns.push(Columns.create('Ref', 'FK',
    {
      notNull: true,
      unique: false,
      target: tbl.id
    } as FKConstraint));

  await metadataService.updateTable(tbl);

  return 'Create successful!';
}

export async function insert(metadataService: MetadataService, dataService: DataService): Promise<string> {
  const tbl = (await metadataService.getTables()).find(tbl => tbl.name === 'Test');

  if (tbl == null)
    throw new Error('Error getting table!');

  for (let i = 0; i < 20; i++) {
    const data: TestData = {
      name: 'Michael ' + String.fromCharCode(20 * Math.random() + 'a'.charCodeAt(0)) + i,
      age: Math.floor(50 * Math.random()) + 20,
      date_of_birth: new Date(),
      executive: Math.random() > 0.3,
      image: null,
      salary: Math.random() * 5000 + 1000,
      liter: Math.random() * 2 + 1,
      completeness: Math.random(),
      ref: Math.min(Math.floor(Math.random() * (i + 1)) + 1, i + 1)
    };
    await dataService.add(tbl.id, data);
  }

  return 'Insert successful!';
}
