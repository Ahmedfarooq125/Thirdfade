import { contactApi } from '../server/contact-api.mjs';
export default function handler(req,res) { return contactApi(req,res,()=>{res.statusCode=404;res.end();}); }
