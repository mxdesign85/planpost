import React, { useState } from 'react'
import { useRouter } from 'next/router';
import svg from './svg';
import MyModal from './common/MyModal';
import Select from 'react-select';
import { toast } from "react-toastify";
import {setMyState, logout } from '@/components/Common';
import ConfirmationPopup from "./common/ConfirmationPopup";
import { appStore } from "@/zu_store/appStore";


let Header = () => {
    let storeData = appStore(state => state);
    let userData = storeData.userData;
    let postData = storeData.postData;
    const [isShow,setIsShow]=useState(false)
    const router = useRouter();

    let isActive = (route) => {
        let pathname = router.pathname;
        if (route == pathname) {
            return "active";
        } else "";
    };

    let [state, setQuery] = useState({
        createReelPopup: false,
        step: 1,
        reelType: null,
        title: '',
        reelCate: null,
        reelSubCate: null,
        reelTones: null,
        productTitle: '',
        keyFeature: '',

        createTemplatePopup: false,
        tempTitle: '',
        category: null,
        subCategory: null,
        tags: '',

        toggleBtn: false,
        categoriesList: [],
        chatGptTone: [
            'Encouraging',
            'Persuasive',
            'Thoughtful',
            'Personal',
            'Witty',
            'Funny',
            'Empathetic',
            'Compassionate',
        ].map(d => {
            return { label: d, value: d }
        })
    })


    const changePage = (e, data) => {
        if (router.pathname === "/create_post") {
            if (router.query.id) {
                router.query = {}
            }
        }
        if (router.pathname === "/calendar") {
            storeData.updateStoreData("calendarDate", "")
        }
        e.preventDefault()
        router.push(data);
        storeData.updateStoreData("postData", {})
    }
console.log({userData})
    return (
        <>
            <div className='rz_mainHeader'>
                <div className='ps_conatiner-fluid'>
                    <div className='row align-items-center'>
                        <div className='col-lg-2 col-md-4 col-6'>
                            <div className='rz_logo'>                             
                                <span className='ps_logo_header'> 
                                    <img src={(userData.adminprofileUrl)?userData.adminprofileUrl:process.env.APP_LOGO} alt="" />
                                </span>
                            </div>
                        </div>
                        <div className='col-6 d-lg-none text-end'>
                            <button className='rz_mobile_menu_btn' onClick={() => setMyState(setQuery, { toggleBtn: !state.toggleBtn })}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                        <div className='col-lg-8 d-none d-lg-block'>
                            <div expand="lg" className="rz_navMenu">
                                <div className='rz_nav_box'>
                                    <div id="navbarScroll" className='navbarScroll'>
                                        <ul className="navbar-scroll" style={{ maxHeight: '100px' }}>
                                            {
                                                userData.role == 'Admin' ?
                                                    <>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/admin/dashboard")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }}
                                                                className={isActive("/admin/dashboard") ? "nav-link active" : "nav-link "}
                                                            >
                                                                <span>{svg.app.dashBoard}</span>Dashboard
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/admin/users")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/admin/users") ? "nav-link active" : "nav-link"}>
                                                                <span>{svg.app.userIcon}</span>Users</a>
                                                        </li>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/admin/templates")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/admin/templates") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.myReels}</span>Templates
                                                            </a>
                                                        </li>
                                                        {/* <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/admin/assets")
                                                            }} className={isActive("/admin/assets") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.categories}</span>Assets
                                                            </a>
                                                        </li> */}
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/admin/assets_tabs")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/admin/assets_tabs") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.categories}</span>Assets
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/admin/setting")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/admin/setting") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.Plan_icon}</span>Plans
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/admin/paymentSetting")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/admin/paymentSetting") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.settings}</span>Integrations
                                                            </a>
                                                        </li>
                                                      
                                                    </>

                                                    : "" }
                                                  { userData.role == 'User' ?  <>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/dashboard")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }}
                                                                className={isActive("/dashboard") ? "nav-link active" : "nav-link "}
                                                            >
                                                                <span>{svg.app.dashBoard}</span>Dashboard
                                                            </a>
                                                        </li>
                                                          
                                                        <li>
                                                            <a onClick={(e) => {
                                                               
                                                                setIsShow(true)
                                                                changePage(e, "/create_post")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={!router.query.id && isActive("/create_post") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.create_post}</span>Create Post
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/calendar")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/calendar") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.myReels}</span>Calendar
                                                            </a>
                                                        </li>
                                                       {userData?.plan?.editor_access && 
                                                         <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/image_editor/image_edit")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/image_editor/image_edit") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.image_creator}</span>Image Creator
                                                            </a>
                                                        </li>
                                                        }
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/Integrations")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/Integrations") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.integration}</span>Integrations
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/getdraft")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/getdraft") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.Plan_icon}</span>Drafts
                                                            </a>
                                                        </li>
                                                        
                                                    </> : ""
                                            }

