let q = require('./homeQueries');
let Articles = require('../models/articles');

module.exports = {
    index : (req,res) => {
        q.afficherRubriques((r)=>{
            Articles.paginate({}, { page:req.params.page, limit: 4, sort: { date: -1 } }, function(err,result) {
                let pages = [];
                for(i=1; i<=result.pages; i++)
                    pages.push(i)
                pages.sort()
                
                res.render('index',{
                    client:true,
                    rubriques : r,
                    articles : result.docs,
                    showPagination : pages.length > 1,
                    pages : pages,
                    next :  result.page <2 ? parseInt(result.page)+1 : 3,
                    previous : result.page > 1 ? parseInt(result.page)-1 : 1,
                })
            });
        })      
    },

    lire : (req,res) => {
        q.afficherArticle(req.params.id, (r)=>{
            console.log(r)
            res.render('lire',{
                client2 :true,
                article : r
            })
        })
       
    },

    indexVue : (req,res) => {
        q.afficherRubriques((r)=>{
            Articles.paginate({}, { page:req.params.page, limit: 4, sort: { date: -1 } }, function(err,result) {
                let pages = [];
                for(i=1; i<=result.pages; i++)
                    pages.push(i)
                pages.sort()
                
                res.render('index',{
                    client:true,
                    rubriques : r,
                    articles : result.docs,
                    showPagination : pages.length > 1,
                    pages : pages,
                    next :  result.page <2 ? parseInt(result.page)+1 : 3,
                    previous : result.page > 1 ? parseInt(result.page)-1 : 1,
                })
            });
        })      
    }
}

