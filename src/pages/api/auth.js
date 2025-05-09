import bcrypt from "bcryptjs";
import socialAccount from "./models/socialAccount";
const userModel = require("./models/userModel");
const planModel = require("./models/planModel");
const { handleError, dbQuery , customValidator,randomText,sendMail} = require("./lib/commonLib");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
export default async function handler(req, res) {
    try{
        
        if(req.method == 'GET'){ 
            if(req.query.action=="forgot-password")
            {
             forgetPassword(req, res);
            }
            else
            {
                if(req.query.action=="getUser")
                {
                    getUser(req,res)
                }else
                {
                    if(req.query.action=="getSocial")
                    {
                        getSocial(req,res)
                    }
                    else
                    {
    
                        loginApp(req, res);
                    }
                }
              
            }
           
        }else{
            if(req.method == 'PUT')
            {
                if(req.body.action=="reset-password")
                {
                    resetPassword(req, res);
                }else
                {
                    if(req.body.action=="updateDetails")
                    {
                        updateDetails(req,res)
                    }
                }
            }
        }
    }catch (error){
        handleError(error , 'AuthAPI');
    }
}

let loginApp = (req, res) => { 
    customValidator(
		{
			data: req.query,
            isToken : false,
			keys: {
				email: {
					require: true,
					validate: "email",
                    message : 'Email is required.'
				},
				password: {
					require: true,
				},
			}, 
		},
		req,
		res,
		async ({authData} = validateResp) => {
            let {email , password} = req.query; 
          await  dbQuery.select({
                collection : userModel,
                where : {
                    email : email.toLowerCase()
                },
                limit : 1,
            }).then(async checkUser => { 
                if (checkUser) {
                    const isPasswordCorrect = await bcrypt.compare(
                        password,
                      checkUser.password
                    );
                    let isTempPasswordCorrect=false
                    if(checkUser.tempPassword)
                     {
                        isTempPasswordCorrect = await bcrypt.compare(
                            password,
                          checkUser.tempPassword
                        );
                     }
                     
                    if(isPasswordCorrect || isTempPasswordCorrect){
                        if(checkUser.status){
                            if(checkUser.role=="User" && checkUser.plan_status == false){
                                res.status(200).json({
                                    status: false,
                                    message: "Please update your plan.",
                                });
                                return;
                            }
                            let email = checkUser.email.toLowerCase();
                            var token = await jwt.sign(
                                {
                                    id: checkUser._id,
                                    role: checkUser.role,
                                    email,
                                    subscription: checkUser.subscription,
                                    parentId: checkUser.parentId,
                                },
                                process.env.TOKEN_SECRET,
                                {
                                    expiresIn: process.env.TOKEN_LIFE, 
                                }
                            );
                            
                            dbQuery.update({
                                collection : userModel,
                                data : {
                                    lastLogin : Date.now(),
                                    $unset: { tempPassword: '' },
                                },
                                where : {
                                    _id : checkUser._id,
                                  
                                },
                                limit : 1
                            }).then(async(upd) => {
                                let plan = await dbQuery.select({
                                    collection : planModel,
                                    where : {
                                        id : checkUser.planId
                                    },
                                    limit : 1,
                                })
                               
                                let myResp = {
                                    loggedIn: true,
                                    status: true,
                                    token: token,
                                    userId: checkUser._id,
                                    role: checkUser.role,
                                    email,
                                    name: checkUser.name, 
                                    profilePic: checkUser.profile,
                                    subscription: checkUser.subscription,
                                    parentId: checkUser.parentId,
                                    plan,
                                };
                           
                                res.status(200).json({
                                    data: myResp,
                                    status: true,
                                    message: "You are successfully logged in.",
                                });
                                console.log("checkUser.planId",checkUser.planId)
                            }) 
                        }else{
                            throw new Error("Your account is in-active, please contact to admin.");
                        }
                    }else{
                        throw new Error("Invalid credentials!");
                    }
                }else{
                    throw new Error("Invalid credentials!");
                }        
            }).catch (error => { 
                console.log(error.message)
                handleError(error.message);
            });
        }
    );
}

