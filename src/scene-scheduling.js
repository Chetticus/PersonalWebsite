// Give input, layout, and paint a turn between preparation stages.
export function yieldToBrowser(){
  if(globalThis.scheduler?.yield)return scheduler.yield();
  return new Promise(resolve=>setTimeout(resolve,0));
}

export function afterFirstPaint(){
  return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
}
