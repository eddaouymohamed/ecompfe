


export default class APIFunctionality{
    constructor(query,queryObj){
        this.query=query;
        this.queryObj=queryObj;
    }
    search(){
        const keyword=this.queryObj.keyword ? {
            name:{
                $regex:this.queryObj.keyword,
                $options:'i'
            }
        }:{}
        this.query=this.query.find({...keyword});
        return this;
    }
    filter(){
       const queryObjCopy={...this.queryObj};
       const unwantedFields=["page","keyword","limit"];
       unwantedFields.forEach(unwantedKey=>delete queryObjCopy[unwantedKey]);
       this.query=this.query.find(queryObjCopy);
       return this;
    }
    pagination(resultPerPage){
        const currentPage=Number(this.queryObj.page) || 1
        const skip=resultPerPage*(currentPage -1)
        this.query=this.query.limit(resultPerPage).skip(skip)
        return this


    }
}
