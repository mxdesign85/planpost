"use Client"
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { authAction } from '@/components/Common'
import svg from '../../components/svg'
import { appStore } from "@/zu_store/appStore";
import { toast } from 'react-toastify'
import { NoDataWrapper, common, setMyState } from '@/components/Common';
let Auth = ({ checkData }) => {
    let myStore = appStore(state => state);
    const router = useRouter();
    let [email, setEmail] = useState('');
    let [authType, setauthType] = useState('Login');
    let [password, setPassword] = useState('');
    let [confirmPassword, setConfirmPassword] = useState('');
    let [resetId, setResetId] = useState(0);
    let [isProcess, setIsProcess] = useState(false);
    let [islogo, setIsLogo] = useState('');
    let [isfav, setIsFav] = useState('');
    let [isColor, setIsColor] = useState('');

    var myState = {};  
    let manageState = () => {
        myState = {
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            resetId: resetId,
        }
        if (authType == 'reset-password') {
            setResetId(router.query.q);
            console.log({authType},"pppppp")
        }
    }

    useEffect(() => {
        manageState();
    }, [email, password, confirmPassword, myState]);

    // useEffect(() => {
    //     getWebSettingsData();
    // }, []);

    let userData = myStore.userData; 
    // const getWebSettingsData = async (e) => {
    //         await common.getAPI({
    //             method: 'GET',
    //             url: 'web-setting?action=getweb',
    //             data: {},
    //         }, (resp) => {
    //             console.log("resp",resp)
    //            if(resp.data)
    //            {
    //             const customizationData = {
    //                 siteTitle: resp.data.siteTitle,
    //                 primaryColor: resp?.data?.primaryColor,
    //                 secondaryColor: resp?.data?.secondaryColor,
    //                 bodyColor: resp?.data?.bodyColor,
    //                 primaryLightColor:resp?.data?. primaryLightColor,
    //                 paragraphColor: resp?.data?.paragraphColor,
    //                 headingColor: resp?.data?.headingColor,
    //                 googleScript: resp?.data?.googleScript
    //             }        
    //             userData['adminprofileUrl'] =  resp?.data?.logo
    //             setIsLogo(resp?.data?.logo)
    //             setIsColor(customizationData)
    //             userData['adminfaviconUrl'] =  isfav
    //             userData['Color'] =customizationData
    //            }
                
    //         myStore.updateStoreData("userData", userData)
    //         });
        
    // }
    let onFormSubmit = async (submitType, myState) => {
        setIsProcess(true);
        authAction(submitType, myState, (authData) => {
            console.log({authData},"xxxxxxxxxxxxxx")
            if (authData) {
               
                    // authData['profile'] = process.env.S3_PATH + authData.profilePic
                    // userData['adminprofileUrl'] = islogo
                    // userData['adminfaviconUrl'] =isfav;
                    // userData['Color'] =isColor;
                    // console.log({isColor})
                    // authData['adminprofileUrl'] =  islogo
                    // authData['adminfaviconUrl'] = isfav
                    // authData['Color'] =isColor
                    console.log({authData})

                    let userData = myStore.userData; 
                    userData={
                        ...userData,
                        ...authData
                    }
                    myStore.updateStoreData('userData', userData);
                
            }
            setIsProcess(false);
        })
        // getWebSettingsData()
      
    }
    let fogetPassword = async (type, data) => {
        if (isProcess) {
            return
        }
        setIsProcess(true);
        authAction(type, data, (authData) => {


            if (authData) {
                setEmail("")
                setauthType("Login")
            }
            setIsProcess(false);

        })
    }

    const handleSubmit = useCallback(async (e, type, stateDetails) => {
        e.stopPropagation();
        e.preventDefault();
        if (stateDetails.email.trim() == "") {
            toast.error("Email is required.")
            return
        }
        if (stateDetails.password.trim() == "") {
            toast.error("Password is required.")
            return
        }
        let em = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

        if (!em.test(stateDetails.email.trim())) {
            toast.error("Email should be valid.")
            return
        }
        onFormSubmit(type, {
            ...stateDetails,
        });
    }, []);


    let pageTitleObj = {
        'login': 'Login',
        'forgot-password': 'Forgot Password',
        'reset-password': 'Reset Password',
    }

    return (
        <>
            <Head>
                <title>{(userData?.Color?.siteTitle)?userData?.Color?.siteTitle:process.env.SITE_TITLE}- {authType}</title>
                <style jsx global>{`
                    .rz_loginWrapper {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #0D0D14;
                        padding: 20px;
                        position: relative;
                        overflow: hidden;
                    }

                    .rz_loginWrapper::before {
                        content: '';
                        position: absolute;
                        width: 400px;
                        height: 400px;
                        background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%);
                        top: 0;
                        left: 0;
                        z-index: 1;
                    }

                    .rz_loginWrapper::after {
                        content: '';
                        position: absolute;
                        width: 400px;
                        height: 400px;
                        background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0) 70%);
                        bottom: 0;
                        right: 0;
                        z-index: 1;
                    }

                    .rz_auth_box {
                        background: rgba(255, 255, 255, 0.02);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 24px;
                        padding: 40px;
                        position: relative;
                        z-index: 2;
                        width: 100%;
                        max-width: 1000px;
                    }

                    .rz_leftForm {
                        padding: 0;
                    }

                    .rz_leftForm h3 {
                        color: #ffffff;
                        font-size: 32px;
                        margin-bottom: 16px;
                        font-weight: 600;
                    }

                    .rz_leftForm p {
                        color: #94A3B8;
                        font-size: 16px;
                        margin-bottom: 32px;
                    }

                    .rz_customInput_auth {
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: #ffffff;
                        padding: 12px 16px;
                        border-radius: 12px;
                        width: 100%;
                        transition: all 0.3s ease;
                    }

                    .rz_customInput_auth:focus {
                        border-color: #6366f1;
                        background: rgba(255, 255, 255, 0.08);
                    }

                    .rz_customInput_auth::placeholder {
                        color: #94A3B8;
                    }

                    .rz_custom_form label {
                        color: #ffffff;
                        margin-bottom: 8px;
                        display: block;
                        font-weight: 500;
                    }

                    .rz_inputIcon svg {
                        fill: #94A3B8;
                    }

                    .rz_btn {
                        background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
                        border: none;
                        color: #ffffff;
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    }

                    .rz_btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(99,102,241,0.3);
                    }
                `}</style>
            </Head>

            <div id="siteLoader"></div>
            <div className='rz_loginWrapper'>
                <div className='rz_loginWrapper_after'><img alt="" src="assets/images/auth/after.png" /></div>
                
                    {/* <div className='auth_img_box order-md-1 order-2'>
                        <img alt="" src="assets/images/auth/auth.png" />
                    </div> */}
                    <div className='rz_loginForm order-md-2 order-1'>
                        <form onSubmit={(e) => handleSubmit(e, authType, myState)} className='rz_form'>
                            {authType == 'Login' ?
                                <>
                                    <div className='rz_leftForm'>
                                        {/* <span className='ps_logo_header'> <img src={(userData?.adminprofileUrl)?userData?.adminprofileUrl:process.env.APP_LOGO} alt="" /></span> */}
                                        <div className='rz_logo_auth'>
                                            <h3>Introducing <span>{(userData?.Color?.siteTitle)?userData?.Color?.siteTitle:process.env.SITE_TITLE}</span> </h3>
                                        </div>
                                        <p>Welcome back, please login to your account.</p>

                                        <div className='input_auth_box'>
                                            <div className='rz_custom_form auth_bor_b'>
                                                <label>Email Address</label>
                                                <input className='rz_customInput_auth' type='email' value={email} placeholder='Enter your email address' onChange={(e) => setEmail(e.target.value)} />
                                                <span className='rz_inputIcon'>{svg.app.emailIcon}</span>
                                            </div>
                                            <div className='rz_custom_form'>
                                                <label>Password</label>
                                                <input className='rz_customInput_auth' type='password' value={password} placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
                                                <span className='rz_inputIcon'>{svg.app.passwordIcon}</span>
                                            </div>
                                        </div>
                                        <div className='rz_checkboxHolder'>
                                            <div className='rz_remamberMe checkbox'>
                                                <input type="checkbox" id='remamberMe' />
                                                <label htmlFor='remamberMe'>
                                                    Remember Me
                                                </label>
                                            </div>
                                            <p onClick={() => {
                                                setauthType("Forgot password")
                                            }} className="rz_link">
                                                Forgot password?
                                            </p>
                                        </div>
                                        <div className='rz_btnHolder'>
                                            <button disabled={isProcess ? true : false} className='rz_customBtn rz_btn' style={{ "width": "100%" }} type='submit'>
                                                {isProcess ? 'Processing...' : 'Login To Your Account'}
                                            </button>
                                        </div>
                                    </div>

                                </>
                                :
                                authType == 'Forgot password' &&
                                <>
                                    <div className='rz_leftForm'>
                                        <span className='ps_logo_header'> <img src={process.env.APP_LOGO} alt="" /></span>
                                        <h4>Forgot Password</h4>
                                        <span>Welcome back, please enter your details to continue.</span>
                                        <div className='input_auth_box'>

                                            <div className='rz_custom_form '>
                                                <label>Email Address</label>
                                                <input className='rz_customInput_auth' type='email' value={email} placeholder='Enter your email address' onChange={(e) => setEmail(e.target.value)} />
                                                <span className='rz_inputIcon'>{svg.app.emailIcon}</span>
                                            </div>
                                        </div>
                                        <div className='rz_btnHolder'>
                                            <button className='rz_customBtn rz_btn' style={{ "width": "100%" }} type='button' onClick={() => fogetPassword("forgot-password", { email })} >
                                                {isProcess ? 'Processing...' : 'Submit'}
                                            </button>
                                        </div>
                                        <div className='rz_checkboxHolder text-center '>
                                            <span onClick={() => {
                                                setauthType("Login")
                                            }} className="ps_back_login mx-auto">
                                                Back to Login
                                            </span    >
                                        </div>
                                    </div>

                                </>
                            }
                            <div className='rz_form_after'><img alt="" src="assets/images/auth/form_after1.png" /></div>
                            <div className='rz_form_after1'><img alt="" src="assets/images/auth/form_after2.png" /></div>
                            <div className='rz_form_after2'><img alt="" src="assets/images/auth/form_after3.png" /></div>
                        </form>

                    </div>
                
            </div>
        </>
    )
}


let T = (props) => {
    return (
        <Auth checkData={props} />
    );
};

export async function getServerSideProps(context) {
    var data = {
        isVerifiedLink: true,
        userData: {}
    };

    if (['email-verification', 'reset-password'].includes(context.query.auth)) {

        if (Object.keys(context.query).length && context.query.q) {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `auth/check-link?type=${context.query.auth}&q=${context.query.q}`)
            const respData = await res.json()

            data = {
                isVerifiedLink: respData.ok,
                userData: respData.data ? respData.data : {},
            }
        } else {
            data = {
                isVerifiedLink: false,
                userData: {}
            }
        }
    }

    return {
        props: data,
    }
}


export default T


