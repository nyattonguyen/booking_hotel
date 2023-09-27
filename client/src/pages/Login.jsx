import React, { useContext, useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { AuthContext } from "../context";
import { Navigate } from "react-router-dom";
import clientAxios from "../api/index";
export default function Login() {
  const auth = getAuth();
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  if (localStorage.getItem("accessToken")) {
    return <Navigate to="/" />;
  }
  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const data = await signInWithPopup(auth, provider, {
      openerPolicy: "same-origin",
    });

    const response = await clientAxios.post("/user/login-gg", {
      id: data.user.uid,
      name: data.user.displayName,
      email: data.user.email,
    });

    if (response.status === 200) {
      return <Navigate to="/" />;
    }

    console.log(response.data.message);
  };

  const handleLogin = () => {
    if (email === "" || password === "") {
      return;
    }
    clientAxios
      .post("/user/login", {
        email,
        password,
      })
      .then((data) => {
        localStorage.setItem("accessToken", data.token);
        return <Navigate to="/" />;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow className="mt-2">
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="img-fluid"
            alt=""
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <MDBContainer className="align-middle justify-center">
            <h1 className="mb-3 mb-2 ">MT BOOKING</h1>
          </MDBContainer>
          <MDBInput
            wrapperClass="mb-4"
            label="Email address"
            id="formControlLg"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="formControlLg"
            type="password"
            size="lg"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
            />
            <a href="!#">Forgot password?</a>
          </div>

          <MDBBtn className="mb-4 w-100" size="lg" onClick={handleLogin}>
            Sign in
          </MDBBtn>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">OR</p>
          </div>

          <MDBBtn
            className="mb-4 w-100"
            size="lg"
            style={{ backgroundColor: "#3b5998" }}
          >
            <MDBIcon fab icon="facebook-f" className="mx-2" />
            Continue with facebook
          </MDBBtn>

          <MDBBtn
            className="mb-4 w-100"
            size="lg"
            style={{ backgroundColor: "#55acee" }}
            onClick={handleLoginWithGoogle}
          >
            <MDBIcon
              fab
              icon="google"
              className="mx-2"
              style={{
                color:
                  "linear-gradient(to right, #4285F4, #FF0000, #FFFF00, #008000, #0000FF)",
                "& .fab-img": {
                  fill: "linear-gradient(to right, #4285F4, #FF0000, #FFFF00, #008000, #0000FF)",
                },
              }}
            />
            Continue with Google
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
