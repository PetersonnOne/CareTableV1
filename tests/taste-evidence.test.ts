import {describe,it,expect} from "vitest";
import {compareTaste,evaluationRequest,evaluationScenarios} from "../src/modules/meals/domain/evaluation";
import {assemble,candidates,tasteContribution} from "../src/modules/meals/domain/planning";
import {householdTasteInputs} from "../src/modules/meals/domain/taste-inputs.mjs";
import {recipes} from "../src/modules/meals/domain/catalog.mjs";
import type {TasteEvidence} from "../convex/services/taste";
const taste:TasteEvidence={provider:"Qloo",mode:"live",seeds:[{id:"fixture:italian",name:"Italian"}],unresolved:[],connections:[{id:"fixture:mediterranean",name:"Mediterranean Italian",affinity:0.95}],fetchedAt:"2026-10-26T10:00:00.000Z",message:"Controlled fixture, not live provider data"};
describe("inspectable taste contribution",()=>{
 it("gives the baseline the same authored cuisine mappings before any Qloo affinity is added",()=>{
   const request=evaluationRequest(evaluationScenarios.find(s=>s.id==="indian")!);
   expect(candidates(request,"dinner",[])[0].recipe.id).toBe("tomato-lentil-dal");
 });
 it("does not amplify a cuisine merely because the provider returns synonymous tags",()=>{
   expect(tasteContribution([{id:"one",name:"Nigerian Cuisine",affinity:0.9},{id:"two",name:"Traditional Nigerian",affinity:0.89}])).toBeCloseTo(1.8);
 });
 it("changes rankings without changing eligibility or allowing an excluded ingredient",()=>{
   const request=evaluationRequest({...evaluationScenarios[0],exclusions:["tomato"]});
   const report=compareTaste(request,taste);
   expect(report.sameEligibleSet).toBe(true);expect(report.hardCheckFailures).toBe(0);
   expect(report.rankMovements.every(r=>!recipes.find(p=>p.id===r.recipeId)?.ingredients.some((i:{name:string})=>i.name==="tomato"))).toBe(true);
 });
 it("retains no-change and impossible cases rather than inventing an improvement",()=>{
   const empty={...taste,seeds:[],connections:[],unresolved:["unmatched"]};
   expect(compareTaste(evaluationRequest(evaluationScenarios[0]),empty).changedMealSlots).toBe(0);
   const impossible=compareTaste(evaluationRequest(evaluationScenarios.find(s=>s.noEquipment)!),taste);
   expect(impossible.eligibleCount).toBe(0);expect(impossible.unfilledSlots).toBe(3);expect(impossible.top3OrderChanged).toBe(false);
 });
 it("saves rank and seed evidence with a meal rather than recomputing historical claims in the UI",()=>{
   const request=evaluationRequest(evaluationScenarios[0]);
   const top=candidates(request,"dinner",taste.connections)[0];
   const meal=assemble(request,taste,[{day:1,slot:"dinner",recipeId:top.recipe.id}])[0];
   expect(meal.selectionEvidence?.groundedRank).toBe(1);
   expect(meal.selectionEvidence?.seedNames).toEqual(["Italian"]);
   taste.seeds.push({id:"later",name:"Later input"});
   expect(meal.selectionEvidence?.seedNames).toEqual(["Italian"]);taste.seeds.pop();
   expect(meal.selectionEvidence?.baselineRank).toBeGreaterThan(0);
 });
 it("gives different household members the first chance to contribute a signal",()=>{
   expect(householdTasteInputs([{favorites:["Italian","French","Spanish"]},{favorites:["Chinese"]},{favorites:["Indian"]}])).toEqual(["Italian","Chinese","Indian"]);
   expect(householdTasteInputs([{favorites:["Italian cuisine","Italian","Chinese"]},{favorites:["Italian"]}])).toEqual(["Italian cuisine","Chinese"]);
 });
 it("keeps new cultural choices inspectable and blocks tofu for soy exclusions",()=>{
   const request=evaluationRequest({...evaluationScenarios[0],exclusions:["soy"]});
   expect(candidates(request,"dinner",[{id:"fixture:thai",name:"Thai",affinity:1}]).some(c=>c.recipe.id==="coconut-ginger-tofu")).toBe(false);
   expect(new Set(recipes.map(r=>r.id)).size).toBe(recipes.length);
   expect(recipes.every(r=>r.ingredients.length&&r.steps.length&&r.source.license==="MIT")).toBe(true);
 });
});
