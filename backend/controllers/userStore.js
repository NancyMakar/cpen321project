const {MongoClient} = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
client.connect()

const authUtils = require('../utils/authUtils.js')

let dbUser, userCollection

dbUser = client.db("user")
userCollection = dbUser.collection("userCollection")

module.exports ={
    signup: async (req, res) => {
      // try {
      //     let email = req.body.email;
      //     let password = req.body.password;
      //     let username = req.body.username;
      //     authUtils.signUserUp(email,password,username)
      //     return res.status(200).json({ success: true})
      // } catch (error) {
      //     return res.status(400).json({ success: false, error })
      // }
     
      let email = req.body.email;
      let password = req.body.password;
      let username = req.body.username;
      let signUpResult;
      try {
        signUpResult = await authUtils.signUserUp(email,password,username)
      } catch (err) {
        console.log("-----err:------\n")

        console.log(err.message)
        console.log("------end of err------\n")

        console.log("signup: err: "+err)
        console.log("signUpResult: "+signUpResult)

        return res.status(200).json({ success: false, result: err.message })
      }
      console.log("signUpResult: "+signUpResult)
      return res.status(200).json({ success: true, result: signUpResult})
    },
    confirmSignUp: async (req, res) => {
      let username = req.body.username;
      let confirmationCode = req.body.confirmationCode;
      let confirmResult;
      try {
        confirmResult = await authUtils.confrimSignUP(username,confirmationCode)
      } catch (error) {
        console.log("-----err:------\n")

        console.log(error.message)
        console.log("------end of err------\n")

        console.log("confirmSignUp: err: "+error)
        console.log("confirmResult: "+confirmResult)

        return res.status(200).json({ success: false, result: error.message })
      }
      console.log("confirmResult: "+confirmResult)
      return res.status(200).json({ success: true, result: confirmResult})
      
    },

   login: async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let loginResult;
      try {
        loginResult = await authUtils.login(username, password)
      } catch (error) {
        console.log("-----err:------\n")

        console.log(error.message)
        console.log("------end of err------\n")

        console.log("login: err: "+error)
        console.log("loginResult: "+loginResult)

        return res.status(200).json({ success: false, result: error.message })
      }
      console.log("loginResult: "+loginResult)
      return res.status(200).json({ success: true, result: loginResult})
      
    },

    resendConfirmationCode: async (req, res) => {
      let username = req.body.username;
      let resendResult;
      try {
        resendResult = await authUtils.resendConfrimationCode(username)
      } catch (error) {
        console.log("-----err:------\n")

        console.log(error.message)
        console.log("------end of err------\n")

        console.log("resendConfirmationCode: err: "+error)
        console.log("resendResult: "+resendResult)

        return res.status(200).json({ success: false, result: error.message })
      }
      console.log("resendResult: "+resendResult)
      return res.status(200).json({ success: true, result: resendResult})
    },

    getUserProfile: async (req, res) => {
        try {
            userCollection.find({userID: req.params.userID}).toArray((err, userProfileResult) => {
                if (err) {
                  console.error(err)
                  res.status(500).json({ err: err })
                  return
                }
                res.status(200).json(userProfileResult)
              })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error })
        }
        
    },

    getCourseList: async (req, res) => {
        try {
            userCollection.find({userID: req.params.userID}).project({courselist:1, _id:0}).toArray((err, resultcourse) => {
                if (err) {
                  console.error(err)
                  res.status(500).json({ err: err })
                  return
                }
                res.status(200).json(resultcourse)
              })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error })
        }
        
    },

    createProfile : (req, res) => {
        var courselistarr = [];
        var blockeruserarr = [];
      userCollection.insertOne(
        {
          displayName: req.body.displayName,
          userID: req.body.userID,
          coopStatus: req.body.coopStatus,
          yearStanding: req.body.yearStanding,
          registrationToken: req.body.registrationToken,
          courselist: courselistarr,
          blockedUser: blockeruserarr,
        },
        (err, result) => {
          if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
          }
          res.status(200).json({ ok: true })
        }
      )
    },

    block: (req, res) => {
        userCollection.updateOne({"userID": req.body.userID}, {$push:{"blockedUser":req.body.blockedUserAdd}},(err, result)=>{
            if (err) {
                console.error(err)
                res.status(500).json({ err: err })
                return
            }
            res.status(200).json({ ok: true })
        });
    }, 

    getDisplayNamebyUserID: async (userID) => {
      try {
        let retrievedUser = await userCollection.findOne({"userID": userID})
        return retrievedUser.displayName
      } catch (error) {
          console.log(error)
          return error
      }
      
  }

}
