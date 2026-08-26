  /* ══ THE LEDGER — the second column arrives ═════════════════════════════════════
     ⚠️ .armed IS ADDED BY SCRIPT AND THE CSS HIDES THE RIGHT COLUMN ONLY WHEN IT IS
     PRESENT. That order matters: the finished state is the DEFAULT, so no-JS, a thrown
     error and reduced motion all render both columns, and the animation is something
     this script opts into rather than something a failure could strand. The reverse
     (hiding in CSS, revealing in JS) has stranded a column on every project that has
     ever tried it. */
  {
    const list = document.querySelector("[data-ledger]");
    if(list){
      if(reduce || !("IntersectionObserver" in window)) list.classList.add("in");
      else {
        list.classList.add("armed");
        const io=new IntersectionObserver(es=>{
          if(es[0].isIntersecting){
            requestAnimationFrame(()=>requestAnimationFrame(()=>list.classList.add("in")));
            io.disconnect();
          }
        },{threshold:.25});
        io.observe(list);
      }
    }
  }
