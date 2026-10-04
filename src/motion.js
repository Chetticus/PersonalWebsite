// Milliseconds unless a property explicitly specifies a rate.
export const MOTION = Object.freeze({ extraction:230, settle:750, lidClose:690, return:630, spinUp:930, sectionPlay:1580, cover:605, armApproach:290, armLower:1550, tonearmRate:6.3, lightDelay:500, lightReveal:1295, hoverRate:10.5 });
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
