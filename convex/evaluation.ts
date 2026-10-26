"use node";
import { internalAction } from "./_generated/server";
import { discoverTaste } from "./services/taste";
import { householdTasteInputs } from "../src/modules/meals/domain/taste-inputs.mjs";
import { evaluationScenarios, evaluationRequest, compareTaste } from "../src/modules/meals/domain/evaluation";
import { recipes } from "../src/modules/meals/domain/catalog.mjs";
import { mappings } from "../src/modules/meals/domain/planning";
import { createHash } from "node:crypto";

// Operator-only; never exposed as an anonymous paid-provider endpoint.
export const compare = internalAction({
  args:{},
  handler:async()=>{
    const results=[];
    for(const scenario of evaluationScenarios){
      const request=evaluationRequest(scenario);
      try {
        const taste=await discoverTaste(householdTasteInputs(request.members));
        results.push({id:scenario.id,status:"completed",favorites:scenario.favorites,exclusions:scenario.exclusions,equipment:request.equipment,taste,comparison:compareTaste(request,taste)});
      }catch(e){results.push({id:scenario.id,status:"unavailable",error:e instanceof Error?e.message:"Provider unavailable"});}
    }
    return {evaluatedAt:new Date().toISOString(),method:"Live Qloo evidence versus no Qloo evidence; fixed eligible catalog and constraints; baseline includes the same known cuisine mappings; deterministic ranking and least-used-first plan control. No LLM calls, no generic-LLM benchmark, no user preference or clinical outcome measurement.",rankingPolicy:"direct recipe/tag mapping matches + 2 times strongest mapped affinity - 3 times dislike matches; least-used-first deterministic plan control",queryPolicy:"place-genre namespace; retain dining/cuisine IDs only; at most 40 returned tags",mappingSha256:createHash("sha256").update(JSON.stringify(mappings)).digest("hex"),catalogCount:recipes.length,catalogSha256:createHash("sha256").update(JSON.stringify(recipes)).digest("hex"),results};
  },
});
