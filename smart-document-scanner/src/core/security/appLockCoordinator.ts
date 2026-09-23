type Listener=()=>void
const listeners=new Set<Listener>()
export function onLockRequested(listener:Listener){listeners.add(listener);return()=>listeners.delete(listener)}
export function requestImmediateLock(){listeners.forEach(listener=>listener())}
