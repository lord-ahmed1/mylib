function name_extractor(path){
    const splitted=path.split('/')
    return splitted[splitted.length-1]
}

module.exports=name_extractor