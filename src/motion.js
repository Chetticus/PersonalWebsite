// Milliseconds unless a property explicitly specifies a rate.
export const MOTION = Object.freeze({ extraction:200, settle:650, lidClose:600, return:550, spinUp:810, sectionPlay:1375, cover:525, armApproach:250, armLower:810, lightDelay:500, lightReveal:1125, hoverRate:12 });
export const clamp = value => Math.max(0, Math.min(1, value));
export const ease = value => {const t=clamp(value);return t*t*(3-2*t);};

// A scene exit clears the pending start rather than leaving a delayed callback behind.
export class LightingReveal {
  constructor(){this.reset();}
  reset(){this.enteredAt=null;this.startedAt=null;this.level=0;}
  sample(now,inside,reduced=false){
    if(!inside){this.reset();return 0;}
    if(this.enteredAt===null)this.enteredAt=now;
    if(now-this.enteredAt<MOTION.lightDelay)return 0;
    if(this.startedAt===null)this.startedAt=now;
    this.level=reduced?1:ease((now-this.enteredAt-MOTION.lightDelay)/MOTION.lightReveal);
    return this.level;
  }
}
