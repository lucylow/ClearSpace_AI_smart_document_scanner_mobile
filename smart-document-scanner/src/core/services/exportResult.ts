export function safeExportName(name:string){const trimmed=name.trim().replace(/[^a-zA-Z0-9._-]+/g,'_').replace(/^\.+/,'');return trimmed||'scan'}
export function isValidExportUri(uri:string){return Boolean(uri)&&!uri.startsWith('error:')}
