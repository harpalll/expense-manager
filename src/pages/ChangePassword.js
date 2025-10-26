import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import ForgotPassword from "../features/user/ForgotPassword";
import ChangePassword from "../features/user/ChangePassword";
import Login from "../features/user/Login";

function ExternalPage() {
  return (
    <div className="">
      <ChangePassword />
    </div>
  );
}

export default ExternalPage;
