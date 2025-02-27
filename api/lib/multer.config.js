import multer from 'multer'
import path from 'path';
import router from '../routes/post.route';
import { error } from 'console';

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, 'property-' + Date.now() + path.extname(file.originalname));
    }
    
});


const fileFilter = (req, file, cb) =>{
    const filetyps = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);

    }else{
        cb('Error: Images Only');
    }
};

router.post('/upload', (req, res) =>{
    upload(req, res, (err) =>{
        if(err){
            res.status(400).json({error:err});
        }else {
            if(req.file == undefined){
                res.status(400).json({error: 'No file selected'});
            }else {
                const urls = req.file.map(file => `/uploads/${file.filename}`);
                res.json({urls});
            }
        }
    })
})

const upload =multer({
    storage, 
    limits: {fileSize:10000000},
    fileFilter: fileFilter
}).array('images', 7);

export default upload;