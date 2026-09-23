export function isDemoUri(uri:string){return uri.startsWith('demo://')||uri.startsWith('data:demo')}
export function isDataUri(uri:string){return uri.startsWith('data:')}
export function isUsableImageUri(uri:string){return Boolean(uri)&&!isDemoUri(uri)}
export function fileNameFromUri(uri:string,fallback='scan'){const clean=uri.split('?')[0];const name=clean.split('/').pop()||fallback;return name.replace(/[^a-zA-Z0-9._-]/g,'_')}