let forgetPassword = (req, res) => { 
    customValidator(
		{
			data: req.query,
            isToken : false,
			keys: {
				email: {
					require: true,
                    message : 'Email is required.'
				},
			},
		},
		req,
		res,
		async ({authData} = validateResp) => {
            let {email} = req.query; 
            dbQuery.select({
                collection : userModel,
                where : {
                    email : email.toLowerCase()
                },
                limit : 1,
            }).then(async checkUser => { 
                if (checkUser) {
                    let vCode = randomText(10)
                    let newPassword=await bcrypt.hash(vCode, 5)
                   await  dbQuery.update({
                        collection : userModel,
                        where : {
                            email : email.toLowerCase()
                        },
                        data : {
                            tempPassword :newPassword
                        },
                        limit : 1,
                    })
                    let mailData={
                        from : process.env.MANDRILL_EMAIL,
                        to : email,
                        subject : "Reset Password",
                        htmlbody : `<div style="max-width: 600px ;
                        padding:25px;background-color: #f6f6ff;
                        border-radius: 30px; 
                        margin: 0 auto;
                        border-radius: 10px; 
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
                        font-size: 15px;
                        line-height: 25px;
                        color: #29325f;
                        font-weight: 400;">
                            <div style="text-align: center;"><span><svg
                                        style="width: 3em; height: 3em;vertical-align: middle;fill: currentColor;overflow: hidden; fill:#ff776b"
                                        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M364.66265563 781.72984625c-41.28262781 0-74.31696375-33.03433688-74.31696375-70.18595625V521.42147A74.89338375 74.89338375 0 0 1 365.25279969 446.47318906h43.40989031a0.57642 0.57642 0 0 0 0.57642-0.57642v-70.39182093c0-61.92394125 37.98880125-99.92646656 99.9127425-99.92646657s99.92646656 37.98880125 99.92646656 99.92646657v70.43299406a0.57642 0.57642 0 0 0 0.57641907 0.57641906h39.29260781a74.89338375 74.89338375 0 0 1 74.962005 74.90710875v189.546a70.76237625 70.76237625 0 0 1-70.76237625 70.76237625z m0.57642-289.78812562a29.47974844 29.47974844 0 0 0-29.47974844 29.47974937v189.546a29.47974844 29.47974844 0 0 0 29.47974844 29.47974844h279.59098687a29.47974844 29.47974844 0 0 0 29.47974844-29.47974844V521.42147a29.47974844 29.47974844 0 0 0-29.47974844-29.47974937zM558.97098031 446.47318906a0.57642 0.57642 0 0 0 0.57642-0.57642v-70.39182093c0-37.15162031-17.34748688-54.49910719-54.49910719-54.49910719-33.03433688 0-50.38182375 17.34748688-50.38182375 54.49910719v70.43299406a0.57642 0.57642 0 0 0 0.57642 0.57641906z m0.57642 0" />
                                        <path
                                            d="M653.0920775 788.59198531H364.66265563c-44.00003437 0-81.17910281-35.28511781-81.17910282-77.04809531V521.42147A81.85159219 81.85159219 0 0 1 365.25279969 439.61105h37.13789625v-64.10610187c0-65.87653313 40.9120725-106.78860563 106.77488062-106.78860469s106.78860563 40.9120725 106.78860563 106.78860469V439.61105h33.00688781a81.85159219 81.85159219 0 0 1 81.81042 81.81042v189.546a77.72058469 77.72058469 0 0 1-77.6794125 77.62451531zM365.25279969 453.33532719a68.11359094 68.11359094 0 0 0-68.03124469 68.03124562v190.17731719c0 34.31069437 30.89334937 63.32381719 67.45482562 63.32381719h288.41569688a63.98258344 63.98258344 0 0 0 63.95513438-63.90023719V521.42147A68.09986594 68.09986594 0 0 0 648.96107 453.33532719h-39.29260688a7.45228313 7.45228313 0 0 1-7.43855906-7.43855813v-70.39182093c0-58.27328344-34.79104406-93.0643275-93.0643275-93.0643275s-93.05060344 34.79104406-93.05060344 93.0643275v70.43299406a7.45228313 7.45228313 0 0 1-7.45228312 7.397385z m279.57726281 293.97403031H365.25279969a36.38306063 36.38306063 0 0 1-36.3418875-36.3418875V521.42147a36.38306063 36.38306063 0 0 1 36.3418875-36.3418875h279.57726281a36.38306063 36.38306063 0 0 1 36.3418875 36.3418875v189.546a36.38306063 36.38306063 0 0 1-36.3418875 36.3418875zM365.25279969 498.80385969a22.64505844 22.64505844 0 0 0-22.61760938 22.61761031v189.546a22.64505844 22.64505844 0 0 0 22.61760938 22.61760938h279.57726281a22.64505844 22.64505844 0 0 0 22.61760938-22.61760938V521.42147a22.64505844 22.64505844 0 0 0-22.61760938-22.61761031zM558.97098031 453.33532719h-103.72809094a7.45228313 7.45228313 0 0 1-7.43855906-7.43855813v-70.39182093c0-40.14351281 19.79040844-61.36124625 57.24396281-61.36124532 40.71993188 0 61.36124625 20.58641625 61.36124625 61.36124531v70.43299407a7.45228313 7.45228313 0 0 1-7.43855906 7.397385z m-97.44237187-13.72427719h91.15665281v-64.10610187c0-33.39116813-14.2458-47.63696813-47.63696813-47.63696813-29.68561312 0-43.51968469 15.09670594-43.51968468 47.63696813z" />
                                        <path
                                            d="M509.61847812 985.13736687C254.11359875 985.13736687 45.93002938 776.9537975 45.93002938 521.46264219S254.11359875 57.7879175 509.61847812 57.7879175C617.50502563 57.7879175 716.10023656 94.994435 800.77903062 160.18475469a1.01559656 1.01559656 0 0 0 1.61946469-1.01559656l-18.33563531-87.0805425a0.98814844 0.98814844 0 0 1 0-0.20586469c0-4.73487562 0-13.99876312 4.62508219-18.71991469l0.16469156-0.23331281Q795.8931875 38.86213906 802.96119125 38.86213906h4.66625437c9.45602719 0 23.660655 9.45602719 23.66065501 18.92577844l33.10295718 170.181045a1.02932062 1.02932062 0 0 1 0 0.19213969v4.63880625c0 14.19090281-9.46975125 23.64693094-18.92577843 23.64693l-170.181045 33.10295812h-4.830945c-9.45602719 0-23.660655-9.46975125-23.660655-18.92577937 0-4.73487562 0-14.19090281 4.73487562-18.92577844s9.45602719-9.45602719 14.19090281-9.45602719l121.03440563-23.33127281a1.02932062 1.02932062 0 0 0 0.50779875-1.77043125c-88.94704406-82.55153062-210.13241719-119.70315094-333.22546406-103.86533438C265.90275312 137.67693875 119.57450375 289.39883 100.20954781 478.12137312 75.82150625 715.92193438 254.85470937 918.3413075 484.25601219 932.31262156c237.430005 14.46538875 437.04962531-176.31579656 436.99472906-414.11635687 0-24.01748625-0.1509675-44.69997281-3.40362094-65.01190407-0.82345687-5.14660406-2.38802438-12.00874313-3.44479406-17.18279625a52.41301687 52.41301687 0 0 1-1.26263344-10.97942156 12.35185031 12.35185031 0 0 1 1.37242782-4.35059625c1.23518531-2.4154725 5.86026656-10.9794225 20.87462624-12.69495656h4.73487563c14.17717875 0 22.53526406 10.26576 28.35435844 28.20339v0.16469156c4.65253031 12.07736438 9.414855 48.8858775 9.44230312 85.0905225 0.26076094 255.5323275-212.90472094 463.67472469-468.40960031 463.67472469z m0 1e-8" />
                                        <path
                                            d="M509.61847812 991.99950594C250.22962813 991.99950594 39.08161438 780.92011344 39.08161438 521.46264219S250.16100687 50.92577937 509.61847812 50.92577937a463.11202875 463.11202875 0 0 1 156.64890657 27.14662126 504.9436275 504.9436275 0 0 1 126.263355 67.33130625l-15.09670594-71.91521532a7.8365625 7.8365625 0 0 1-0.16469063-1.61946468c0-5.24267437 0-15.94761094 5.88771469-22.76857688C785.66860063 44.1185375 792.24252969 32 802.96119125 32h4.66625437c11.84405156 0 29.87775281 11.14411312 30.50906907 25.03308281l32.93826656 169.67324625a8.04242719 8.04242719 0 0 1 0.1509675 1.50967031v4.63880625c0 16.537755-11.18528625 30.05616844-25.06053187 30.50906907l-169.64579719 32.93826656a7.8365625 7.8365625 0 0 1-1.50967032 0.1509675h-4.63880625c-12.04991625 0-30.52279406-11.55584156-30.52279312-25.78791844 0-5.48971125 0-17.04555281 6.75234375-23.78417344 5.48971125-5.48971125 11.07549187-11.07549187 18.28073812-11.44604718L773.96179156 214.53289438c-85.9414275-75.12669656-201.527295-109.43739094-319.04828531-94.31323688a401.43512531 401.43512531 0 0 0-236.16737156 118.63265719A405.95041219 405.95041219 0 0 0 107.01678969 478.82131156c-11.43232312 111.44113594 21.95884406 219.50609906 93.9152325 304.30841063a404.68777875 404.68777875 0 0 0 125.2752075 99.17163187 402.29975437 402.29975437 0 0 0 459.46137093-66.06867375 408.02277844 408.02277844 0 0 0 128.73372563-298.02269156c0-25.362465-0.24703688-44.79604219-3.30755063-63.92768625-0.562695-3.51341531-1.53711938-8.08359938-2.38802437-12.1048125-0.35683125-1.67436187-0.69993844-3.29382656-1.0018725-4.77604875a51.60328406 51.60328406 0 0 1-1.29008156-10.19713875l-0.09607032-1.71553406c0-0.80973281-0.19213969-3.23892938 2.15471157-7.86401157 4.69370344-9.19526625 14.01248719-15.01435969 26.227095-16.40051156h5.50343531c24.19590188 0 32.23832812 24.79977 34.88711437 32.93826657l0.09606938 0.28821c5.36619281 14.63008031 9.68934 53.33254313 9.73051312 87.06681749 0.12351844 123.75181313-48.77608312 240.91597219-137.69567906 329.9316375A479.05963969 479.05963969 0 0 1 695.08836781 954.27146656a471.38776875 471.38776875 0 0 1-185.46988968 37.72803938z m0-927.34944938C257.72308344 64.65005656 52.7921675 269.5809725 52.7921675 521.46264219s204.93091594 456.81258562 456.82631063 456.81258562a457.773285 457.773285 0 0 0 179.98017843-36.69871875A465.39025969 465.39025969 0 0 0 837.47774937 841.73238875c86.32570687-86.46295031 133.81170844-200.14114313 133.68819-320.21484937 0-35.54587969-4.67997844-71.36624437-8.9894025-82.63387594l-0.274485-0.86463C955.21832844 417.652205 947.16217719 414.90735031 940.17651969 414.90735031h-4.32314719c-7.50718031 0.93325125-12.61261125 3.93886781-15.16532719 8.94822844a13.88896875 13.88896875 0 0 0-0.64504031 1.48222219v1.07049375a38.86715437 38.86715437 0 0 0 1.02932063 8.23456687c0.30193406 1.45477313 0.63131719 3.03306562 0.9881475 4.66625438 0.89207813 4.18590469 1.89395063 8.93450438 2.52526781 12.80475094 3.22520531 20.13351563 3.47224219 40.08861563 3.48596625 66.09612187a422.39209688 422.39209688 0 0 1-273.93658406 395.73954938 416.92983469 416.92983469 0 0 1-334.14499126-19.40612907 418.35715969 418.35715969 0 0 1-129.50228531-102.52035469c-74.44048219-87.68441062-108.87469594-199.41375563-97.09926469-314.60161968a419.74331156 419.74331156 0 0 1 115.51724532-248.1212175 412.8811725 412.8811725 0 0 1 244.292145-122.69504344c125.54969344-16.15347469 249.02702063 22.35684844 338.7700725 105.67693875a7.89145969 7.89145969 0 0 1-3.87024657 13.53213844l-121.67944687 23.33127187h-0.65876531c-1.89395063 0-6.73862063 4.84467-9.33250875 7.45228313s-2.74485563 10.9794225-2.74485563 14.06738437c0 4.73487562 10.19713875 12.06364031 16.79851594 12.06364031h4.11728344l170.33201156-33.13040625h0.65876531c5.83281844 0 12.06364031-6.75234469 12.06364031-16.78479187v-4.11728344L824.49458281 58.44668281v-0.65876531c0-4.73487562-10.19713875-12.06364031-16.79851593-12.06363938h-4.73487563s-3.04678969 0.43917656-8.00125406 10.27948407l-0.23331281 0.46662468-0.69993844 0.97442438-0.43917656 0.48034969c-2.52526687 2.59388813-2.74485563 9.90892875-2.74485563 13.32627375l18.19839188 86.46294937a7.87773562 7.87773562 0 0 1-12.51654094 7.86401156c-42.33939656-32.59515937-87.75303188-57.64196625-135.00572063-74.61889875a449.40147562 449.40147562 0 0 0-151.90030593-26.30944031z m452.18750344 372.92980032z m13.46351719-2.63506125z m-0.32938313-1.11166688l0.08234532 0.20586469z m-300.93223875-150.96705562z" />
                                    </svg></span>
                                <h3 style="margin-top: 5px; color: #29325f;">Password Reset</h3>
                            </div>
                            <p> Dear <span style="color: ff776b;"><b> ${checkUser.name},</b></span>  <br />
                        
                        
                                We are pleased to welcome you to our system. In order to ensure the security of your account, we have provided
                                you with a temporary password for your initial login. Please follow the instructions below for a smooth login
                                process: <br/>
                        
                                Your <b>temporary password:  ${vCode} </b> .<br />
                        
                            </p>
                            <div style="background:#ffffff ; padding: 15px 20px; border-radius: 20px;font-size: 14px;
                            line-height: 25px;
                            color: #8386a5;
                            font-weight: 400;"><span><b>Important Note:</b> This temporary password will be
                                    deactivated immediately upon your successful login. It is crucial that you change your password immediately
                                    after your first login for enhanced security.</span></div>
                        </div>`
                     };
                    let d1=await sendMail(mailData,"service")
                    res.status(200).json({
                        status: true,
                        message: "Your temporary password share on your email",
                    });
                }else{
                    throw new Error("This email is not registered with us.");
                }        
            }).catch (error => { 
                handleError(error.message);
            });
        }
    );
}


