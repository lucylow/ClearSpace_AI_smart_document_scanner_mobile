export function shouldAutoCapture(input:{stableMs:number;edgeConfidence:number;blurScore:number}){return input.stableMs>=500&&input.edgeConfidence>=0.85&&input.blurScore>=0.7;}
