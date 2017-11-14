import { Table, Folder } from '../../shared/metadata.model';

import { MetadataService } from '../services/metadata.service';

export async function exportStructure(metadataService: MetadataService): Promise<string> {
  const data = await Promise.all([
    metadataService.getFolders(),
    metadataService.getTables()]);

  const blob = new Blob(
    [
      JSON.stringify([data[0], data[1]], null, '\t')
    ],
    { type: 'application/json' });

  const a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = 'structure.json';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return `Exported ${data[0].length} folers and ${data[1].length} tables!`;
}

export function importStructure(metadataService: MetadataService, handleError: (e: any) => void) {
  const input = window.document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.hidden = true;

  input.onchange = () => {
    document.body.removeChild(input);
    if (input.files && input.files.length === 1) {
      const file = input.files[0];
      const fr = new FileReader();

      fr.onload = async () => {
        try {
          const result = JSON.parse(fr.result) as [Folder[], Table[]];
          for (let f of result[0])
            await metadataService.importFolder(f);
          for (let t of result[1])
            await metadataService.importTable(t);
        } catch (e) {
          handleError(e);
        }
      }

      fr.readAsText(file);
    }
  };

  document.body.appendChild(input);
  input.click();
}
