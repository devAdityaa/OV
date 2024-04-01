const protectedService = require('../services/protectedService.service')
const protectedController = {
   
    setOFA: async(req,res)=>{
        try{
            let token = req.headers.authorization
            if(token){
                if(token.includes('Bearer'))
                token = token.split(' ')[1]
                const setAccounts = await protectedService.setOfAccounts(token, req.body.accounts)
                if(setAccounts!==-1){
                    res.status(200).json({status:'OK', statusCode:100})
                }
                else
                    res.status(500).json({statusCode:99})
            }
        }
        catch(e){
            res.status(500).json({statusCode:99})
        }
    },
    getOFA: async(req,res)=>{
        try{
            let token = req.headers.authorization
            if(token){
                if(token.includes('Bearer'))
                token = token.split(' ')[1]
                const getAccounts = await protectedService.getOfAccounts(token)
                if(getAccounts!==-1){
                    res.status(200).json({accounts:getAccounts.accounts, statusCode:100})
                }
                else
                    res.status(500).json({statusCode:99})
            }
        }
        catch(e){
            res.status(500).json({statusCode:99})
        }
    }
   
}

module.exports = protectedController