let resetPassword = (req, res) => { 
    customValidator(
		{
			data: req.body,
			keys: {
				password: {
					require: true,
                    message : 'Email is required.'
				},
			},
		},
		req,
		res,
		async ({authData} = validateResp) => {
            let {password} = req.body; 
            dbQuery.select({
                collection : userModel,
                where : {
                    _id : authData.id
                },
                limit : 1,
            }).then(async checkUser => { 
                if (checkUser) {
                    let newPassword=await bcrypt.hash(password, 5)
                    dbQuery
                        .update({
                            collection: userModel,
                            limit: 1,
                            where: {   _id : authData.id },
                            data: {
                                $set: { password: newPassword },
                            },
                        })
                        .then(async (result) => {
                            if (result) {
                                res.status(200).json({
                                    status: true,
                                    ok: true,
                                    message:"Password changed successfully.",
                                });
                            } else {
                                mQuery.handleError(
                                    "Something went wrong."
                                );
                            }
                        })
                        .catch((error) => {
                            mQuery.handleError(
                                error,
                                "queUpdateThen"
                            );
                        });
                }else{
                    throw new Error("Invalid credentials!");
                }        
            }).catch (error => { 
                handleError(error.message);
            });
        }
    );
}

let updateDetails = (req, res) => { 
    customValidator(
		{
			data: req.body,
		
		},
		req,
		res,
		async ({authData} = validateResp) => {
            let {name,lastname,contactNumber,password} = req.body; 
            dbQuery.select({
                collection : userModel,
                where : {
                    _id : authData.id
                },
                limit : 1,
            }).then(async checkUser => { 
                if (checkUser) {
                    let detail={
                        name: name,
                        lastname : lastname,
                       contactNumber : contactNumber
                   }
                    if(password)
                    {
                        let newPassword=await bcrypt.hash(password, 5)
                        detail.password=newPassword
                    }
                    
                    userModel.updateMany({   _id : authData.id },{ $set :detail},{ upsert: true })
                        .then(async (result) => {
                            if (result) {
                                res.status(200).json({
                                    status: true,
                                    ok: true,
                                    message:"Profile updated successfully.",
                                });
                            } else {
                                res.status(401).json({
                                    status: false,
                                    ok: false,
                                    message:"Something went wrong .",
                                });
                            }
                        })
                        .catch((error) => {
                            mQuery.handleError(
                                error,
                                "queUpdateThen"
                            );
                        });
                }else{
                    throw new Error("Invalid credentials!");
                }        
            }).catch (error => { 
                handleError(error.message);
            });
        }
    );
}

