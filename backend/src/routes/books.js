const path = require('path');
express=require('express');
const fs = require('fs');
const {authenticateToken}=require('../middleware/auth');
const name_extractor=require('../controller/variables/name_extractor');
router=express.Router();



// Endpoint 1: Auto-scan books folder structure
router.get('/',authenticateToken, (req, res) => {
  const library = {};

  if (!fs.existsSync(req.app.get('path_to_app'))) return res.json({});

  const fields = fs.readdirSync(req.app.get('path_to_app'));

  fields.forEach((field) => {
    const fieldPath = path.join(req.app.get('path_to_app'), field);
    if (fs.statSync(fieldPath).isDirectory()) {
      const files = fs.readdirSync(fieldPath).filter((f) => fs.statSync(path.join(req.app.get('path_to_app'), field,f)).isDirectory());
      library[field] = files.map((file) => ({
        title: file.replace('.pdf', ''),
        id: encodeURIComponent(`${field}/${file}`),
      }));
    }
  });

  res.json(library);
});

// Endpoint 2: Stream PDF file to client
router.get('/file',authenticateToken, (req, res) => {
  let fileRelativePath = req.query.path;
  const filename=name_extractor(fileRelativePath+'.pdf')
  fileRelativePath=fileRelativePath+"/"+filename
  if (!fileRelativePath) return res.status(400).send('Missing file path');

  const safePath = path.normalize(fileRelativePath).replace(/^(\.\.[\/\\])+/, '');
  const absolutePath = path.join(req.app.get('path_to_app'), safePath);

  if (!fs.existsSync(absolutePath)) {
    return res.status(404).send('File not found');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.sendFile(absolutePath);
});

router.get('/cover/:path',(req,res)=>{
  const bookpath=req.params.path
  img_name=name_extractor(bookpath)+".jpg"
  res.sendFile(path.join(req.app.get('path_to_app'), bookpath,img_name))

})

module.exports=router;
