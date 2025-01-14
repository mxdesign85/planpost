import bcrypt from "bcryptjs";
import templateModal from "./models/templateModal";
import postModel from "./models/postModel";
import Razorpay from "razorpay";
import planModel from "./models/planModel";
const userModel = require("./models/userModel");
const serviceModel = require("./models/serviceModel");
const { handleError, updateReqResp, dbQuery, customValidator } = require("./lib/commonLib");
const { sendMail } = require("./lib/commonLib");
const mongoose = require('mongoose');
const paymentCredentialModel = require("./models/paymentCredentialModel");
const axios = require('axios');
const nodemailer = require("nodemailer")
export default async function handler(req, res) {
  try {
    if (req.method == 'POST') {
      if (req.body.action == "sendEmail") {
        sendEmailToAll(req, res)
      }
      else if (req.body.action == "saveSmtp") {
        saveSmtpDetails(req, res)
      } else
      addNewUser(req, res);

    } else if (req.method == 'PUT') {
      updateUsersList(req, res);
    } else if (req.method == 'GET') {
      if (req.query.action == "user_analytics") {
        userAnalytics(req, res);
      } else {
        if (req.query.action == 'smtp') {
          getSmtp(req, res);
        } else {
          console.log("ababba",req.query)
          if (req.query.action == 'getdata') {
            getdatabytoken(req, res);
          }else{
            getUsersList(req, res);
          }
          
        }

      }
    } else if (req.method == 'DELETE') {
      deleteUser(req, res);
    }
  } catch (error) {
    handleError(error, 'AuthAPI');
  }
}



let addNewUser = (req, res) => {
  try {
    customValidator(
      {
        data: req.body,
        keys: {
          name: {
            require: true,
          },
          email: {
            require: true,
            validate: "email",
          },
          password: {
            require: true,
          },
          plan: {
            require: true,
          },

        },
      },
      req,
      res,
      async ({ authData } = validateResp) => {
        let { name, email, password, role, lastname, plan } = req.body;
        dbQuery.select({
          collection: userModel,
          where: {
            email
          },
          limit: 1,
          keys: '_id'
        }).then(async checkUser => {
          if (checkUser) {
            res.status(401).json({
              status: 0,
              message: 'Email is already exist with us, please try with another email.'
            })
            return
          } else {
            let insData = {
              name,
              email: email.toLowerCase(),
              password: await bcrypt.hash(password, 5),
              status: 1,
              source: 'Manually',
              lastname: lastname,
              planId: plan,

            };
            console.log(insData)
            
            if (role) {
              insData.role = role
            }

            if (authData.role == 'User') {
              insData.parentId = authData.id;
            }

            dbQuery.insert({
              collection: userModel,
              data: insData
            }).then(async (ins) => {

              let html = `<div style="max-width: 600px ;
                    padding:25px;background-color: #f6f6ff;
                    border-radius: 30px; 
                    margin: 0 auto;
                    border-radius: 10px; 
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
                    font-size: 15px;
                    line-height: 25px;
                    color: #29325f;
                    font-weight: 400;">
                        <div style="text-align: center;">
                            <h3 style="margin-top: 5px; color: #29325f;">${process.env.SITE_TITLE}</h3>
                        </div>
                        <p> Hi <span style="color: ff776b;"><b> ${name} ${lastname},</b></span>  <br />
                    
                    
                            Welcome to ${process.env.SITE_TITLE}. Your account is created by ${process.env.SITE_TITLE}, <br/> You can login to your account using following details:<br/><br/>
                    
                             <b>Login URL: </b> ${process.env.LIVE_URL} <br/>
                    
                             <b>Email : </b>${email.toLowerCase()} <br/>
                            
                             <b>Password :</b>  ${password}<br />
                    
                        </p>
                        <div style="background:#ffffff ; padding: 15px 20px; border-radius: 20px;font-size: 14px;
                        line-height: 25px;
                        color: #8386a5;
                        font-weight: 400;"><span> Thank you for being a loyal customer : <b>The ${process.env.SITE_TITLE} Team</b></span></div>
                    </div>`
              let mailData = {
                from: process.env.MANDRILL_EMAIL,
                to: email.toLowerCase(),
                subject: "Welcome",
                htmlbody: html
              };

              let data = await dbQuery.select({
                collection: serviceModel,
                where: { type: "smtp" },
                limit: 1,
              })
              if (data) {
                let d1 = {
                  to: email.toLowerCase(),
                  subject: "Welcome",
                  ...data.data,
                  htmlbody: html
                }
                await sendMail(d1)
              } else {
                try {
                  await sendMail(mailData, "service")
                }
                catch (e) {
                  res.status(401).json({
                    status: false,
                    message: 'Your Mandrill API key is incorrect. We are unable to send an email to the registered user.'
                  })
                }
              }


              res.status(200).json({
                status: true,
                message: 'User added successfully.'
              })
            });
          }

        });
      });
  }
  catch (e) {
  }
};

