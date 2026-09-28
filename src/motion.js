// Milliseconds unless a property explicitly specifies a rate.
export const MOTION = Object.freeze({ extraction:180, settle:620, return:430, spinUp:900, introductionPlay:2500, sectionPlay:700, autoScroll:1250, cover:480, lightDelay:500, lightReveal:900, hoverRate:12 });
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
