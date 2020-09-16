import { Router } from "./deps.ts";

import planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";

const router = new Router();

router.get("/api", (ctx: any) => {
  ctx.response.body = `
    {___     {__      {_         {__ __        {_       
    {_ {__   {__     {_ __     {__    {__     {_ __     
    {__ {__  {__    {_  {__     {__          {_  {__    
    {__  {__ {__   {__   {__      {__       {__   {__   
    {__   {_ {__  {______ {__        {__   {______ {__  
    {__    {_ __ {__       {__ {__    {__ {__       {__ 
    {__      {__{__         {__  {__ __  {__         {__
                    Mission Control API`;
});

router.get("/api/planets", (ctx: any) => {
  ctx.response.body = planets;
});

router.get("/api/launches", (ctx: any) => {
  ctx.response.body = launches.getLaunches();
});

router.get("/api/launches/:id", (ctx: any) => {
  if (ctx.params?.id) {
    const launchData = launches.getLaunch(Number(ctx.params.id));
    if (launchData) {
      ctx.response.body = launchData;
    } else {
      ctx.throw(400, "Launch with that ID doesn't exist.");
    }
  }
});

router.post("/api/launches", async (ctx: any) => {
  const body = await ctx.request.body();

  launches.addLaunch(body.value);

  ctx.response.body = { success: true };
  ctx.response.status = 201;
});

router.delete("/api/launches/:id", (ctx: any) => {
  if (ctx.params?.id) {
    const deleted = launches.deleteLaunch(Number(ctx.params.id));
    ctx.response.body = { success: deleted };
  }
});

export default router;
