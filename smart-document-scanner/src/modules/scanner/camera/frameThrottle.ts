export function createFrameThrottle(intervalMs:number){let last=0;return ()=>{const now=Date.now();if(now-last<intervalMs)return false;last=now;return true;};}
