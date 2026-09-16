(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'), finePointer=matchMedia('(pointer: fine)');
  document.querySelectorAll('.hero, .page-hero').forEach(hero=>{
    let frame;
    hero.addEventListener('pointermove',event=>{
      if(reduced.matches || !finePointer.matches)return;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{const rect=hero.getBoundingClientRect();hero.style.setProperty('--pointer-x',`${(event.clientX-rect.left)/rect.width*100}%`);hero.style.setProperty('--pointer-y',`${(event.clientY-rect.top)/rect.height*100}%`);});
    },{passive:true});
    const reset=()=>{cancelAnimationFrame(frame);hero.style.removeProperty('--pointer-x');hero.style.removeProperty('--pointer-y');};
    hero.addEventListener('pointerleave',reset);reduced.addEventListener('change',reset);
  });
  const explorer=document.querySelector('.hero-explorer'); if(!explorer)return;
  const stages=[
    ['hero','Blue performance car showing precision-crafted automotive bodywork','01 / Engineer','A better part starts with a better plan.','Translate drawings, materials and performance requirements into a practical production plan.'],
    ['expert-craftsmanship','Metalworking sparks during component fabrication','02 / Manufacture','Your specification. Our craftsmanship.','Connect machining and fabrication with careful process control, from the first component to the final batch.'],
    ['quality-assurance','Precision measurement of a manufactured component','03 / Verify','Confidence in every critical detail.','Bring dimensional checks, inspection records and final review together before dispatch.']
  ];
  const buttons=[...explorer.querySelectorAll('[role=tab]')], photo=document.querySelector('.hero-media > img'), panel=explorer.querySelector('[role=tabpanel]');
  let animation;
  function select(index){
    const [image,alt,label,title,description]=stages[index];
    buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
    photo.src=`assets/images/${image}.webp`;photo.alt=alt;
    panel.setAttribute('aria-labelledby',buttons[index].id);panel.querySelector('.stage-label').textContent=label;panel.querySelector('h2').textContent=title;panel.querySelector('p').textContent=description;
    animation?.cancel();if(!reduced.matches)animation=photo.animate([{opacity:.35,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}],{duration:600,easing:'ease-out'});
  }
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>select(index));
    button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%buttons.length;if(event.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;if(next!==undefined){event.preventDefault();select(next);buttons[next].focus();}});
  });
  reduced.addEventListener('change',()=>animation?.cancel());
})();
