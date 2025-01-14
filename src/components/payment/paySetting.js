import { useState, useEffect } from "react";
import Head from "next/dist/shared/lib/head";
import Link from "next/link";
import { common, setMyState } from "@/components/Common";
import { data } from "jquery";
import svg from "@/components/svg";
import Select from "react-select";
import { toast } from "react-toastify";
import MyModal from "@/components/common/MyModal";
import { stripUnit } from "polished";

const PaySetting = () => {
    const [modal, setmodel] = useState(false);
    const [isPreviewModel, setIsPreviewModel] = useState(false);
    const [state, setstate] = useState({
        id: "",
        active: "",
        paypal: {
            client_id: "",
            secret_key: "",
            email: "",
            id: ""
        },
        stripe: {
            secret_key: "",
            email: "",
            id: "",
        },
        razorpay: {
            client_id: "",
            secret_key: "",
            email: "",
            id: ""
        }
    });

    const [ToggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
        setToggleState(index);
    };

    const getActiveClass = (index, className) =>
        ToggleState === index ? className : "";



    const changeValue = (e, type) => {
        setstate({
            ...state,
            [type]: {
                ...state[type],
                [e.target.id]: e.target.value,
            },
        });
    };

    const saveDetails = (e, type) => {
        e.preventDefault();
        let data = {
            ...state[type],
        };
        let keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            if (data[keys[i]].trim() == "" && keys[i] != "id") {
                toast.error(keys[i].split("_").join(" ") + " is require");
                return;
            }
            if (keys[i] == "email") {
                let em = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

                if (!em.test(data[keys[i]].trim())) {
                    toast.error("Email should be valid.")
                    return
                }
            }
        }
        common.getAPI(
            {
                method: "POST",
                url: "subscription-plan",
                data: {
                    type: type,
                    ...data,
                },
            },
            (resp) => {
                getAccounts();
            },
            (d) => { }
        );
    };

    useEffect(() => {
        getAccounts();
    }, []);

    const getAccounts = () => {
        common.getAPI(
            {
                method: "GET",
                url: "subscription-plan",
                data: {
                    action: "payment_accounts",

                },
            },
            (resp) => {
                if (resp.data) {
                    let d1 = resp.data;
                    let active = d1.find((s) => s.status == "active");
                    let t1 = {};
                    if (active) {
                        t1 = { ...t1, active: active.type };
                    }
                    for (let i = 0; i < d1.length; i++) {
                        let type = d1[i].type;
                        t1[type] = {
                            client_id: d1[i].client_id,
                            secret_key: d1[i].secret_key,
                            email: d1[i].email,
                            id: d1[i]._id
                        };
                    }
                    if(active.type=="razorpay")
                    {
                        setToggleState(3)
                    }else{
                        if(active.type=="stripe"){
                            setToggleState(2)
                        }else{
                            setToggleState(1)
                        }
                    }
                    setstate({ ...state, ...t1, model: false });
                }
            }
        );
    };

    const activePaymentAccount = (e, id) => {
        if (state.id = "") {
            return;
        }
        if (state[id]?.id && state[id]?.id != "") {

            common.getAPI(
                {
                    method: "PATCH",
                    url: "subscription-plan",
                    data: {
                        target: state[id].id
                    },
                },
                (resp) => {
                    if (resp) {
                        setmodel(false)
                        setstate({
                            ...state,
                            id: "",
                            active: id
                        })
                        getAccounts();
                    }
                }
            );
        } else {
            toast.error("please fill all details")
        }

    }
    return (
        <>
            <div>
                <Head>
                    <title>{process.env.SITE_TITLE}- Payment Settings</title>
                </Head>
                <div className="">
                    <div className="">
                        <div className="ps_integ_conatiner">
                            <div className="">

                                <div className=" ">
                                    <div>
                                        <div className="pb-md-3 pb-0">
                                            <div className=" ap_require ps_create_plan_check">
                                                <div className="ps_payment_radio_option">
                                                    <div className={`radio ${state.active === "paypal" ? "active_ps" : "ff"}`}>
                                                        <label className="d-flex gap-2 ">
                                                            {state.active === "paypal" ? <span className="ps_payment_check_icon ps_cursor">{svg.app.payment_check_icon}</span> : <span className="ps_cursor ps_payment_check_icon ps_check_payment_box"></span>}
                                                            <input
                                                                type="radio"
                                                                value="paypal"
                                                                checked={state.active === "paypal"}
                                                                onChange={(e) => {
                                                                    setmodel(true);
                                                                    setstate({
                                                                        ...state,
                                                                        id: "paypal"
                                                                    });
                                                                }}
                                                                id="paypal"
                                                            />
                                                        </label>
                                                        {/* Show icon if selected */}
                                                        <span
                                                            className={`tabs radio-option ${getActiveClass(1, "ps_active_ps")}`}
                                                            onClick={() => toggleTab(1)}
                                                        >{svg.app.paypal}</span>
                                                        {/* <span className="radio-option"></span> */}
                                                    </div>

                                                    <div className={`radio ${state.active === "stripe" ? "active_ps" : ""}`}>
                                                        <label className="d-flex gap-2 ps_cursor">
                                                            {state.active === "stripe" ? <span className="ps_payment_check_icon">{svg.app.payment_check_icon}</span> : <span className="ps_cursor ps_payment_check_icon ps_check_payment_box"></span>}
                                                            <input
                                                                type="radio"
                                                                value="stripe"
                                                                checked={state.active === "stripe"}
                                                                onChange={(e) => {
                                                                    setmodel(true);
                                                                    setstate({
                                                                        ...state,
                                                                        id: "stripe",
                                                                    });
                                                                }}
                                                                id="stripe"
                                                            />
                                                        </label>
                                                        <span
                                                            className={`tabs radio-option ${getActiveClass(2, "ps_active_ps")}`}
                                                            onClick={() => toggleTab(2)}
                                                        >{svg.app.stripe}</span>
                                                    </div>

                                                    <div className={`radio ${state.active === "razorpay" ? "active_ps" : ""}`}>
                                                        <label className="d-flex gap-2 ps_cursor">
                                                            {state.active === "razorpay" ? <span className="ps_payment_check_icon">{svg.app.payment_check_icon}</span> : <span className="ps_cursor ps_payment_check_icon ps_check_payment_box"></span>}
                                                            <input
                                                                type="radio"
                                                                value="razorpay"
                                                                checked={state.active === "razorpay"}
                                                                onChange={(e) => {
                                                                    setmodel(true);
                                                                    setstate({
                                                                        ...state,
                                                                        id: "razorpay",
                                                                    });
                                                                }}
                                                                id="razorpay"
                                                            />
                                                        </label>
                                                        <span
                                                            className={`tabs radio-option ${getActiveClass(3, "ps_active_ps")}`}
                                                            onClick={() => toggleTab(3)}
                                                        >{svg.app.razorpay}</span>
                                                        {/* <span className="radio-option">{svg.app.razorpay}</span> */}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className={`content ${getActiveClass(1, "active-content")}`}>

                                                <div className="col-xl-12 col-lg-12 col-md-12">
                                                    {/* {state.active === "paypal" && ( */}
                                                        <div className="ps_schedule_box mt-lg-0 mt-md-2 mt-2 ">
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="dash_header pb-1">
                                                                            <h3 className="mb-0">PayPal Details</h3>
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">Email</label>
                                                                            <input
                                                                                type="Email"
                                                                                id="email"
                                                                                value={state.paypal.email}
                                                                                onChange={(e) => changeValue(e, "paypal")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter email"
                                                                            />
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">PayPal Client ID</label>
                                                                            <input
                                                                                type="text"
                                                                                id="client_id"
                                                                                value={state.paypal.client_id}
                                                                                onChange={(e) => changeValue(e, "paypal")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter Client ID"
                                                                            />
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">Secret Keys</label>
                                                                            <input
                                                                                type="text"
                                                                                id="secret_key"
                                                                                value={state.paypal.secret_key}
                                                                                onChange={(e) => changeValue(e, "paypal")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter Secret Keys"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <div className="justify-content-start mt-3">
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => saveDetails(e, "paypal")}
                                                                                className="rz_addAccBtn addServiceData"
                                                                                style={{minWidth:"150px", marginTop:"30px"}}
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    {/* )} */}
                                                </div>
                                            </div>
                                            <div className={`content ${getActiveClass(2, "active-content")}`}>
                                                <div className="col-xl-12 col-lg-12 col-md-12">
                                                    {/* {state.active === "stripe" && ( */}
                                                        <div className="ps_schedule_box mt-lg-0 mt-md-2 mt-2 ">
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="dash_header pb-1">
                                                                            <h3 className="mb-0">Stripe Details</h3>
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">Email</label>
                                                                            <input
                                                                                type="Email"
                                                                                id="email"
                                                                                value={state.stripe.email}
                                                                                onChange={(e) => changeValue(e, "stripe")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter email"
                                                                            />
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">Stripe Publish Key</label>
                                                                            <input
                                                                                type="text"
                                                                                id="client_id"
                                                                                value={state.stripe.client_id}
                                                                                onChange={(e) => changeValue(e, "stripe")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter Client ID"
                                                                            />
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">Secret Keys</label>
                                                                            <input
                                                                                type="text"
                                                                                id="secret_key"
                                                                                value={state.stripe.secret_key}
                                                                                onChange={(e) => changeValue(e, "stripe")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter Secret Keys"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <div className="justify-content-start mt-3">
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => saveDetails(e, "stripe")}
                                                                                className="rz_addAccBtn addServiceData"
                                                                                style={{minWidth:"150px", marginTop:"30px"}}
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    {/* )} */}
                                                </div>
                                            </div>
                                            <div className={`content ${getActiveClass(3, "active-content")}`}>
                                                <div className="col-xl-12 col-lg-12 col-md-12">
                                                    {/* {state.active === "razorpay" && ( */}
                                                        <div className="ps_schedule_box mt-lg-0 mt-md-2 mt-2 ">
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="dash_header pb-1">
                                                                            <h3 className="mb-0">Razorpay Details</h3>
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">Email</label>
                                                                            <input
                                                                                type="Email"
                                                                                id="email"
                                                                                value={state.razorpay.email}
                                                                                onChange={(e) => changeValue(e, "razorpay")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter email"
                                                                            />
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">Razorpay Client Id</label>
                                                                            <input
                                                                                type="text"
                                                                                id="client_id"
                                                                                value={state.razorpay.client_id}
                                                                                onChange={(e) => changeValue(e, "razorpay")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter Client ID"
                                                                            />
                                                                        </div>
                                                                        <div className="rz_custom_form ap_require">
                                                                            <label className="form-label">Secret Key</label>
                                                                            <input
                                                                                type="text"
                                                                                id="secret_key"
                                                                                value={state.razorpay.secret_key}
                                                                                onChange={(e) => changeValue(e, "razorpay")}
                                                                                className="rz_customInput ap_input require"
                                                                                placeholder="Enter Secret Keys"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <div className="justify-content-start mt-3">
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => saveDetails(e, "razorpay")}
                                                                                className="rz_addAccBtn addServiceData"
                                                                                style={{minWidth:"150px", marginTop:"30px"}}
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    {/* )} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MyModal
                shown={modal}
                close={() => {
                    setmodel(false)
                    setstate({
                        ...state,
                        id: ""
                    })
                }}
            >
                <div className="modal-body">
                    <div className="rz_confirmModal">
                        <h4>Are you sure you want to change payment method ?</h4>
                        <p className="text-center pb-2">If you change the payment gateway you will not be able  <br />  to modify the existing plan.  </p>
                    </div>


                    <div className="d-flex gap-3 justify-content-center pt-2">
                        <div className="d-flex justify-content-center">
                            <button onClick={() => {
                                setmodel(false)
                                setstate({
                                    ...state,

                                    id: ""
                                })
                            }} className="rz_btn rz_addAccBtn_blk">No</button>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button onClick={(e) => {
                                activePaymentAccount(e, state.id)
                            }} className="rz_btn">Yes, Change </button>
                        </div>

                    </div>
                </div>
            </MyModal>
        </>
    );
};

export default PaySetting;
