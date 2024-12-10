import { A } from "core";

Bun.serve({
  fetch(req){
    console.log(req.url);
    debugger;
    return new Response(`Hello, world! ${A}`);
  }
})
