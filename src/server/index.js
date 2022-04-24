const express = require('express');
const bodyParser = require('body-parser');
const { post } = require('request-promise');
const request = require('request-promise');
const cors = require('cors');
const app = express();
app.use( bodyParser.urlencoded({extended: true}) );
app.use(bodyParser.json());
app.use(cors({
    origin:['http://localhost:8080'],   // 指定接收的地址
    methods:['GET','POST'],     //指定接收的请求类型
    allowedHeaders:['Content-Type','Authorization'] // 指定header
}))
var access_token = null;

let options1 = {
    method:'get',
    uri:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx7c35fbee23f4debd&secret=48a807f11669321257a4358e3cd2732c',
    json:true
}
request(options1).then(data => {
    access_token = data.access_token;
    app.get('/secondHand',(req,res) => {
        var secondHandAllData = [];
        (async function getsecondHandAllData() { 
            let options2 = {
                method:'post',
                uri:'https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token,
                body:{
                    "env":'xiaoliu-k8902',
                    "query":"db.collection(\"fabu\").limit("+ 20 +").skip("+ secondHandAllData.length +").get()"
                },
                json:true
            }
            var data = await request(options2);
            data.data.forEach(item => {
                secondHandAllData.push(JSON.parse(item));
            })
            if(data.data.length !== 0) {
                getsecondHandAllData();
            }else {
                console.log(secondHandAllData);
                res.send(secondHandAllData)
            }
        })();
    })

    
    app.get('/partTimeJob',(req,res) => {
        var partTimeJobAllData = [];
        (async function getPartTimeJobAllData() {
            let options3 = {
                method:'post',
                uri:'https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token,
                body:{
                    "env":'xiaoliu-k8902',
                    "query":"db.collection(\"jianzhifabu\").limit("+ 20 +").skip("+ partTimeJobAllData.length +").get()"
                },
                json:true
            }
            request(options3).then(data => {
                data.data.forEach(item => {
                    partTimeJobAllData.push(JSON.parse(item));
                })
                if(data.data.length !== 0) {
                    getPartTimeJobAllData();
                }else {
                    res.send(partTimeJobAllData);
                }
            }) 
        })();

    })

    app.get('/lostAndFount',(req,res) => {
        var lostAndFountAllData = [];
        (async function getlostAndFountAllData() {
            let options3 = {
                method:'post',
                uri:'https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token,
                body:{
                    "env":'xiaoliu-k8902',
                    "query":"db.collection(\"shiwuzhaoling\").limit("+ 20 +").skip("+ lostAndFountAllData.length +").get()"
                },
                json:true
            }
            request(options3).then(data => {
                data.data.forEach(item => {
                    lostAndFountAllData.push(JSON.parse(item));
                })
                if(data.data.length !== 0) {
                    getlostAndFountAllData();
                }else {
                    res.send(lostAndFountAllData);
                }
            }) 
        })();
    })


    app.get('/expressAndTask',(req,res) => {
        var expressAndTaskAllData = [];
        (async function getExpressAndTaskAllData() {
            let options3 = {
                method:'post',
                uri:'https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token,
                body:{
                    "env":'xiaoliu-k8902',
                    "query":"db.collection(\"ExpressAndTask\").limit("+ 20 +").skip("+ expressAndTaskAllData.length +").get()"
                },
                json:true
            }
            var data =  await request(options3)
            if(data.data.length !== 0) {
                data.data.forEach(item => {
                    expressAndTaskAllData.push(JSON.parse(item));
                })
                getExpressAndTaskAllData();
            }else {
                res.send(expressAndTaskAllData);
            }
        })();
    })

    app.post('/deleteData',(req,res) => {
        const { id } = req.body;
        const { name } = req.body;
        var status = '';
        // console.log(id,name);
        // \"fabu\"
        let deleteDataReq = {
            method:'post',
            uri:'https://api.weixin.qq.com/tcb/databasedelete?access_token='+access_token,
            body:{
                "env":'xiaoliu-k8902',
                "query":"db.collection(\""+name+"\").doc(\""+id+"\").remove()"
            },
            json:true
        }
        request(deleteDataReq).then(ress => {
            status = ress.errmsg;
            console.log(status);
            res.send(status);
        })   
    })

    app.post('/checkData',async(req,res) => {
        const { id } = req.body;
        const { name } = req.body;
        const { status } = req.body;
        var checkRes = '';
        var checkName = '';
        if(status == 'success' && (name == 'fabu' || name == 'jianzhifabu' || name == 'shiwuzhaoling')) {
            checkRes = '通过';
            checkName = 'shenhe';
        }else if(status == 'fail' && (name == 'fabu') || name == 'jianzhifabu' || name == 'shiwuzhaoling') {
            checkRes = '失败';
            checkName = 'shenhe';
        }else if(status == 'success' && name == 'ExpressAndTask') {
            checkRes = '已发布'
            checkName = 'shenHe';
        }else if(status == 'fail' && name == 'ExpressAndTask') {
            checkRes = '审核失败';
            checkName = 'shenHe';
        }
        console.log(id,name,status);
        console.log(checkRes,checkName);
        let updateReq = {
            method:'post',
            uri:'https://api.weixin.qq.com/tcb/databaseupdate?access_token='+access_token,
            body:{
                "env":'xiaoliu-k8902',
                "query": "db.collection(\""+name+"\").doc(\""+id+"\").update({data:{"+checkName+":\""+checkRes+"\"}})"
            },
            json:true
        }
        
        var result = await request(updateReq);

        console.log(result);
        console.log(result.errmsg);
        res.send(result.errmsg)
    })

    app.post('/login',async(req,res) => {
        const { username } = req.body;
        const { password } = req.body;

        console.log(username,password);
        let checkLogin = {
            method:'post',
            uri:'https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token,
            body:{
                "env":'xiaoliu-k8902',
                "query": "db.collection(\"administrators\").get()"
            },
            json:true
        }

        let resultData = await request(checkLogin);

        console.log(resultData);
        let result = false;

        resultData.data.forEach(item => {
            if(JSON.parse(item).username == username && JSON.parse(item).password == password) {
                result = true
            }
        })

        console.log(result);
        res.send(result);
    })
})












