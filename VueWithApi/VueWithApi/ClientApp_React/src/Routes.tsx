import React from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "./components/home/Home";
import { SignIn } from "./components/signin/SignIn";
import { SignOut } from "./components/signout/SignOut";
import { Register } from "./components/register/Register";
import { MyAccount } from "./components/myaccount/MyAccount";
import { SetPassword } from "./components/setpassword/SetPassword";
import { ForgotPassword } from "./components/forgotPassword/ForgotPassword";

export function Routes() {
  return (
    <Switch>
      <Route path="/signin/:longCode?" component={SignIn} />
      <Route path="/signout" component={SignOut} />
      <Route path="/register" component={Register} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route path="/myaccount" component={MyAccount} />
      <Route path="/setpassword" component={SetPassword} />
      <Route exact path="/" component={Home} />
    </Switch>
  );
}
