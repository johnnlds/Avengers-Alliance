"use strict";
const chapterTitle=document.getElementById("chapterTitle");
const chapterCount=document.getElementById("chapterCount");
const previousButton=document.getElementById("previousChapter");
const nextButton=document.getElementById("nextChapter");
const missionGrid=document.getElementById("missionGrid");
let chapter=1;
function renderChapter(){
 chapterTitle.replaceChildren();
 chapterTitle.append(document.createTextNode("Chapter "+chapter+" "));
 if(chapter===1){const title=document.createElement("span");title.textContent="The Pulse";chapterTitle.appendChild(title);}
 chapterCount.textContent="Chapter "+chapter+"/10";
 previousButton.disabled=chapter===1;nextButton.disabled=chapter===10;
 missionGrid.replaceChildren();
 for(let i=1;i<=6;i++){
  const slot=document.createElement("article");slot.className="mission-slot "+(chapter===1&&i===1?"unlocked":"locked");
  const box=document.createElement("div");box.className="mission-box";
  if(chapter===1&&i===1){
   const number=document.createElement("span");number.className="mission-number";number.textContent="01";box.appendChild(number);
   const play=document.createElement("button");play.className="play-mission";play.type="button";play.textContent="Play Mission";
   play.addEventListener("click",()=>{ /* Story mission launch will be connected in a later step. */ });
   slot.append(box,play);
  }else{
   const lock=document.createElement("span");lock.className="lock";lock.setAttribute("aria-label","Locked");lock.textContent="🔒";box.appendChild(lock);slot.appendChild(box);
  }
  missionGrid.appendChild(slot);
 }
}
previousButton.addEventListener("click",()=>{if(chapter>1){chapter--;renderChapter();}});
nextButton.addEventListener("click",()=>{if(chapter<10){chapter++;renderChapter();}});
renderChapter();