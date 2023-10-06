import React, { useContext, useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import Navbar from "../home/Navbar";
import { Button } from "@mui/material";
import clientAxios from "../../api";
import { useStore } from "../../context/order";

export default function Profile() {
  const navigate = useNavigate();
  const [state, dispatch] = useStore();
  const [user, setUser] = useState({});
  const [listOrdered, setListOrdered] = useState([]);
  console.log({ state });
  const handleHomeClick = () => {
    navigate("/");
  };
  useEffect(() => {
    clientAxios
      .get(`/user/me/${state.user}`)
      .then((res) => {
        setUser(res.user);
        console.log("user", res.user);
      })
      .catch((err) => console.log(err));

    clientAxios
      .get(`/order/me/${state.user}`)
      .then((res) => {
        setListOrdered(res.orders);
        console.log("list order", listOrdered);
      })
      .catch((err) => console.log(err));
    return () => {
      setUser();
      setListOrdered();
    };
  }, []);
  return (
    <section style={{ backgroundColor: "#003b95" }}>
      <Navbar />

      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light  rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem className="mt-2">
                <p onClick={handleHomeClick}>Home</p>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem className="mt-2" active>
                User Profile
              </MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />
                <p className="text-muted mb-1">{}</p>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <Button className="w-full">
                      <i class="fas fa-clone text-warning mr-5 mb-3"></i>
                      <MDBCardText>Lịch sử đặt phòng</MDBCardText>
                    </Button>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <Button className="w-full">
                      <i className="fas fa-info-circle text-cyan-500 mr-5 mb-3"></i>
                      <MDBCardText>Booking đang tiến hành</MDBCardText>
                    </Button>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1">
                        Địa điểm booking
                      </span>{" "}
                    </MDBCardText>
                    <MDBCardText
                      className="mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Web Design
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Website Markup
                    </MDBCardText>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      One Page
                    </MDBCardText>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Mobile Template
                    </MDBCardText>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Backend API
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
