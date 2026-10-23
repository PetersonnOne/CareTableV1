import { describe,it,expect,vi,afterEach } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api,internal } from "../convex/_generated/api";
import { LIVE_MODEL,LIVE_SECONDS,preserveVoiceMembers } from "../src/modules/meals/domain/voice-contracts";
const modules=import.meta.glob("../convex/**/*.ts");
async function setup(){const t=convexTest(schema,modules);const [a,b]=await t.run(async ctx=>[await ctx.db.insert("users",{name:"A"}),await ctx.db.insert("users",{name:"B"})]);return {t,a:t.withIdentity({subject:a}),b:t.withIdentity({subject:b})};}
const request={requestId:"voice-request-12345",mode:"interactive" as const,context:'{"favorites":["rice"]}'};
afterEach(()=>vi.unstubAllGlobals());
describe("voice lifecycle and authorization",()=>{
  it("preserves household identities and exclusions and refuses dropped members",()=>{
    const base=[{id:"a",name:"Person A",exclusions:["peanuts"]},{id:"b",name:"Person B",exclusions:["wheat"]}];
    const proposed=[{favorites:["rice"],dislikes:[],exclusions:[],texture:"any" as const}];
    expect(()=>preserveVoiceMembers(base,proposed,()=>"new")).toThrow();
    const merged=preserveVoiceMembers(base,[...proposed,...proposed],()=>"new");
    expect(merged.map(m=>m.exclusions)).toEqual([["peanuts"],["wheat"]]);expect(merged.map(m=>m.id)).toEqual(["a","b"]);
  });
  it("requires authentication before reserving a connection",async()=>{const {t}=await setup();await expect(t.mutation(internal.voice.reserve,request)).rejects.toThrow();});
  it("isolates connection state, stop and preparation from other accounts",async()=>{const {a,b}=await setup();const id=await a.mutation(internal.voice.reserve,request);expect(await b.query(api.voice.state,{id})).toBeNull();await expect(b.mutation(api.voice.stop,{id})).rejects.toThrow();await expect(b.query(internal.voice.owned,{id})).rejects.toThrow();});
  it("prevents duplicate and concurrent starts and preserves uncertain cleanup locks",async()=>{const {a,t}=await setup();const id=await a.mutation(internal.voice.reserve,request);await expect(a.mutation(internal.voice.reserve,request)).rejects.toThrow();await expect(a.mutation(internal.voice.reserve,{...request,requestId:"voice-next-12345"})).rejects.toThrow();await t.mutation(internal.voice.finish,{id,certain:false});await expect(a.mutation(internal.voice.reserve,{...request,requestId:"voice-next-12345"})).rejects.toThrow();await t.mutation(internal.voice.finish,{id,certain:true});expect((await a.query(api.voice.state,{id}))?.status).toBe("closed");});
  it("bounds time and shared daily costs without contacting OpenAI",async()=>{const {a,t}=await setup();await t.run(async ctx=>{await ctx.db.insert("usageBuckets",{key:`voice:global:${new Date().toISOString().slice(0,10)}`,count:12});});await expect(a.mutation(internal.voice.reserve,request)).rejects.toThrow("allowance");expect(LIVE_MODEL).toBe("gpt-live-1");expect(LIVE_SECONDS).toBe(300);});
  it("does not allow discussion mode without an owned saved plan",async()=>{const {a}=await setup();await expect(a.mutation(internal.voice.reserve,{...request,mode:"discussion"})).rejects.toThrow("plan");});
  it("clears handoff context without losing hangup metadata",async()=>{const {a,t}=await setup();const id=await a.mutation(internal.voice.reserve,request);await t.mutation(internal.voice.attach,{id,providerId:"test-provider-id"});await t.mutation(internal.voice.expireContext,{id});const row=await t.query(internal.voice.connection,{id});expect(row?.context).toBe("");expect(row?.providerId).toBe("test-provider-id");});
});