const createToken = async () => {

  try {
    const response = await axios.post(
      `${process.env.PAYPAL_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET_KEY).toString('base64')}`,
        },
      }
    );
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    // Handle errors here
    throw error;
  }
};

let updateUsersList = (req, res) => {
  customValidator(
    {
      data: req.body,
      keys: {
        target: {
          require: true,
        },
        name: {
          require: true,
        },
        email: {
          require: true,
          validate: "email",
        },
        plan: {
          require: true
        }

      },
    },
    req,
    res,
    async ({ authData } = validateResp) => {
      let { name, lastname, email, contactNumber, password, status, target, role, plan } = req.body;
      dbQuery.select({
        collection: userModel,
        where: {
          _id: target
        },
        limit: 1,
        keys: '_id,planId,invoice_id,paymenttype,customerId,subscription'
      }).then(async checkUser => {
        if (!checkUser) {
          res.status(401).json({
            status: 0,
            message: 'User not exist.'
          })
        } else {
          let updData = {
            name,
            status,
            contactNumber,
            lastname,
            role,
            planId: plan
          };

          if (password) {
            updData.password = await bcrypt.hash(password, 5);
          }
          if (checkUser.planId != plan && checkUser.invoice_id && checkUser.paymenttype == "paypal") {
            const token = await createToken();
            if (token) {
              const response = await axios.post(
                `${process.env.PAYPAL_URL}/v1/billing/subscriptions/${checkUser.invoice_id}/revise`,
                {
                  "plan_id": plan
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                  },
                }
              );

              if (response.data) {
                dbQuery.update({
                  collection: userModel,
                  data: updData,
                  where: {
                    _id: target
                  },
                  limit: 1
                }).then(ins => {

                  res.status(200).json({
                    status: true,
                    message: 'User updated successfully.',
                    data: ins
                  })


                });
              }
            } else {
              res.status(401).json({
                status: false,
                message: 'Token validation fail.',

              })
            }

          } else if (checkUser.planId != plan && checkUser.invoice_id && checkUser.paymenttype == "stripe") {
            let account = await dbQuery.select({
              collection: paymentCredentialModel,
              where: {
                type: "stripe"
              },
              limit: 1
            });
            const stripe = require('stripe')(account.secret_key);
            const currentSubscription = await stripe.subscriptions.retrieve(checkUser.subscription);
            let subscriptionId = currentSubscription.items.data.find((d1) => d1.plan.id == checkUser.planId)
            const updatedSubscription = await stripe.subscriptions.update(checkUser.subscription, {
              items: [{
                id: subscriptionId.id,
                price: plan,
              }],
            });
            updData.invoice_id = updatedSubscription.latest_invoice
            let invoicedata = {
              id: updatedSubscription.latest_invoice,
              plan_id: plan,
              type: transpilePackages,
            }
            let inv = await dbQuery.insert({
              collection: invoiceModel,
              data: invoicedata,
            });
            if (inv) {
              if (updatedSubscription) {
                dbQuery.update({
                  collection: userModel,
                  data: updData,
                  where: {
                    _id: target
                  },
                  limit: 1
                }).then((ins) => {

                  if (req.body.action == "status") {
                    res.status(200).json({
                      status: true,
                      message: 'User status updated successfully',
                      data: ins
                    })
                  } else {
                    res.status(200).json({
                      status: true,
                      message: 'User updated successfully.',
                      data: ins
                    })
                  }

                });
              }
            }

          } else if(checkUser.planId != plan && checkUser.subscription && checkUser.paymenttype == "razorpay"){
            let account = await dbQuery.select({
              collection: paymentCredentialModel,
              where: {
                type: "razorpay"
              },
              limit: 1
            });
            
            if (!account || !account.client_id || !account.secret_key) {
              res.status(400).json({status:false,message: "Both key_id and key_secret are required"});
              return;
            }
            let n1
            try{
            let instance = new Razorpay({
              key_id: account.client_id,
              key_secret: account.secret_key
            });
           await instance.subscriptions.update(checkUser.subscription,{
              plan_id :plan,
              start_at : Date.now(),
              customer_notify : 1,
            })
          }catch(error){
            res.status(400).json({
              status: false,
              message: error?.error?.description || ""
            })
          }
          } else {
            dbQuery.update({
              collection: userModel,
              data: updData,
              where: {
                _id: target
              },
              limit: 1
            }).then(ins => {
              if (req.body.action == "status") {
                res.status(200).json({
                  status: true,
                  message: 'User status updated successfully',
                  data: ins
                })
              } else {
                res.status(200).json({
                  status: true,
                  message: 'User updated successfully.',
                  data: ins
                })
              }

            });
          }


        }

      });
    });
};


