import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Pinecone } from "@pinecone-database/pinecone";
import { updateVectorDB } from "@/utils";

const updateDatabase = async (req: NextApiRequest, res: NextApiResponse) => {
   if(req.method === 'POST'){
      const {indexName,namespace} = JSON.parse(req.body);
      await handleUpload(indexName,namespace,res);
   }
}

const handleUpload = async (indexName:string,namespace:string,res:NextApiResponse) => {
   res.setHeader('Content-Type', 'application/x-ndjson');
   const loader = new DirectoryLoader('./documents',{
      '.pdf': (path: string) => new PDFLoader(path, {
         splitPages: false
      }),
      '.txt': (path: string) => new TextLoader(path)
   });

   const docs = await loader.load();
   const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
   });
   await updateVectorDB(client,indexName,namespace,docs,(filename,totalChunks,chunksUpserted,isComplete)=>{
     if(!isComplete){
       console.log(filename,totalChunks,chunksUpserted,isComplete);
       res.write(
         JSON.stringify({
            filename,
            totalChunks,
            chunksUpserted,
            isComplete
         }) + '\n'
       )
     }
     else {
       res.end();
     }
   })
}

export default updateDatabase;