// let options3 = {
//     method:'post',
//     uri:'https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token,
//     body:{
//         "env":'xiaoliu-k8902',
//         "query":"db.collection(\"jianzhifabu\").limit(20).skip(0).get()"
//     },
//     json:true
// }
// request(options3).then(data => {
//     var data = data.data;
//     app.get('/jianzhifabu',(req,res) => {
//         res.send(data)
//     })
// })

// let options4 = {
//     method:'post',
//     uri:'https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token,
//     body:{
//         "env":'xiaoliu-k8902',
//         "query":"db.collection(\"shiwuzhaoling\").limit(20).skip(0).get()"
//     },
//     json:true
// }
// request(options4).then(data => {
//     var data = data.data;
//     app.get('/shiwuzhaoling',(req,res) => {
//         res.send(data)
//     })
// })

// let options5 = {
//     method:'post',
//     uri:'https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token,
//     body:{
//         "env":'xiaoliu-k8902',
//         "query":"db.collection(\"ExpressAndTask\").limit(20).skip(0).get()"
//     },
//     json:true
// }
// request(options5).then(data => {
//     var data = data.data;
//     var array = [];
//     data.forEach(item => {
//         array.push(JSON.parse(item));
//     })
//     var expressArr = array.filter((item,index,array) => {
//         return item.leiXing == '代取快递';
//     })
//     var taskArr = array.filter((item, index, array) => {
//         return item.leiXing == '其它任务';
//     })
//     app.get('/daiqukuaidi',(req,res) => {
//         res.send(JSON.stringify(expressArr));
//     })
//     app.get('/qitarenwu',(req,res) => {
//         res.send(JSON.stringify(taskArr));
//     })
// })




// // var p = new Promise((resolve,reject) => {
// // request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx7c35fbee23f4debd&secret=48a807f11669321257a4358e3cd2732c',(error,res,body) => {
// //     access_token = JSON.parse(body).access_token;
// //     resolve(access_token);
// // })
// // })


// // p.then(res => {
// //    request.post('https://api.weixin.qq.com/tcb/databasequery?access_token='+access_token+'',body:{
// //        "env":'xiaoliu-k8902',
// //        "query":"db.collection(\"fabu\").limit(20).skip(0).get()"
// //    },(error,res,body) => {
// //        console.log(body)
// //    })
// // })


// app.get('/',(req,res) => {
//     // 设置请求头解决跨域问题
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     res.send({
//         access_token:access_token
//     });
// })


app.listen(8888,() => {
    console.log('successing!!!')
});





           // res.header("Access-Control-Allow-Origin", "*");
            // res.header("Access-Control-Allow-Headers", "X-Requested-With");
            // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
            // res.header("X-Powered-By",' 3.2.1')
            // res.header("Content-Type", "application/json;charset=utf-8");