let getUsersList = (req, res) => {
  customValidator(
    {},
    req,
    res,
    async ({ authData } = validateResp) => {

      let { keys, page, limit, keyword, sort } = req.query,
        where = {};

      if (authData.role == 'User') {
        where.parentId = authData.id;
      } else {
        where.role = { $ne: "Admin" }
      }

      if (keyword && keyword.trim() != '') {
        where['$or'] = [
          { 'name': { $regex: new RegExp(keyword, "i") }, },
          { 'email': { $regex: new RegExp(keyword, "i") } },
        ]
      }

      dbQuery.select({
        collection: userModel,
        where,
        limit,
        keys,
        page,
        sort
      }).then(async users => {
        let count = limit == 1 ? 1 : await dbQuery.count({
          collection: userModel,
          where,
        });
        res.status(200).json({
          status: true,
          message: '',
          data: users,
          totalRecords: count,
          fetchedRecords: limit == 1 ? 1 : users.length
        })
      });
    })
}



let deleteUser = (req, res) => {
  customValidator(
    {
      data: req.query,
      keys: {
        target: {
          require: true,
        }
      },
    },
    req,
    res,
    async ({ authData } = validateResp) => {
      let { target } = req.query;
      dbQuery.select({
        collection: userModel,
        where: {
          _id: target
        },
        limit: 1,
        keys: '_id'
      }).then(async checkUser => {
        if (!checkUser) {
          res.status(401).json({
            status: 0,
            message: 'User not found.'
          })
        } else {

          dbQuery.delete({
            collection: userModel,
            where: {
              _id: target
            },
            limit: 1
          }).then(ins => {
            res.status(200).json({
              status: true,
              message: 'User deleted successfully.'
            })
          });
        }

      });
    });
};


let sendEmailToAll = (req, res) => {
  customValidator(
    {},
    req,
    res,
    async ({ authData } = validateResp) => {

      let { contain, list } = req.body,
        where = {};
      if (list) {
        where["$in"] = list
      }

      dbQuery.select({
        collection: userModel,
        where,
        keys: "name,email"
      }).then(async users => {

        for (let i = 0; i < users.length; i++) {
          let mailData = {
            from: "noreply@plannero.io",
            to: users[i].email,
            subject: "Reset Password",
            htmlbody: `<h1>Dear ${users[i].email},
                        ${contain}
                        .</h1>`
          };
          let d1 = await sendMail(mailData, "service")
        }

        res.status(200).json({
          status: true,
          message: '',
          data: users,
        })
      });
    })
}


let userAnalytics = (req, res) => {
  customValidator(
    {},
    req,
    res,
    async ({ authData } = validateResp) => {

      let { keys, page, limit, keyword, sort, target } = req.query,
        where = {};
      where._id = target;

      let data = {}

console.log({data},"oooo")
      let userdata = await dbQuery.select({
        collection: userModel,
        where,
        limit: 1,
        keys,
        page,
        sort
      })
      let posts = await dbQuery.select({
        collection: postModel,
        where: { userId: target },
        limit: 5,
        sort
      })

      let postbysocialmedia = await dbQuery.aggregate({
        collection: postModel,
        aggregateCnd: [
          {
            $match: {
              "userId": new mongoose.Types.ObjectId(target)
            }
          },
          {
            $unwind: "$socialMediaAccounts"
          },
          {
            $group: {
              _id: {
                plateform: "$socialMediaAccounts.type",
                status: "$status",
              },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              socialMedia: "$_id",
              count: 1
            }
          }
        ]
      })
      let pending = await dbQuery.count({
        collection: postModel,
        where: { userId: target, status: "pending" },
      });

      let published = await dbQuery.count({
        collection: postModel,
        where: { userId: target, status: "Sucess" },
      });



      let data1 = {
        pending: pending,
        published: published,

      }
      let socialDetail = []
      console.log('socialDetail',socialDetail)
      postbysocialmedia.map((d1) => {
        socialDetail.push(
          {
            count: d1.count,
            ...d1.socialMedia
          })
      })
      data.userDetails = userdata
      data.posts = posts
      data.socialMedia = socialDetail
      data.postrate = data1
      res.status(200).json({
        status: true,
        message: '',
        data: data,
      })
      console.log('data.userDetails',userdata);
      console.log('data.userDetails',posts);
      console.log({socialDetail},"kkkkk");
      console.log({data1},"pppp")

    })
}

