define({ "api": [  {    "group": "Fortune",    "version": "0.1.0",    "type": "get",    "url": "/constellationMmatching/detail?me=金牛&he=白羊",    "title": "简单星座匹配",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n\n {\n    \"data\": {\n        \"title\": \"金牛座：白羊座\",\n        \"grade\": \"友情：★★爱情：★★★婚姻：★★亲情：★★\",\n        \"content\": \"节奏不同是你们天生的问题，一个冲动，一个慢半拍，要把你们放在同一个世界一起生活，看来大家要非常容忍对方，如果不是，很难看到长远。白羊座的人喜欢用强烈的追求攻势去攻陷金牛座的人的心，但金牛座固执求稳的性格，必然会深思熟虑才肯接受追求，中间拉拉扯扯的时候，可能白羊座已经忍不住转身就走。如果真是可以走在一起，大家不妨用双打网球的原理，一个补、一个攻，也许能够创出光明的前途，大前提当然是已经能理解和接受对方的特性。假如金牛座一方是男性，白羊座的女性就要更主动、加大追求力度。白羊座的人还要学习金牛座深思熟虑的处事态度，明白这点，大家都有好处的。性生活方面，金牛喜欢耳鬓撕磨，白羊则速战速决，有时候要学会迁就对方了。\"\n    },\n    \"code\": 200,\n    \"message\": \"success\"\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n  {\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/fortune/fortune.controller.ts",    "groupTitle": "Fortune",    "name": "GetConstellationmmatchingDetailMeHe"  },  {    "group": "Fortune",    "version": "0.1.0",    "type": "get",    "url": "/fortune/:fortuneName",    "title": "获取运势详情",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "  HTTP/1.1 200 OK \n\n{\n   \"data\":{\n      \"_id\":\"5d7476e196d970539ed3d6e3\",\n      // 星座名称\n      \"name\":\"白羊座\",\n      // 生辰\n      \"birth\":\"3.21-4.20\",\n      //属性\n      \"attributes\":\"火相\",\n      // 特点\n      \"feature\":\"勇敢，火热，大方\",\n      // 描述\n      \"desc\":\"白羊座，内心有着一个被放大的自我，这个自我里住着一个天真的孩子，孩子都会认为自己就是世界的中心，所以白羊座会有一点自私，但他们对朋友都不具心机，讲义气，想法和说话速度一样快的白羊座，有时也较少在意别人的感受。白羊座，内心有着一个被放大的自我，这个自我里住着一个天真的孩子，孩子都会认为自己就是世界的中心，所以白羊座会有一点自私，但他们对朋友都不具心机，讲义气，想法和说话速度一样快的白羊座，有时也较少在意别人的感受。\",\n      \"updatedAt\":\"2019-09-08T03:44:37.004Z\"\n  },\n  \"code\":200,\n  \"message\":\"success\"\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n  {\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/fortune/fortune.controller.ts",    "groupTitle": "Fortune",    "name": "GetFortuneFortunename"  },  {    "group": "Fortune",    "version": "0.1.0",    "type": "get",    "url": "/horoscope/realtime?consName=白羊座&type=today",    "title": "获取实时星座运势",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n   \n {\n    \"data\":{\n        \"name\":\"白羊座\",\n        \"datetime\":\"2019年09月08日\",\n        \"date\":\"2019-09-08\",\n        \"all\":\"73%\",\n        \"color\":\"白色\",\n        \"health\":\"74%\",\n        \"love\":\"72%\",\n        \"money\":\"71%\",\n        \"number\":\"3\",\n        \"OFriend\":\"双鱼座\",\n        \"summary\":\"白羊座今日运势一般，做事情的时候你可能没有赶上最开始的好时机，但是开弓没有回头箭，既然开始做了就要坚持下去。感情方面运势平平，你和另一半可能在沟通交流上有些互动变少，尽量注意一下为好。事业方面运势一般，工作中可能有交流不畅的情况，要多耐心解释为宜。另外工作时也要注意按时间节点完成工作不要拖拉。财运方面运势普通，投资理财方面好消息不多。健康方面运势平平，静养为宜。\",\n        \"work\":\"73%\"\n    },\n    \"code\":200,\n    \"message\":\"success\"\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n  {\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/fortune/fortune.controller.ts",    "groupTitle": "Fortune",    "name": "GetHoroscopeRealtimeConsnameTypeToday"  },  {    "group": "User",    "version": "0.1.0",    "type": "get",    "url": "http://localhost:8009/users/getUserInfo",    "title": "获取用户信息",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n   {\n     code:200,\n     data:{\n  \"openid\": \"2\", // wx openid - string\n  \"name\": \"刘宽\", // 昵称  - string\n  \"gender\": 1, //性别 - number\n  \"birth\": \"1995-2-4\", //生日 - string\n  \"height\": 183cm, //升高 - number\n  \"salary\": \"1000-1500\", //月收入 - string\n  \"workProvince\": \"江苏省\", // 工作 省 - string\n  \"workCity\": \"无锡市\", // 工作 市 - string\n  \"workRegion\": \"滨湖区\", // 工作 区 - string\n  \"education\": \"本科\", // 学历 - string\n  \"isMarriage\": 否, // 是否已婚 没有值->请选择 - string\n  \"hasChild\": 否, // 是否有孩子 - string\n  \"wantChild\": 是, // 是否想要孩子 - string\n  \"jobGeneral\": \"计算机\", // 工作类型的大类别 - string\n  \"jobDetail\": \"程序员\", // 工作类型的小类别 - string\n  \"haveHouse\": 是 // 是否有房子 - string\n  \"phone\": \"17602131394\" // 电话号码 - string\n  \"avator\": \"https://photo.zastatic.com/images/cms/banner/20181121/8311191311554389.png\", // 头像\n  \"photos\": [\n            \"https://photo.zastatic.com/images/photo/467571/1870282366/960647145683513.png\", // 用户图片\n            ....\n        ],\n  \"nationality\": \"汉族\", // 名族\n  \"constellation\": \"魔羯座(12.22-01.19)\", //星座\n  \"isRealAvator\": 是 //是否是真人头像\n  \"likes\": [\"1\"], // 我喜欢的人的列表\n  \"objectInfo\": { // 配偶标准要求\n            \"salary\": \"月薪:2万-5万\", // 收入\n            \"height\": \"178cm以上\", // 身高\n            \"age\": \"23-37岁\", // 年龄\n        }\n}\n   }",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "GetHttpLocalhost8009UsersGetuserinfo"  },  {    "group": "User",    "version": "0.1.0",    "type": "get",    "url": "http://localhost:8009/users/like/count",    "title": "获取喜欢的类别和数量",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n   {\n    \"data\": [\n        {\n            \"type\": \"meLike\", // 我喜欢\n            \"count\": 2 // 数量\n        },\n        {\n            \"type\": \"likeMe\", // 喜欢我\n            \"count\": 0 // 数量\n        },\n        {\n            \"type\": \"likeEachOther\", //相互喜欢\n            \"count\": 1 // 数量\n        }\n    ],\n    \"code\": 200,\n    \"message\": \"success\"\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "GetHttpLocalhost8009UsersLikeCount"  },  {    "group": "User",    "version": "0.1.0",    "type": "get",    "url": "/users/openidfromwx/:code",    "title": "从微信获取openid",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n\n{\n   data:{\n\"openid\":\"oV2Js5THL6EdzDahAxCTxFoXyjHk\"\n   } \n   code:200\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "GetUsersOpenidfromwxCode"  },  {    "group": "User",    "version": "0.1.0",    "type": "post",    "url": "http://localhost:8009/users/listLikes",    "title": "获取对应喜欢类别的用户列表",    "parameter": {      "examples": [        {          "title": "Request-Example:",          "content": "{\n\"type\": \"meLike\"\n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "  HTTP/1.1 200 OK \n {\n  \"data\": [\n      {\n          \"objectInfo\": {\n              \"salary\": \"月薪:2万-5万\",\n              \"height\": \"178cm以上\",\n              \"age\": \"23-37岁\"\n          },\n          \"photos\": [\n              \"https://photo.zastatic.com/images/photo/467571/1870282366/960647145683513.png\",\n              \"https://photo.zastatic.com/images/photo/467571/1870282366/963471443961834.png\",\n              \"https://photo.zastatic.com/images/photo/467571/1870282366/963471443960586.png\",\n              \"https://photo.zastatic.com/images/photo/467571/1870282366/963471443964435.png\",\n              \"https://photo.zastatic.com/images/photo/467571/1870282366/963471443963108.png\",\n              \"https://photo.zastatic.com/images/photo/467571/1870282366/963471443966899.png\"\n          ],\n          \"likes\": [\n              \"1\"\n          ],\n          \"_id\": \"5d74d60cc2de8bfb0bae9fdb\",\n          \"openid\": \"1870282366\",\n          \"avator\": \"https://photo.zastatic.com/images/cms/banner/20181121/8311191311554389.png\",\n          \"birth\": \"1995-2-4\",\n          \"constellation\": \"魔羯座(12.22-01.19)\",\n          \"createdAt\": \"2019-09-08T10:20:59.856Z\",\n          \"education\": \"本科\",\n          \"gender\": 1,\n          \"height\": 160,\n          \"name\": \"慕烟\",\n          \"nationality\": \"汉族\",\n          \"updatedAt\": \"2019-09-08T12:01:54.444Z\",\n          \"isRealAvator\": true,\n          \"phone\": \"176021394\",\n          \"age\": 27,\n          \"hasChild\": false,\n          \"haveHouse\": true,\n          \"isMarriage\": false,\n          \"jobDetail\": \"银行\",\n          \"jobGeneral\": \"金融\",\n          \"salary\": \"8001-12000\",\n          \"wantChild\": true,\n          \"workCity\": \"上海\",\n          \"workProvince\": \"上海\",\n          \"workRegion\": \"黄浦区\"\n      }\n  ],\n  \"code\": 200,\n  \"message\": \"success\"\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "PostHttpLocalhost8009UsersListlikes"  },  {    "group": "User",    "version": "0.1.0",    "type": "post",    "url": "http://localhost:8009/users/sendSms",    "title": "发送短信接口",    "parameter": {      "examples": [        {          "title": "Request-Example:",          "content": "{\n  \"phone\":\"18818216454\",\n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n    {\n    \"data\": {\n        \"Message\": \"OK\",\n        \"RequestId\": \"F8F33217-DD96-4057-BBCC-539D5BD58CD3\",\n        \"BizId\": \"836213868437871773^0\",\n        \"Code\": \"OK\"\n    },\n    \"code\": 200,\n    \"message\": \"success\"\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "PostHttpLocalhost8009UsersSendsms"  },  {    "group": "User",    "version": "0.1.0",    "type": "post",    "url": "http://localhost:8009/users/updateUserInfo",    "title": "更新和创建用户信息",    "parameter": {      "examples": [        {          "title": "Request-Example:",          "content": "{\n  \"openid\": \"2\", // wx openid - string\n  \"name\": \"刘宽\", // 昵称  - string\n  \"gender\": 1, //性别 - number\n  \"birth\": \"1995-2-4\", //生日 - string\n  \"height\": 183, //升高 - string\n  \"salary\": \"1000-1500\", //月收入 - string\n  \"workProvince\": \"江苏省\", // 工作 省 - string\n  \"workCity\": \"无锡市\", // 工作 市 - string\n  \"workRegion\": \"滨湖区\", // 工作 区 - string\n  \"education\": \"本科\", // 学历 - string\n  \"isMarriage\": 否, // 是否已婚 没有值->请选择 - string\n  \"hasChild\": 否, // 是否有孩子 - string\n  \"wantChild\": 是, // 是否想要孩子 - string\n  \"jobGeneral\": \"计算机\", // 工作类型的大类别 - string\n  \"jobDetail\": \"程序员\", // 工作类型的小类别 - string\n  \"haveHouse\": 是 // 是否有房子 - string\n  \"phone\": \"17602131394\" // 电话号码 - string\n  \"avator\": \"https://photo.zastatic.com/images/cms/banner/20181121/8311191311554389.png\", // 头像\n  \"photos\": [\n            \"https://photo.zastatic.com/images/photo/467571/1870282366/960647145683513.png\", // 用户图片\n            ....\n        ],\n  \"nationality\": \"汉族\", // 名族\n  \"constellation\": \"魔羯座(12.22-01.19)\", //星座\n  \"isRealAvator\": 是 //是否是真人头像\n  \"likes\": [\"1\"], // 我喜欢的人的列表\n  \"objectInfo\": { // 配偶标准要求\n            \"salary\": \"月薪:2万-5万\", // 收入\n            \"height\": \"178cm以上\", // 身高\n            \"age\": \"23-37岁\", // 年龄\n        }\n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n{\n    \"data\": \"success\",\n    \"code\": 200,\n    \"message\": \"success\"\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "      HTTP/1.1 200 \n {\n    \"message\": \"should have required property 'openid'\",\n    \"code\": 400,\n    \"url\": \"/users/updateUserInfo\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "PostHttpLocalhost8009UsersUpdateuserinfo"  },  {    "group": "User",    "version": "0.1.0",    "type": "post",    "url": "/users/addPhone",    "title": "手机注册",    "parameter": {      "examples": [        {          "title": "Request-Example:",          "content": " {\n\t\"phone\":\"18818216454\", //只是补充信息，需要加token\n\t\"code\":\"812901\" \n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": " HTTP/1.1 200 OK \n{\n \"code\": 200,\n \"message\": \"success\"\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:400\nmsg:\"the openid is not exists\",\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "PostUsersAddphone"  },  {    "group": "User",    "version": "0.1.0",    "type": "post",    "url": "/users/register",    "title": "创建用户",    "parameter": {      "examples": [        {          "title": "Request-Example:",          "content": "{\n     \"nickName\": \"A、double\",\n     \"language\": \"zh_CN\",\n     \"city\": \"Fayetteville\",\n     \"province\": \"Arkansas\",\n     \"country\": \"United States\",\n     \"avatarUrl\": \"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLLnJRJkI86CSPQNoMsSicNmwjl6W5k7R9kM2PPvp7EoamyUSWr64Vibdy4l3AZOPZ2H32w7IdJAYpA/132\",\n     \"openid\": \"1212121212\",\n     \"deleteStatus\": false\n   }",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n{\n    \"code\": \"200\",\n    \"data\": {\n        \"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTQzNjUyMDQ4fQ.NufQtcGh8QK4-eFuDUJVpIESWdgoIt121FQksZ48ip0\"\n    }\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:400\nmsg:\"the openid is not exists\",\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "PostUsersRegister"  },  {    "group": "User",    "version": "0.1.0",    "type": "put",    "url": "http://localhost:8009/users/like/:openid",    "title": "关注(收藏)接口",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK \n{\"code\":200,\"message\":\"success\"}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/users/users.controller.ts",    "groupTitle": "User",    "name": "PutHttpLocalhost8009UsersLikeOpenid"  },  {    "group": "psychologicalTest",    "version": "0.1.0",    "type": "get",    "url": "/psychological-test/5d74976396d970539ed3d6e4",    "title": "获取单个心理测试",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n\n{\n    \"data\":\n        {\n            \"_id\":\"5d74976396d970539ed3d6e4\",\n            // 整套心理题目的标题\n            \"name\":\"你是怎样的情人\",\n            // 心理题目的内容\n            \"content\":[\n                {\n                    // 答案选项\n                    \"answerOptions\":[\n                        {\n                            \"optionIndex\":\"A\",\n                            \"optionContent\":\"聊骚甚至亲密举动\"\n                        },\n                        {\n                            \"optionIndex\":\"B\",\n                            \"optionContent\":\"在海滩边两个人手牵手看日落，喝着美酒享受海风\"\n                        },\n                        {\n                            \"optionIndex\":\"C\",\n                            \"optionContent\":\"只要和对方在一起做什么都行\"\n                        },\n                        {\n                            \"optionIndex\":\"D\",\n                            \"optionContent\":\"看电影和一起吃晚饭\"\n                        }\n                    ],\n                    // 问题\n                    \"question\":\"你想象中最好的第一次约会是什么样？\"\n                }\n            \n        }\n    ]\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/psychological-test/psychological-test.controller.ts",    "groupTitle": "psychologicalTest",    "name": "GetPsychologicalTest5d74976396d970539ed3d6e4"  },  {    "group": "psychologicalTest",    "version": "0.1.0",    "type": "get",    "url": "/psychological-test/list",    "title": "获取心理测试list",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK \n\n{\n    \"data\":[\n        {\n            \"_id\":\"5d74976396d970539ed3d6e4\",\n            // 整套心理题目的标题\n            \"name\":\"你是怎样的情人\",\n            // 心理题目的内容\n            \"content\":[\n                {\n                    // 答案选项\n                    \"answerOptions\":[\n                        {\n                            \"optionIndex\":\"A\",\n                            \"optionContent\":\"聊骚甚至亲密举动\"\n                        },\n                        {\n                            \"optionIndex\":\"B\",\n                            \"optionContent\":\"在海滩边两个人手牵手看日落，喝着美酒享受海风\"\n                        },\n                        {\n                            \"optionIndex\":\"C\",\n                            \"optionContent\":\"只要和对方在一起做什么都行\"\n                        },\n                        {\n                            \"optionIndex\":\"D\",\n                            \"optionContent\":\"看电影和一起吃晚饭\"\n                        }\n                    ],\n                    // 问题\n                    \"question\":\"你想象中最好的第一次约会是什么样？\"\n                },\n                ...\n            ]\n        }\n    ]\n}",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Error-Response:",          "content": "    HTTP/1.1 200 \n{\ncode:500,\nmsg:\"\"\n}",          "type": "json"        }      ]    },    "filename": "src/app/psychological-test/psychological-test.controller.ts",    "groupTitle": "psychologicalTest",    "name": "GetPsychologicalTestList"  }] });
