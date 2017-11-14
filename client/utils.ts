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
