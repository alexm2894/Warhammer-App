import catalogue from "@/data/catalogue.json";
export function GET() { return Response.json({units: catalogue}, {headers: {"Cache-Control": "no-store"}}); }
