"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const meals = [
  {src:"caretable-hero-meal.png",title:"A thoughtfully filled plate",alt:"Roasted vegetables, grains and herbs on a ceramic plate."},
  {src:"caretable-stew.png",title:"A bowl of comfort",alt:"Golden lentil and vegetable stew with carrots, greens and bread."},
  {src:"caretable-rice.png",title:"Familiar flavours, shared joy",alt:"Tomato rice with chicken, colourful peppers, peas and lime."},
  {src:"caretable-pasta.png",title:"Simple pleasures, made with care",alt:"Spiral pasta with roasted tomatoes, courgette, spinach and basil."},
  {src:"caretable-breakfast.png",title:"A gentle start to the day",alt:"Creamy oatmeal topped with banana, strawberries and blueberries."},
];
export function MealCarousel() {
  const [index,setIndex]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!media.matches);
    const change=()=>setPlaying(!media.matches);
    media.addEventListener("change",change);
    return ()=>media.removeEventListener("change",change);
  },[]);
  useEffect(()=>{
    if(!playing||hovered||focused)return;
    const timer=window.setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%meals.length);},6000);
    return ()=>window.clearInterval(timer);
  },[playing,hovered,focused,index]);
  function select(next:number){setPlaying(false);setIndex((next+meals.length)%meals.length);}
  return <section className="hero-meal meal-carousel" aria-label="Food inspiration" aria-roledescription="carousel" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
    <div className="meal-carousel-frame">
      {meals.map((meal,i)=><div key={meal.src} className={`meal-slide${i===index?" is-active":""}`} aria-hidden={i!==index} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${meals.length}`}>
        <Image className="hero-meal-image" src={`/images/${meal.src}`} alt={meal.alt} fill sizes="(max-width: 650px) 88vw, 45vw" preload={i===0} />
      </div>)}
      <div className="meal-caption"><span aria-hidden="true">♡</span><p>{meals[index].title}<small>Made around your people.</small></p></div>
    </div>
    <div className="carousel-controls">
      <button type="button" aria-label="Previous food image" onClick={()=>select(index-1)}>←</button>
      <div className="carousel-dots" role="group" aria-label="Choose food image">{meals.map((meal,i)=><button type="button" key={meal.src} aria-label={`Show image ${i+1}: ${meal.title}`} aria-pressed={i===index} onClick={()=>select(i)}><span /></button>)}</div>
      <button type="button" aria-label="Next food image" onClick={()=>select(index+1)}>→</button>
      <button type="button" className="carousel-play" onClick={()=>setPlaying(p=>!p)} aria-label={playing?"Pause slideshow":"Play slideshow"}>{playing?"Pause":"Play"}</button>
    </div>
    <p className="sr-only" aria-live={playing?"off":"polite"}>{index+1} of {meals.length}: {meals[index].title}</p>
    <p className="carousel-note">A little inspiration. Images are illustrative, not your generated meal plan.</p>
  </section>;
}
