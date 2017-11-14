import { Table, Folder } from '../../shared/metadata.model';
import { Folders } from '../../shared/metadata.utils';

export abstract class ErrorHandling {
  public errorMsg: string | null = null;

  protected handleError(e: any): void {
    console.error(e);
    if (e.message) {
      this.errorMsg = e.message;
      if (e.error)
        this.errorMsg += ' "' + e.error + '"';
    }
    else
      this.errorMsg = JSON.stringify(e);
  }
}

export function getPath(target: Table | Folder, folders: Folder[]): string {
  let path = '/';
  let current = target.parent;
  const root = Folders.getRoot();

  let i;
  for (i = 0; i < 16; i++) {
    const result = folders.find(f => f.id === current);
    if (result && result.id != root.id) {
      path = '/' + result.name + path;
      current = result.parent;
    }
    else
      break;
  }
  if (i === 16)
    path = '∞' + path;
  return path;
}
