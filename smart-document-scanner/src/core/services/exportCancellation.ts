export class ExportCancelledError extends Error {
  constructor() {
    super('PDF export cancelled.');
    this.name = 'ExportCancelledError';
  }
}
