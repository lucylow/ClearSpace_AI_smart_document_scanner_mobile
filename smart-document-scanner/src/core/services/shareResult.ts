export function canSharePdf(uri:string,platform:'web'|'ios'|'android'){return Boolean(uri)&&uri.startsWith('file:')||Boolean(uri)&&uri.startsWith('data:application/pdf')||platform==='web'&&Boolean(uri)}
export function shareFailureMessage(uri:string){return uri?'Unable to open the share sheet for this PDF.':'The PDF was not created, so it cannot be shared.'}
