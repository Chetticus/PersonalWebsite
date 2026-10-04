// Opt-in local diagnostics; nothing is recorded or transmitted in ordinary use.
if(new URLSearchParams(location.search).has('profile')){
  const report={longTasks:[],scrollFrames:0,maxScrollFrameGapMs:0};
  let until=0,last=0,frame=0;
  const publish=()=>{document.documentElement.dataset.performance=JSON.stringify(report);};
  if(PerformanceObserver.supportedEntryTypes.includes('longtask')){
    new PerformanceObserver(list=>{for(const entry of list.getEntries())report.longTasks.push({at:Math.round(entry.startTime),duration:Math.round(entry.duration)});publish();}).observe({type:'longtask',buffered:true});
  }
  function sample(now){frame=0;if(last){report.scrollFrames++;report.maxScrollFrameGapMs=Math.max(report.maxScrollFrameGapMs,Math.round(now-last));}last=now;publish();if(now<until)frame=requestAnimationFrame(sample);else last=0;}
  addEventListener('scroll',()=>{until=performance.now()+700;if(!frame)frame=requestAnimationFrame(sample);},{passive:true});
  publish();
}
