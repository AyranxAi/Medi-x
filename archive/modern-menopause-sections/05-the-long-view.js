  /* ══ THE LONG VIEW — the bar grows once, and only if motion is welcome ══════════
     The markup ships the bar at its true proportions; .in is what lets the "after"
     half grow into place. Reduced motion and no-JS get the finished picture with no
     growth, which is why the CSS holds the grown state and `:not(.in)` holds the
     collapsed one rather than the other way round. */
  {
    const bar = document.querySelector("[data-lv]");
    if(bar){
      if(reduce || !("IntersectionObserver" in window)) bar.classList.add("in");
      else {
        const io=new IntersectionObserver(es=>{
          if(es[0].isIntersecting){ bar.classList.add("in"); io.disconnect(); }
        },{threshold:.45});
        io.observe(bar);
      }
    }
  }
