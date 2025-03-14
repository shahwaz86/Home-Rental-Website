const user = require("../models/user");

module.exports.signupForm = (req,res) =>{
  res.render("./user/signup.ejs");
}

module.exports.newUser = async(req,res) =>{
  try{
    let {username, email, password} = req.body;
    let newUser = new user({email, username});
    let registeredUser = await user.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) =>{
      if(err){
        return next(err);
      }
      else{
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listing");
      }
    })
   
  } catch(e){
    req.flash("error", e.msg);
    res.redirect("/signup");
  }
   
};
module.exports.loginForm =  (req,res) =>{
  res.render("./user/login.ejs");
};

module.exports.login = async(req, res) =>{

  req.flash("success", "welcome back to wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
  req.logOut((err) =>{
    if(err){
      next(err);
    }
    else{
      req.flash("success", "you logout successfully");
      res.redirect("/listing");
    }
  })
}