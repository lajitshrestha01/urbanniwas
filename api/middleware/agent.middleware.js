const isAgent = (req, res, next) =>{
    if(req.user.role === 'AGENT'){
        return next();

    }
    res.status(403).json({message: "Agent access required"});
};

export default isAgent; 