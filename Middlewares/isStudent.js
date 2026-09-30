import { catchAsync, HandleERROR } from "vanta-api"
const isStudent=catchAsync(async (req,res,next) => {
    if(req.role !== 'student' || !req.userId){
        return next(new HandleERROR('You do not have a permission',401))
    }
    next()
})
export default isStudent