{
                                                userData.role == 'Template Creator' ?
                                                    <>
                                                        <li>
                                                            <a onClick={(e) => {
                                                                changePage(e, "/admin/templates")
                                                                setMyState(setQuery, { toggleBtn: false })
                                                            }} className={isActive("/admin/templates") ? "nav-link active" : "nav-link "}>
                                                                <span>{svg.app.myReels}</span>Templates
                                                            </a>
                                                        </li>
                                                      
                                                    </>
                                                    : "" }


                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {process.env.TYPE=="demo" &&
                            <p className='rz_note_for_demo'><b>Note: </b>Feel free to test all the features before purchasing, keep in mind that some features are disabled in Demo mode.</p>
                            }
                        </div>
                        <div className='col-lg-2 col-4'>
                            <div className='rz_rightHeader'>


                                <div className='rz_profileDropdown'>
                                    <div className='rz_userDropdown'>
                                        { userData.profile ? <span className='rz_userImg'> <img src={userData?.profile}  alt="Loading"/>    </span>
                                        :<span className='rz_userImg'> <img src='../assets/images/default_pro.png'  alt="Loading"/></span>}
                                        <p>{userData?.name}</p>
                                        <div style={{ marginLeft: "5px" }}>
                                            {svg.app.profile_dropdown}
                                            <div className='rz_dropdownHolder'>
                                                <ul>
                                                    <li><a className='rz_listMenu' onClick={(e) => {
                                                        changePage(e, "/profile")
                                                    }}>My Account</a></li>

                                                                {userData?.role=='User'&& <li><a className='rz_listMenu' onClick={(e) => {
                                                        changePage(e, "/myplans")
                                                    }}>My plans</a></li>  }                                
                                                    <li>
                                                        <a className='rz_listMenu' disabled onClick={() => {
                                                            logout(() => {
                                                                storeData.updateStoreData('userData', {});
                                                                storeData.updateStoreData('categoriesData', {});
                                                                storeData.updateStoreData('editorData', []);
                                                                storeData.updateStoreData('postData', {});
                                                                storeData.updateStoreData('multiPostData', []);
                                                                // router.push('/login');
                                                            })
                                                        }}>
                                                            Logout
                                                        </a>

                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className={`rz_mobile_menu ${state.toggleBtn ? 'active' : ''}`}>
                    <button className='rz_mobile_close' onClick={() => setMyState(setQuery, { toggleBtn: false })}>
                        <span>×</span>
                    </button>
                    <div className='rz_mobile_menu_content'>
                        <ul className="navbar-scroll">
                            {userData.role == 'Admin' && (
                                <>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/admin/dashboard")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }}
                                        className={isActive("/admin/dashboard") ? "nav-link active" : "nav-link"}
                                        >
                                            <span>{svg.app.dashBoard}</span>Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/admin/users")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/admin/users") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.userIcon}</span>Users
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/admin/templates")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/admin/templates") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.myReels}</span>Templates
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/admin/assets_tabs")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/admin/assets_tabs") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.categories}</span>Assets
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/admin/setting")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/admin/setting") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.Plan_icon}</span>Plans
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/admin/paymentSetting")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/admin/paymentSetting") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.settings}</span>Integrations
                                        </a>
                                    </li>
                                </>
                            )}
                            {userData.role == 'User' && (
                                <>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/dashboard")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }}
                                        className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
                                        >
                                            <span>{svg.app.dashBoard}</span>Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                                            setIsShow(true)
                                            changePage(e, "/create_post")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={!router.query.id && isActive("/create_post") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.create_post}</span>Create Post
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/calendar")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/calendar") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.myReels}</span>Calendar
                                        </a>
                                    </li>
                                    {userData?.plan?.editor_access && (
                                        <li>
                                            <a onClick={(e) => {
                                                changePage(e, "/image_editor/image_edit")
                                                setMyState(setQuery, { toggleBtn: false })
                                            }} className={isActive("/image_editor/image_edit") ? "nav-link active" : "nav-link"}>
                                                <span>{svg.app.image_creator}</span>Image Creator
                                            </a>
                                        </li>
                                    )}
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/Integrations")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/Integrations") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.integration}</span>Integrations
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/getdraft")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/getdraft") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.Plan_icon}</span>Drafts
                                        </a>
                                    </li>
                                </>
                            )}
                            {userData.role == 'Template Creator' && (
                                <>
                                    <li>
                                        <a onClick={(e) => {
                                            changePage(e, "/admin/templates")
                                            setMyState(setQuery, { toggleBtn: false })
                                        }} className={isActive("/admin/templates") ? "nav-link active" : "nav-link"}>
                                            <span>{svg.app.myReels}</span>Templates
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <div className={`rz_menu_overlay ${state.toggleBtn ? 'active' : ''}`} onClick={() => setMyState(setQuery, { toggleBtn: false })}></div>
            </div>
            <style jsx global>{`
                .rz_mobile_menu_btn {
                    display: none;
                    background: none;
                    border: none;
                    padding: 10px;
                    margin-left: auto;
                }

                .rz_mobile_menu_btn span {
                    display: block;
                    width: 25px;
                    height: 2px;
                    background: #fff;
                    margin: 5px 0;
                    transition: 0.3s;
                }

                .rz_mobile_menu {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 300px;
                    height: 100vh;
                    background: #0D0D14;
                    z-index: 1000;
                    transition: 0.3s ease;
                    padding: 20px;
                    overflow-y: auto;
                    box-shadow: -5px 0 15px rgba(0,0,0,0.3);
                    visibility: hidden;
                }

                .rz_mobile_menu.active {
                    right: 0;
                    visibility: visible;
                }

                .rz_mobile_menu_content {
                    padding-top: 60px;
                }

                .rz_mobile_menu .navbar-scroll {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .rz_mobile_menu .nav-link {
                    color: #fff;
                    padding: 12px 15px;
                    display: flex;
                    align-items: center;
                    border-radius: 8px;
                    margin-bottom: 5px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .rz_mobile_menu .nav-link span {
                    margin-right: 12px;
                    opacity: 0.7;
                }

                .rz_mobile_menu .nav-link:hover,
                .rz_mobile_menu .nav-link.active {
                    background: rgba(255,255,255,0.1);
                }

                .rz_mobile_close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 28px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: 0.3s;
                    z-index: 1001;
                }

                .rz_mobile_close:hover {
                    background: rgba(255,255,255,0.1);
                }

                .rz_menu_overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 999;
                    opacity: 0;
                    visibility: hidden;
                    transition: 0.3s;
                }

                @media (max-width: 991px) {
                    .rz_mobile_menu_btn {
                        display: block;
                    }

                    .rz_menu_overlay {
                        display: block;
                    }

                    .rz_menu_overlay.active {
                        opacity: 1;
                        visibility: visible;
                    }

                    .rz_note_for_demo {
                        margin-top: 20px;
                        padding: 15px;
                        background: rgba(255,255,255,0.05);
                        border-radius: 8px;
                    }

                    .rz_mainHeader .rz_navMenu {
                        display: none;
                    }
                }
            `}</style>

            <MyModal
                shown={state.createTemplatePopup}
                close={() => {
                    setMyState(setQuery, {
                        createTemplatePopup: false
                    })
                }}
            >
                <div className="modal-body">

                    <div className="modal-header">
                        <h3>Create New Template</h3>
                    </div>
                    <div className='rz_creatReels'>
                        <div className='rz_custom_form'>
                            <input type='text' className='rz_customInput' placeholder='Enter Title' value={state.tempTitle} onChange={e => {
                                setMyState(setQuery, {
                                    tempTitle: e.target.value
                                })
                            }} />
                        </div>
                    </div>
                    <div className='rz_creatReels'>
                        <div className='rz_custom_form rz_customSelect'>
                            <Select
                                placeholder={'Choose Category'}
                                options={state.categoriesList}
                                onChange={e => {
                                    setMyState(setQuery, {
                                        category: e.value.cate,
                                        subCategory: e.value.subCate
                                    })
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                    ...theme.colors,
                                      primary: '#426bff',
                                    },
                                  })}
                            />
                        </div>
                    </div>
                    <div className='rz_creatReels'>
                        <div className='rz_custom_form'>
                            <input type='text' className='rz_customInput' placeholder='Enter Tags' value={state.tags}
                                onChange={e => {
                                    setMyState(setQuery, {
                                        tags: e.target.value
                                    })
                                }} />
                        </div>
                    </div>
                    <button className='rz_btn' onClick={(e) => createNewTemplate(e)}>Continue</button>
                </div>

            </MyModal>
          
        </>

    )
}
export default Header