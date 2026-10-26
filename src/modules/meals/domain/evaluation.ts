import { candidates, assemble, type PlanRequest } from "./planning";
import { requestSchema } from "./schema.mjs";
import type { TasteEvidence } from "../../../../convex/services/taste";

export const evaluationScenarios = [
  { id:"italian", favorites:["Italian"], exclusions:["peanuts"] },
  { id:"chinese", favorites:["Chinese"], exclusions:["wheat"] },
  { id:"indian", favorites:["Indian"], exclusions:["dairy"] },
  { id:"thai-soy-excluded", favorites:["Thai"], exclusions:["soy"] },
  { id:"mexican", favorites:["Mexican"], exclusions:["eggs"] },
  { id:"nigerian", favorites:["Nigerian"], exclusions:["peanuts"] },
  { id:"mixed-partner", favorites:["Italian","Chinese"], exclusions:["peanuts"], partner:true },
  { id:"unresolved-input", favorites:["caretable-unsupported-cuisine-zz42"], exclusions:["peanuts"] },
  { id:"no-equipment", favorites:["Italian"], exclusions:["peanuts"], noEquipment:true },
];
export function evaluationRequest(scenario: typeof evaluationScenarios[number]): PlanRequest {
  return requestSchema.parse({mode:scenario.partner?"partner":"individual",members:scenario.partner ? scenario.favorites.map((favorite,i)=>({id:`person-${i}`,name:`Fictional person ${i+1}`,favorites:[favorite],dislikes:[],exclusions:scenario.exclusions,texture:"any"})) : [{id:"person-0",name:"Fictional person",favorites:scenario.favorites,dislikes:[],exclusions:scenario.exclusions,texture:"any"}],region:"",currency:"USD",units:"metric",days:3,slots:["dinner"],maxMinutes:45,equipment:scenario.noEquipment?[]:["hob"],budget:null,confirmed:true});
}
function selections(request:PlanRequest,taste:TasteEvidence|null) {
  const used=new Map<string,number>();
  const choices=[];
  for(let day=1;day<=request.days;day++)for(const slot of request.slots){
    const options=candidates(request,slot,taste?.connections||[]).sort((a,b)=>(used.get(a.recipe.id)||0)-(used.get(b.recipe.id)||0)||b.score-a.score||a.recipe.minutes-b.recipe.minutes||a.recipe.id.localeCompare(b.recipe.id));
    if(options[0]){choices.push({day,slot,recipeId:options[0].recipe.id});used.set(options[0].recipe.id,(used.get(options[0].recipe.id)||0)+1);}
  }
  return assemble(request,taste,choices);
}
export function compareTaste(request:PlanRequest,taste:TasteEvidence) {
  const baseline=candidates(request,"dinner",[]),grounded=candidates(request,"dinner",taste.connections);
  const baselineIds=baseline.map(c=>c.recipe.id),groundedIds=grounded.map(c=>c.recipe.id);
  const sameEligibleSet=JSON.stringify([...baselineIds].sort())===JSON.stringify([...groundedIds].sort());
  if(!sameEligibleSet)throw Error("Taste evidence changed the hard-constraint eligible set");
  const baselineMeals=selections(request,null),groundedMeals=selections(request,taste);
  const mapped=grounded.filter(c=>c.tasteLinks.length>0);
  const movements=grounded.map((c,i)=>({recipeId:c.recipe.id,name:c.recipe.name,baselineRank:baselineIds.indexOf(c.recipe.id)+1,groundedRank:i+1,connections:c.tasteLinks}));
  return {
    eligibleCount:baseline.length,sameEligibleSet,
    baselineTop3:baselineIds.slice(0,3),groundedTop3:groundedIds.slice(0,3),
    top3OrderChanged:JSON.stringify(baselineIds.slice(0,3))!==JSON.stringify(groundedIds.slice(0,3)),
    mappedRecipes:mapped.length,rankMovements:movements,
    deterministicBaselinePlan:baselineMeals.map(m=>({day:m.day,slot:m.slot,recipeId:m.recipe?.id||null})),
    deterministicGroundedPlan:groundedMeals.map(m=>({day:m.day,slot:m.slot,recipeId:m.recipe?.id||null})),
    changedMealSlots:groundedMeals.filter((m,i)=>m.recipe?.id!==baselineMeals[i]?.recipe?.id).length,
    hardCheckFailures:[...baselineMeals,...groundedMeals].flatMap(m=>m.checks.results).filter(c=>c.status==="fail").length,
    uniqueGroundedRecipes:new Set(groundedMeals.flatMap(m=>m.recipe?[m.recipe.id]:[])).size,
    unfilledSlots:groundedMeals.filter(m=>!m.recipe).length,
    checksNeedingReview:groundedMeals.flatMap(m=>m.checks.results).filter(c=>c.status==="unknown").length,
  };
}