const saveSmtpDetails = (req, res) => {
  customValidator(
    {
      data: req.body,
      keys: {
        name: { require: true },
        email: { require: true, validate: "email" },
        hostname: { require: true },
        port: { require: true },
        username: { require: true },
        password: { require: true },
      }
    },
    req,
    res,
    async ({ authData } = validateResp) => {
      try {
        let { name, email, hostname, port, username, password } = req.body;
        
        // Convert port to number
        port = parseInt(port, 10);
        
        // Configure transporter with proper security settings
        let transporter = nodemailer.createTransport({
          host: hostname,
          port: port,
          secure: port === 465, // true for 465, false for other ports
          auth: {
            user: username,
            pass: password,
          },
          tls: {
            // Do not fail on invalid certs
            rejectUnauthorized: false
          },
          connectionTimeout: 10000, // 10 seconds
          greetingTimeout: 10000,
          socketTimeout: 10000,
        });

        try {
          // Verify connection configuration
          await transporter.verify();
          
          // If verification successful, try sending test email
          let info = await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: email,
            subject: "SMTP Test Email",
            html: "<b>Your SMTP settings have been verified successfully!</b>",
          });

          let body = {
            name, email, hostname, port, username, password
          };

          if (info.messageId) {
            // Check if SMTP settings already exist
            let data = await dbQuery.select({
              collection: serviceModel,
              where: { type: "smtp" },
              limit: 1
            });

            if (data) {
              // Update existing settings
              await dbQuery.update({
                collection: serviceModel,
                data: body,
                where: { type: "smtp" },
                limit: 1
              });
            } else {
              // Insert new settings
              await dbQuery.insert({
                collection: serviceModel,
                data: {
                  data: body,
                  type: "smtp"
                }
              });
            }

            res.status(200).json({
              status: true,
              message: 'SMTP settings saved and verified successfully.',
              data: {}
            });
          }
        } catch (smtpError) {
          console.error('SMTP Error:', smtpError);
          res.status(400).json({
            status: false,
            message: 'Failed to verify SMTP settings. Please check your credentials.',
            error: smtpError.message
          });
        }
      } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({
          status: false,
          message: 'Server error while saving SMTP settings.',
          error: error.message
        });
      }
    }
  );
}


const getSmtp = (req, res) => {
  customValidator(
    {
      data: req.query,
      keys: {


      }
    },
    req,
    res,
    async ({ authData } = validateResp) => {
      try {
        let data = await dbQuery.select({
          collection: serviceModel,
          data: {
            type: "smtp",
          },
          limit: 1,
        })
        res.status(200).json({
          data: data,
          status: true,
          message: '',
        })
      } catch (error) {
        res.status(401).json({
          status: false,
          message: '',
          data: error,
        })
      }

    });
}
const getdatabytoken=(req, res)=>{
  console.log("abababbppppppppppp")
  customValidator(
    {},
    req,
    res,
    async ({ authData } = validateResp) => {
      console.log("abababa",authData)
      await  dbQuery.select({
        collection : userModel,
        where : {
            _id :authData.id
        },
        limit : 1,
    }).then(async checkUser => { 
        if (checkUser) {
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
                  userId: checkUser._id,
                  role: checkUser.role,
                  email : checkUser.email,
                  name: checkUser.name, 
                  profilePic: checkUser.profile,
                  subscription: checkUser.subscription,
                  parentId: checkUser.parentId,
                  plan
              };
              console.log({myResp})
          
              res.status(200).json({
                  data: myResp,
                  status: true,
                  message: "",
              });
              console.log("checkUser.planId",checkUser.planId)
          }
      
             
    }).catch (error => { 
        console.log(error.message)
        handleError(error.message);
    });
})}