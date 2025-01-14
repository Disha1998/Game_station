import React, { Component, Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Web3Context } from "../context/WebContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMoralis } from "react-moralis";
import { useHistory } from 'react-router-dom';


function Forgot() {

    const webContext = React.useContext(Web3Context);
    const history = new useHistory();
    const { connectWallet, currentAddress, required, isUpdate } = webContext;
    const { Moralis } = useMoralis();
    const [themes, setThemes] = useState('');

    let theme;
    useEffect(() => {

        theme = localStorage.getItem("theme");
        setThemes(theme);
    }, [isUpdate])



    const formik = useFormik({
        initialValues: {
            Email: ""
        },
        validationSchema: Yup.object({
            Email: Yup.string().email("Invalid email address format").required(required)
        }),
        onSubmit: async (values) => {
            try {
                await Moralis.User.requestPasswordReset(values.Email);
                alert("success")
            } catch (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        },
    });

    return (
        <Fragment>
            <div className="main-wrap">
                <div className="nav-header bg-transparent shadow-none border-0">
                    <div className="nav-top w-100">
                        <a href="/">

                             <img  width={250} src="assets/images/logo/logo111.png" alt="SFS" />  
                        </a>
                        <button className="nav-menu me-0 ms-auto"></button>

                        <a href="/login" className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl">Login</a>
                        <a href="/auth" className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl">Register</a>
                    </div>
                </div>


                <div className="row">
                    <div className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                        style={{ backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/social-network-app-a53f8.appspot.com/o/MicrosoftTeams-image%20(8).png?alt=media&token=49d5dc49-eb88-41a6-945e-823eded89cea")` }}></div>

                    <div className="col-xl-7 theme-dark-bg vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
                        <div className="card shadow-none border-0 ms-auto me-auto login-card">
                            <div className="card-body rounded-0 text-left">
                                <h2 className="fw-700 display1-size display2-md-size mb-4">Change <br />your password</h2>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="form-group icon-input mb-3">
                                        <input
                                            type="text"
                                            id="Email"
                                            name="Email"
                                            className="h4 style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                            placeholder="Your Email Address"
                                            {...formik.getFieldProps("Email")}
                                        />
                                        {formik.touched.Email && formik.errors.Email ? (
                                            <div style={{ color: "red", fontWeight: 'bold' }}>{formik.errors.Email}</div>
                                        ) : null}
                                        <FontAwesomeIcon style={{ position: 'absolute', top: '20px', left: '20px' }} className="font-sm text-grey-500 pe-0" icon={faEnvelope} />
                                    </div>


                                    <div className="col-sm-12 p-0 text-left">
                                        <button
                                            type="submit"
                                            className="form-control text-center style2-input text-white fw-600 bg-primary border-0 p-0 "
                                        >
                                            Send Email
                                        </button>

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

export default Forgot;