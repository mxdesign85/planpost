import svg from '@/components/svg';
import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Select from 'react-select';
import { NoDataWrapper, common, setMyState } from '@/components/Common';
import MyModal from '@/components/common/MyModal';
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import ConfirmationPopup from '@/components/common/ConfirmationPopup';


export default function Frames_page() {
    let [state, setQuery] = useState({
        assetsLoading: false,
        categoryLoading: false,
        modalShown: false,
        isPreviewModel: false,
        isRemoveAction: false,
        assetsData: [],
        totalRecords: 0,
        noRecord: false,
        page: 1,
        limit: 18,
        keyword: "",
        isEditModel: false,
    });
    const [isEditModel, setisEditModel] = useState(false);
    const [modalShown, setModalShown] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [previewAsset, setPreviewAsset] = useState();
    const [editAssets, setEditAssets] = useState({});
    const [isRemoveAction, setIsRemoveAction] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [assetsData, setAssetsData] = useState({
        mediaFiles: [],
        name: "",
        categoryId: "",
        tag: "",
    })

    const router = useRouter();

    let toggleModal = (updState = {}) => {
        setModalShown(false)
        setMyState(setQuery, {
            isEdit: false,
            isEditIndex: null,
            processAction: false,
        });
    }

    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        getAssets('search')
    }, [selectedCategory, state.keyword])

    const getCategories = () => {
        setMyState(setQuery, {
            categoryLoading: true,
        });
        common.getAPI({
            method: 'GET',
            url: 'category',
            data: {},
        }, (resp) => {
            let arr = []
            resp.data.map(category => {
                let data = {
                    id: category._id,
                    label: category.name,
                    value: category.name
                }
                arr.push(data)
            })
            setCategoriesData(arr)
        });
    }

    const getAssets = (type = null) => {
        setQuery({ ...state, assetsLoading: true });
        let currentPage = type == 'loadMore' ? state.page + 1 : (type == 'search' ? 1 : state.page);
        common.getAPI({
            method: 'GET',
            url: 'media',
            data: {
                mediaType: "image",
                page: currentPage,
                limit: state.limit,
                keyword: state.keyword,
                elementType :"frame",
            },
        }, (resp) => {
            if (resp.status) {
                setQuery({
                    ...state,
                    assetsData: type == 'loadMore' ? [...state.assetsData, ...resp.data] : resp.data,
                    assetsLoading: false,
                    totalRecords: resp.totalRecords,
                    page: currentPage
                })
            }
        });
    }

    const uploadMedia = (e) => {
        if(!e.target.files[0]?.type.includes("svg"))
        {
            assetsData.mediaFiles = e.target.files
            assetsData.name = e.target.files[0].name
            setAssetsData({ ...assetsData })
        }else{
            toast.error('File type not supported.');
            return
        }
    
    }


    const saveAssets = () => {
        if (!assetsData?.name) {
            toast.error('Please upload image');
            return
        } 


        let data = new FormData();
        data.append("file", assetsData.mediaFiles[0], assetsData.mediaFiles[0].name);
        var createElem = document.createElement(`img`);
        createElem.src = URL.createObjectURL(assetsData.mediaFiles[0]);
        createElem.onload = (e) => {
            var mediaMeta = {
                duration: createElem.duration,
                width: createElem.width,
                height: createElem.height,
            };
            data.append("meta", JSON.stringify(mediaMeta));
            if (assetsData.tag) {
                data.append("tags", assetsData.tag);
            }
            common.getAPI({
                method: 'POST',
                url: `media?mediaType=image&elementType=frame`,
                data: data,
                isFormData: true,
            }, (resp) => {
                toggleModal();
                setMyState(setQuery, {
                    assetsData: [],
                    page: 1,
                });
                setAssetsData({
                    mediaFiles: [],
                    name: "",
                    categoryId: "",
                    tag: ""
                })
                getAssets("search")
            });
        }

    }

    const viewAssets = (data) => {
        setPreviewAsset(data)
        setMyState(setQuery, {
            isPreviewModel: true
        });
    }


    const updateAsstes = (id, data) => {
        common.getAPI({
            method: 'PUT',
            url: `media-api`,
            data: {
                target: id,
                data: data
            },
        }, (resp) => {

        });
    }


    return (
        <>
            <Head>
                <title>{process.env.SITE_TITLE}- Assets</title>
            </Head>
            <div className='w-100' >
                <div className='ps_conatiner'>
                    <div className=' welcomeWrapper'>
                        <div className='rz_strackDv '>
                          
                            <div className="width100 py-md-3 py-1 ">
                                <div className='rz_custom_form mt-0 ms-md-2 ms-0'>
                                    <input type='search' placeholder='Search' className='rz_customInput'
                                        onChange={(e) => {
                                            if (e.target.value.trim() == "") {
                                                setQuery({ ...state, page: 1, keyword: e.target.value });
                                            }

                                        }}
                                        onKeyDown={(e) => {

                                            if ((e.key === 'Enter' || e.keyCode === 13 || e.which === 13)) {
                                                setQuery({ ...state, page: 1, keyword: e.target.value });

                                            }
                                        }}
                                    />
                                    <span className='rz_inputIcon'>{svg.app.searchIcon}</span>
                                </div>
                            </div>
                            <div className="py-3 ms-md-auto ">

                                <div className="ps_image_editor_btn_box">
                                    <a className='rz_addAccBtn' onClick={() => {

                                        setModalShown(true)
                                    }}>Add New Frames</a>
                                   
                                </div>
                            </div>

                        </div>
                        <div className='row'>
                            <div className='ps_assets'>
                                {state?.assetsData?.length > 0 && state?.assetsData?.map((assetData, i) => {
                                    return <div key={assetData._id} className='ps_assets_img'>
                                        <img src={process.env.S3_PATH + assetData.path} alt='' />

                                        <div className='spv-template-staus'>
                                            <label htmlFor={assetData._id} className="switch ">
                                                <input type="checkbox" title="Status" className="tooltiped" id={assetData._id}
                                                    checked={assetData.status}
                                                    onChange={e => {
                                                        let data = [...state.assetsData]
                                                        data[i].status = (assetData.status == 0 ? 1 : 0)
                                                        setQuery({
                                                            ...state,
                                                            assetsData: data,

                                                        })
                                                        let assets = {
                                                            status: assetData.status
                                                        }
                                                        updateAsstes(assetData._id, assets)
                                                    }}
                                                />
                                                <span className="switch-status"></span>
                                            </label>
                                        </div>

                                        <div className="spv-stockImage" >   
                                            <a className="spv-btn spv-viewBtn" onClick={() => viewAssets(assetData)}>
                                                {svg.app.eyeIcon}
                                            </a>
                                            <a className="spv-btn spv-viewBtn" onClick={() => {
                                                setIsRemoveAction(assetData._id)
                                            }} >
                                                {svg.app.deleteIcon}
                                            </a>

                                        </div>
                                    </div>
                                })}

                            </div>
                        </div>

                        {
                            <NoDataWrapper
                                isLoading={state.assetsLoading}
                                blockCount="5"
                                height="180"
                                width="150"
                                className="ps_skelton_div px-1 py-2"
                                section="blocks"
                                dataCount={state.assetsData.length}
                                title={'Frames not found.'}
                            />
                        }

                        {
                            state.assetsData.length < state.totalRecords ?
                                <div className='rz_col_12'>
                                    <a className='ps_image_creator_blk_btn' style={{ margin: "20px auto" }} onClick={() => {
                                        getAssets("loadMore");
                                    }}>{state.assetsLoading ? 'Loading...' : 'Load More'}
                                        {svg.app.loadmore}
                                    </a>
                                </div>
                                : <></>
                        }

                    </div>
                </div>
            </div>
            <MyModal
                shown={modalShown}
                close={() => {
                    toggleModal();
                    assetsData.categoryId = "";
                    assetsData.name = "";
                    assetsData.tag = "";
                    assetsData.mediaFiles = [];
                    setAssetsData({ ...assetsData })
                }}
            >
                <form onSubmit={e => {
                    manageUsers(e)
                }}>
                    <div className="modal-body">
                        <div className="modal-header">
                            <h3>{state.isEdit ? 'Update Frames' : 'Add New Frame'}</h3>
                        </div>
                        <div className='rz_creatReels'>
                            <div className='ps_assets_upload_inner'>
                                <label htmlFor="rz_uploadAudio" className='rz_uploadBtn'>
                                    <span className='ps_assets_icon'>
                                        {svg.app.uploadIcon}
                                    </span>
                                    <div className='ps_assets_text'>
                                        <h6> Upload Frame</h6>
                                        <p>Supports: jpeg, png</p>
                                    </div>
                                    <input disabled={process.env.TYPE == "demo" ? true : false} type='file' className='rz_customFile' accept={"images"} onChange={(e) => uploadMedia(e)} />
                                </label>
                            </div>
                        </div>
                        <div className='rz_creatReels'>
                            <div className='rz_custom_form'>
                                <div className='d-flex'><label className="form-label"> Tag </label> <div className='ps_admin_password_tooltip'>{svg.app.i_icon}  <span className='rz_tooltipSpan'>Tag will help you to search assets.</span></div></div>
                                <input type='text' className='rz_customInput' placeholder='Please enter tag' value={assetsData?.tag} onChange={(e) => {
                                    let d1 = { ...assetsData }
                                    d1.tag = e.target.value
                                    setAssetsData(d1)
                                }} />
                            </div>
                        </div>

                        <div className='d-flex justify-content-center'><button disabled={process.env.TYPE == "demo" ? true : false} type='button' className='rz_btn' onClick={saveAssets}>{state.isEdit ? 'Update' : 'Add '}</button></div>
                    </div>
                </form>
            </MyModal >

            <MyModal
                shown={state.isPreviewModel}
                close={() => {
                    
                    setMyState(setQuery, {
                        isPreviewModel: false
                    });
                }}
            >
                <div className="modal-body">
                    <div className="modal-header">
                        <h3>Preview Frame</h3>
                    </div>
                    {previewAsset?.path ? <div className='preview_Image'>
                        <img src={process.env.S3_PATH + previewAsset?.path} />
                    </div> : <div className='preview_Image'>
                        <img src="../assets/images/test2.jpg" />
                    </div>}
                </div>
            </MyModal>
          

            <ConfirmationPopup
                shownPopup={isRemoveAction}
                closePopup={() => {
                    setIsRemoveAction(false)
                }}
                type={"Assets"}
                removeAction={() => {
                    common.getAPI({
                        method: 'DELETE',
                        url: 'media',
                        data: {
                            target: isRemoveAction
                        },
                    }, (resp) => {

                        if (resp.status) {
                            setIsRemoveAction(false);

                            getAssets()
                        }
                    });
                }}
            />
        </>
    )
}