let getUser = (req, res) => {
    customValidator(
    { },
    req,
    res,
    async ({authData} = validateResp) => {
        dbQuery.select({
            collection : userModel,
            where : {
                _id : authData.id
            },
            limit : 1,
        }).then(async users => {
            if(users.role=="User")
            {
              let d1= await dbQuery.select({
                    collection : planModel,
                    where : {
                        id :users.planId
                    },
                    limit : 1,
                })
                res.status(200).json({ 
                    status : true,
                    message : '',
                    data : users,
                    plan : d1
                })
                return
            }

            res.status(200).json({ 
                status : true,
                message : '',
                data : users,
            })
        });
    })
}

let getSocial = (req, res) => {
    customValidator(
    { },
    req,
    res,
    async ({authData} = validateResp) => {
        dbQuery.select({
            collection : userModel,
            where : {
                _id : authData.id
            },
            limit : 1,
        }).then(async users => {
            if(users)
            {
                let data =await dbQuery.select({
                    collection : socialAccount,
                    where : {
                        userId : authData.id
                    },
                })
                let social={}
                data.map((d1)=>{
                    if(social[d1.type])
                    {
                        social[d1.type].push(d1)
                    }
                    else
                    {
                        social[d1.type]=[d1]
                    }

                })
                res.status(200).json({ 
                    status : true,
                    message : '',
                    data : social,
                })
            }
            else
            {
                res.status(200).json({ 
                    status : false,
                    message : 'User not find. ',
                })
            }
        });
    })
}
