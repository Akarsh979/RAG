import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";

export async function updateVectorDB(
   client: Pinecone,
   indexName: string,
   namespace: string,
   docs: Document[],
   progressCallback: (filename:string, totalChunks:number, chunksUpserted:Number,isComplete: boolean)=>void
){

}