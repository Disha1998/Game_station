import React, { Component, Fragment, useState, useContext, useEffect } from "react";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Web3Context } from "../context/WebContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { Link, NavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
// import {faLockKeyhole} from '@fortawesome/free-regular-svg-icons'
import { ToastContainer, toast } from 'react-toastify';

export default function Authenticate() {
    const webContext = React.useContext(Web3Context);
    const history = new useHistory();
    const { connectWallet, currentAddress, required, isUpdate } = webContext;
    const { authenticate, isAuthenticated, user, signup, userError, authError } = useMoralis();
    const [themes, setThemes] = useState('');
    const [emails, setEmails] = useState('');
    const [userName, setUserName] = useState('');

    const { fetch: callEmailCloudFunction, data, error } = useMoralisCloudFunction("sendWelcomeEmail", {
        email: emails,
        name: userName
    }, {
        autoFetch: false
    }
    );

    let theme;

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/');
        }
        if (authError) {
            toast.error(authError.message)
        }
        if (userError) {
            toast.error(userError.message)
        }
        theme = localStorage.getItem("theme");
        setThemes(theme)
    }, [isAuthenticated, authError, userError, isUpdate])

    async function navigateHome() {
        history.push('/');
    }

    const formik = useFormik({
        initialValues: {
            Username: "",
            Email: "",
            Password: "",
            ConfirmPassword: ""
        },
        validationSchema: Yup.object({
            Username: Yup.string().required(required),
            Email: Yup.string().email("Invalid email address format").required(required),
            Password: Yup.string().min(6, 'Password must be at least 6 characters').required(required),
            ConfirmPassword: Yup.string().oneOf([Yup.ref('Password'), null], 'Confirm Password does not match').required(required)
        }),
        onSubmit: async (values) => {
            try {
                await signup(values.Username, values.Password, values.Email); 
                // toast.success("Successfully Register!");
                callEmailCloudFunction();

            } catch (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        },
    });

    return (
        <Fragment>
            <ToastContainer />
            <div className="main-wrap">
                <div className="nav-header bg-transparent shadow-none border-0">
                    <div className="nav-top w-100">
                        <a href="/">
                        <img  width={250} src="assets/images/logo/logo111.png" alt="SFS" />  
                        </a>
                        <button className="nav-menu me-0 ms-auto"></button>

                        <button onClick={() => connectWallet()} className="header-btn btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-auto cursot-pointer text-center lh-20 rounded-xl address-wrap">{currentAddress != null && currentAddress != undefined && currentAddress != '' ? currentAddress : "Connect Wallet"}</button>

                        {/* <a href="/register" className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl">Register</a> */}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                        style={{ backgroundImage: `url("	https://firebasestorage.googleapis.com/v0/b/social-network-app-a53f8.appspot.com/o/MicrosoftTeams-image%20(8).png?alt=media&token=49d5dc49-eb88-41a6-945e-823eded89cea` }}></div>
                    <div className="col-xl-7 vh-100 theme-dark-bg align-items-center d-flex bg-white rounded-3 overflow-hidden">
                        <div style={{ marginTop: '50px' }} className="card shadow-none border-0 ms-auto me-auto login-card">
                            <div className="card-body rounded-0 text-left">
                                <h2 className="fw-700 display1-size display2-md-size mb-3">Signup account</h2>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="form-group icon-input mb-3">
                                        <FontAwesomeIcon style={{ position: 'absolute', top: '20px', left: '20px' }} className="font-sm text-grey-500 pe-0" icon={faAt} />
                                        <input
                                            type="text"
                                            id="Username"
                                            onChange={(e)=>setUserName(e.target.value)}
                                            name="Username"
                                            className="h4 style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                            placeholder="Username"
                                            {...formik.getFieldProps("Username")}
                                        />
                                        {formik.touched.Username && formik.errors.Username ? (
                                            <div style={{ color: "red", fontWeight: 'bold' }}>{formik.errors.Username}</div>
                                        ) : null}
                                    </div>

                                    <div className="form-group icon-input mb-3">
                                        <FontAwesomeIcon style={{ position: 'absolute', top: '20px', left: '20px' }} className="font-sm text-grey-500 pe-0" icon={faEnvelope} />
                                        <input
                                            type="text"
                                            id="Email"
                                            onChange={(e)=>setEmails(e.target.value)}
                                            name="Email"
                                            className="h4 style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                            placeholder="Your Email Address"
                                            {...formik.getFieldProps("Email")}
                                        />
                                        {formik.touched.Email && formik.errors.Email ? (
                                            <div style={{ color: "red", fontWeight: 'bold' }}>{formik.errors.Email}</div>
                                        ) : null}
                                    </div>

                                    <div className="form-group icon-input mb-3">
                                        <input
                                            type="Password"
                                            id="Password"
                                            name="Password"
                                            className=" h4 style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                            placeholder="Password"
                                            {...formik.getFieldProps("Password")}
                                        />
                                        <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', top: '20px', left: '20px' }} className="font-sm text-grey-500 pe-0" />

                                        {formik.touched.Password && formik.errors.Password ? (
                                            <div style={{ color: "red", fontWeight: 'bold' }}>{formik.errors.Password}</div>
                                        ) : null}
                                    </div>

                                    <div className="form-group icon-input mb-3">
                                        <input
                                            type="Password"
                                            id="ConfirmPassword"
                                            name="ConfirmPassword"
                                            className="h4 style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                            placeholder="Confirm Password"
                                            {...formik.getFieldProps("ConfirmPassword")}
                                        />
                                        <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', top: '20px', left: '20px' }} className="font-sm text-grey-500 pe-0" />
                                        {formik.touched.ConfirmPassword && formik.errors.ConfirmPassword ? (
                                            <div style={{ color: "red", fontWeight: 'bold' }}>{formik.errors.ConfirmPassword}</div>
                                        ) : null}
                                    </div>


                                    <div className="col-sm-12 p-0 text-left">
                                        <button
                                            type="submit"
                                            className="form-control text-center style2-input text-white fw-600 bg-primary border-0 p-0 "
                                        >
                                            Register
                                        </button>
                                        <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">You have already signup <a href="/login" className="fw-700 ms-1">Login</a></h6>
                                    </div>
                                </form>


                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
}
