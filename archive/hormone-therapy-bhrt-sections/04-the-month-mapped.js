  /* ══ THE MONTH WHEEL — a state, not a width (the round-19b lesson) ═══════════════
     The ring layout lives behind .month-armed, which only this script adds, and only
     at ≥760px: no-JS, phones and anything that fails here read the eight as a flowing
     chip row. The FLIP works in both layouts — it is a class toggle, not geometry.
     ⚠️ data-day is the label's midpoint day of 28: D1 at 12 o'clock, clockwise —
     a clock face of one month. data-r is its radius in % of the stage, hand-tuned
     per label because days 24–28 and 1–4 are NEIGHBOURS on the ring and one shared
     radius collides exactly there. */
  {
    const stage = document.querySelector("[data-month]");
    if(stage){
      /* the 28 ticks, drawn once — every 7th longer, the week's own rhythm */
      const g = stage.querySelector(".month-ticks");
      if(g){
        let ticks="";
        for(let d=0; d<28; d++){
          const a=(d/28)*2*Math.PI - Math.PI/2;
          const long = d%7===0;
          const r0=238-(long?14:7), r1=238;
          const x0=320+r0*Math.cos(a), y0=320+r0*Math.sin(a);
          const x1=320+r1*Math.cos(a), y1=320+r1*Math.sin(a);
          ticks+=`<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke-opacity="${long?.42:.20}"/>`;
        }
        g.innerHTML=ticks;
      }
      const labels=[...stage.querySelectorAll(".month-label")];
      labels.forEach(b=>{
        const day=parseFloat(b.dataset.day), r=parseFloat(b.dataset.r);
        const a=(day/28)*2*Math.PI - Math.PI/2;
        b.style.setProperty("--lx",(50+r*Math.cos(a)).toFixed(2)+"%");
        b.style.setProperty("--ly",(50+r*Math.sin(a)).toFixed(2)+"%");
        b.addEventListener("click",()=>b.classList.toggle("flipped"));
      });
      /* ⚠️ 900, NOT 760 — MEASURED. The stage caps at 680px and the outermost label
         (day 9, r=42%) overhangs it by ~70px of its own half-width; at 760 the wrap's
         inner width IS the stage width, so the overhang widened the document by 22px
         (scrollWidth 782 at a 760 viewport — the harness caught it). At 900 the wrap
         leaves ~110px of slack a side and the overhang lands inside it. */
      const wide = matchMedia("(min-width:900px)");
      const arm = () => stage.classList.toggle("month-armed", wide.matches);
      arm();
      (wide.addEventListener?wide.addEventListener("change",arm):wide.addListener(arm));
      /* the assembly — scattered words settle onto the ring as the section arrives.
         Reduced motion and ?probe=1 ship it assembled (the CSS transition is gated
         on the media query; .in is still added so the states match). */
      if("IntersectionObserver" in window){
        const io=new IntersectionObserver(es=>{
          if(es[0].isIntersecting){ stage.classList.add("in"); io.disconnect(); }
        },{threshold:.35});
        io.observe(stage);
      } else stage.classList.add("in");
      if(reduce) stage.classList.add("in");
    }
  }
