"useClient"
import { useState, useEffect } from "react";
import {  common } from '@/components/Common';
import { toast } from 'react-toastify';
export default function SmtpSetting(){

    const [state,setstate]=useState({
        name : "",
        email : "",
        hostname : "",
        port : "",
        username: "",
        password : ""
    })


    useEffect(()=>{
        getDetails()
    },[])

    const changeValue =(e)=>{
        setstate({
            ...state,
            [e.target.id] : e.target.value
        })
    }

    const saveSmtpDetails=(e)=>{
        let data = {
            ...state
        }

        // Validate port is numeric
        if (isNaN(state.port)) {
            toast.error("Port must be a valid number");
            return;
        }

        // Basic validation for hostname format
        if (!state.hostname.includes('.')) {
            toast.error("Please enter a valid hostname");
            return;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(state.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        let data1 = Object.keys(state);
        for (let i = 0; i < data1.length; i++) {
            const value = state[data1[i]];
            if (typeof value !== "boolean" && (!value || (typeof value === "string" && value.trim() === ""))) {
                toast.error(data1[i].split("_").join(" ") + " is required.");
                return;
            }
        }

        toast.info("Testing SMTP connection...");
        
        common.getAPI({
            method: 'POST',
            url: 'user',
            data: {
                ...data,
                action: "saveSmtp",
                test: true // Add test flag to verify connection before saving
            },
        }, (resp) => {
            if (resp.status === 401) {
                toast.error("Authentication failed. Please check your API credentials.");
                return;
            }
            
            if (resp.data?.code === "ETIMEDOUT") {
                toast.error("SMTP connection timed out. Please verify your hostname and port.");
                return;
            }
            
            if (resp.status === false) {
                toast.error(resp.message || "Failed to save SMTP settings. Please check your credentials.");
                return;
            }
            
            toast.success("SMTP settings saved successfully!");
        })
    }

    const getDetails=(e)=>{
        common.getAPI({
            method: 'GET',
            url: 'user',
            data: {
              action : "smtp"
            },
        }, (resp) => {
            if (resp.status === 401) {
                toast.error("Authentication failed. Please log in again.");
                return;
            }
            
            if(resp.data?.data) {
                setstate({...resp.data.data})
            } else {
                toast.error("Failed to fetch SMTP settings");
            }
        })
    }
    return (
        <>
            <div>

                <div className="">
                    <div className="">
                        <div className="ps_integ_conatiner">
                            <div className="">


                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 col-md-12">
                                        <div className="ps_schedule_box" >
                                            <form>
                                                <div className="row">
                                                    <div className="col-lg-6">

                                                        <div className="rz_custom_form ap_require">
                                                            <label className="form-label">Form Name <span className="text-danger">*</span></label>
                                                            <input
                                                                value={state.name}
                                                                onChange={(e)=>changeValue(e)}
                                                                id="name"
                                                                type="text"
                                                                className="rz_customInput ap_input require"
                                                                placeholder="Enter name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">

                                                        <div className="rz_custom_form ap_require">
                                                            <label className="form-label">  Form Email <span className="text-danger">*</span></label>
                                                            <input
                                                                value={state.email}
                                                                onChange={(e)=>changeValue(e)}
                                                                id="email"
                                                                type="email"
                                                                className="rz_customInput ap_input require"
                                                                placeholder="Enter email"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">

                                                        <div className="rz_custom_form ap_require">
                                                            <label className="form-label">Host Name <span className="text-danger">*</span></label>
                                                            <input
                                                              value={state.hostname}
                                                              onChange={(e)=>changeValue(e)}
                                                              id="hostname"
                                                                type="text"
                                                                className="rz_customInput ap_input require"
                                                                placeholder="Enter host name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">

                                                        <div className="rz_custom_form ap_require">
                                                            <label className="form-label">  HTTP Port <span className="text-danger">*</span></label>
                                                            <input
                                                                value={state.port}
                                                                id="port"
                                                                onChange={(e)=>changeValue(e)}
                                                                type="text"
                                                                className="rz_customInput ap_input require"
                                                                placeholder="Enter http port"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">

                                                        <div className="rz_custom_form ap_require">
                                                            <label className="form-label">User Name <span className="text-danger">*</span></label>
                                                            <input
                                                             value={state.username}
                                                             id="username"
                                                             onChange={(e)=>changeValue(e)}
                                                                type="text"
                                                                className="rz_customInput ap_input require"
                                                                placeholder="Enter user name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">

                                                        <div className="rz_custom_form ap_require">
                                                            <label className="form-label"> Password <span className="text-danger">*</span></label>
                                                            <input
                                                            value={state.password}
                                                            id="password"
                                                            onChange={(e)=>changeValue(e)}
                                                                type="text"
                                                                className="rz_customInput ap_input require"
                                                                placeholder="Enter password"
                                                            />
                                                        </div>
                                                    </div>



                                                    <div className="col-lg-12">
                                                        <div className="justify-content-start mt-3">
                                                            <button
                                                                type="button"
                                                                onClick={(e)=>{
                                                                    saveSmtpDetails(e)
                                                                }}
                                                                className="rz_addAccBtn addServiceData"
                                                            >
                                                                Update
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};


