const isAunthenticated = (req, res, next) =>{
    if(req.isAunthenticated()){
        return next();
    }
    res.status(401).json({message: "Authenticated required "});

};

export default isAunthenticated;