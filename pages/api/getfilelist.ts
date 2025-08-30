import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs'

const getFileList =   async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const files = fs.readdirSync('./documents')
        res.status(200).json(files)
    }
}

export default getFileList;