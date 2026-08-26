  /* ══ THE IDENTICAL KEY — two skeletons, one slide ════════════════════════════════
     Default CSS is the LOCKED state (coincident), so no-JS ships the proof already
     made. This script ARMS the offset first (no transition), then lets the approach
     transition in when the stage scrolls into view. Reduced motion never arms. */
  {
    const stage = document.querySelector("[data-key]");
    if(stage && !reduce && "IntersectionObserver" in window){
      stage.classList.add("key-armed");
      const io=new IntersectionObserver(es=>{
        if(es[0].isIntersecting){
          /* two frames, so the armed offset is painted before the transition runs */
          requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.add("key-locked")));
          io.disconnect();
        }
      },{threshold:.55});
      io.observe(stage);
    }
  }
