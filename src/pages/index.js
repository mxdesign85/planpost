import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Image from 'next/image';
import { appStore } from "@/zu_store/appStore";
import Link from 'next/link';

const Home = () => {
    let storeData = appStore(state => state);
    let userData = storeData.userData;

    useEffect(() => {
        callApi(); // Call the API when the component mounts
    }, []);

    const callApi = async () => {
        try {
            const response = await fetch(`/api/subscription-plan`);
            const data = await response.json();
            updatePlans(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [isVisible, setIsVisible] = useState(false);

    // Show button when scrolling down 300px
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            // Cleanup the event listener
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    const updatePlans = (data) => {
        const plansContainer = document.getElementById('showPlans');
        data.forEach((plan) => {
            const parent = document.createElement('div');
            parent.className = 'col-lg-4 col-md-6 ps-standard-plan';
            const planDiv = document.createElement('div');
            planDiv.className = 'ps-plans-holder';

            const heading = document.createElement('h4');
            heading.textContent = plan.name;

            const price = document.createElement('span');
            price.className = 'ps-plan-price';
            price.innerHTML = `<a href="javascript:void(0);">$<span>${plan?.price || 0}</span><sub>/${plan?.time_period || ""}</sub></a>`;

            const des = document.createElement("div");
            des.className = "ps-price-list";

            const descriptions = [
                `<img src="../assets/images/landing/check.png" alt=""> ${plan?.description || ''}`,
                `<img src="../assets/images/landing/check.png" alt=""><span> Post Per Month : </span> ${plan?.post_per_month || ''}`,
                `<img src="../assets/images/landing/check.png" alt=""><span> Post Type : </span>${plan?.post_type?.charAt(0).toUpperCase() + plan?.post_type?.slice(1) || ''}`,
                `<img src="../assets/images/landing/check.png" alt=""><span> Trial Period : </span>${plan?.trial_period ? `${plan.trial_period} Day` : ''}`,
                plan?.ai_image_generate ? `<img src="../assets/images/landing/check.png" alt="">  <span> AI Image Generate </span>` : "",
                plan?.ai_text_generate ? `<img src="../assets/images/landing/check.png" alt="">  <span> AI Text Generate </span>` : "",
                plan?.editor_access ? `<img src="../assets/images/landing/check.png" alt="">  <span> Editor Access </span>` : ""
            ];

            descriptions.forEach(desc => {
                if (desc) {
                    const p = document.createElement('p');
                    p.innerHTML = desc;
                    des.appendChild(p);
                }
            });

            const choosePlanBtn = document.createElement('a');
            choosePlanBtn.href = `payment?id=${plan?.id}`;
            choosePlanBtn.className = 'ps-btn';
            choosePlanBtn.textContent = 'Choose Plan';
            planDiv.appendChild(heading);
            planDiv.appendChild(price);
            planDiv.appendChild(des);
            planDiv.appendChild(choosePlanBtn);
            parent.appendChild(planDiv);
            plansContainer.appendChild(parent);
        });
    };

    return (
        <>
            <Head>
                <title>PlanPost</title>
                
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" />
                <link rel="shortcut icon" href={(userData.adminfaviconUrl)?userData.adminfaviconUrl:"../assets/images/favicon.png"} />
                {/* Add any other stylesheets as needed */}
            </Head>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.1/js/bootstrap.min.js" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/smooth-scroll/16.1.3/smooth-scroll.min.js" />
            <Script src="assets/js/custom.js" />

            <div className="ps-top-icon" style={{ display: isVisible ? 'block' : 'none' }}>
                <Link href="" id="button" onClick={handleScrollToTop}>
                    <svg width="23" height="18" viewBox="0 0 23 18">
                        <path
                            d="M13.825,18.000 C10.772,18.000 7.928,16.517 6.217,14.033 C5.870,13.530 6.006,12.845 6.519,12.505 C7.032,12.165 7.729,12.297 8.076,12.801 C9.369,14.678 11.518,15.799 13.825,15.799 C17.647,15.799 20.757,12.749 20.757,9.000 C20.757,5.251 17.647,2.200 13.825,2.200 C11.512,2.200 9.359,3.326 8.067,5.212 C7.721,5.717 7.024,5.851 6.510,5.512 C5.996,5.173 5.859,4.489 6.205,3.985 C7.915,1.490 10.763,-0.000 13.825,-0.000 C18.884,-0.000 23.000,4.037 23.000,9.000 C23.000,13.963 18.884,18.000 13.825,18.000 ZM11.293,6.704 C10.902,6.313 10.902,5.679 11.293,5.287 C11.683,4.896 12.316,4.896 12.707,5.287 L15.706,8.291 C15.730,8.315 15.752,8.339 15.772,8.365 C15.777,8.371 15.782,8.377 15.787,8.384 C15.802,8.403 15.817,8.423 15.831,8.443 C15.835,8.449 15.838,8.455 15.842,8.462 C15.856,8.483 15.869,8.505 15.881,8.527 C15.883,8.532 15.886,8.537 15.888,8.541 C15.901,8.566 15.913,8.590 15.923,8.616 C15.925,8.619 15.925,8.622 15.927,8.626 C15.938,8.653 15.948,8.680 15.956,8.708 C15.957,8.712 15.958,8.715 15.959,8.719 C15.967,8.747 15.974,8.774 15.980,8.803 C15.982,8.812 15.982,8.820 15.984,8.829 C15.988,8.852 15.992,8.876 15.995,8.900 C15.998,8.933 16.000,8.966 16.000,9.000 C16.000,9.033 15.998,9.067 15.995,9.100 C15.992,9.124 15.988,9.148 15.984,9.172 C15.982,9.180 15.982,9.189 15.980,9.197 C15.974,9.226 15.967,9.254 15.959,9.282 C15.958,9.285 15.957,9.288 15.956,9.292 C15.948,9.320 15.938,9.348 15.927,9.375 C15.925,9.378 15.925,9.381 15.923,9.384 C15.913,9.410 15.901,9.435 15.888,9.459 C15.886,9.464 15.883,9.468 15.881,9.473 C15.869,9.495 15.856,9.517 15.842,9.539 C15.838,9.545 15.835,9.551 15.831,9.557 C15.817,9.577 15.802,9.597 15.787,9.616 C15.782,9.623 15.777,9.629 15.772,9.636 C15.752,9.661 15.730,9.685 15.707,9.708 L12.707,12.712 C12.511,12.908 12.256,13.006 12.000,13.006 C11.744,13.006 11.488,12.908 11.293,12.712 C10.902,12.321 10.902,11.688 11.293,11.296 L12.586,10.001 L1.000,10.001 C0.448,10.001 -0.000,9.553 -0.000,9.000 C-0.000,8.447 0.448,7.998 1.000,7.998 L12.586,7.998 L11.293,6.704 Z"
                        />
                    </svg>
                </Link>
            </div>

            <header className="ps-header-wrapper">
                <div className="container">
                    <div className="ps-header-flex">
                        {/* <div className="ps-logo">
                            <a href="/">
                                <Image src="/assets/images/White-Logo.png" alt="" width={150} height={50} />
                            </a>
                        </div> */}
                        <div className='rz_logo'>                             
                                    <span className='ps_logo_header'> <img src={(userData.adminprofileUrl)?userData.adminprofileUrl:process.env.APP_LOGO} alt="" /></span>
                            </div>
                        <div className="ps-menu">
                            <ul>
                                <li><Link href="#features">Features</Link></li>
                                <li><Link href="#plans">Plans</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="ps-header-btn">
                                <Link href="/login" className="ps-btn">login</Link>
                                <Link href="#plans" className="ps-btn">buy now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <style jsx global>{`
                :root {
                    --dark-bg: #14141F;
                    --darker-bg: #0D0D14;
                    --primary: #6366f1;
                    --accent: #FF5733;
                    --text-light: #fff;
                    --text-gray: #94A3B8;
                }

                body {
                    background: var(--dark-bg);
                    color: var(--text-light);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .ps-banner-wrapper {
                    background: var(--darker-bg, #0D0D14);
                    min-height: 100vh;
                    padding: 120px 0 80px;
                    position: relative;
                    overflow: hidden;
                }

                .ps-banner-wrapper::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 80% 80%, rgba(255, 87, 51, 0.15) 0%, transparent 40%);
                    pointer-events: none;
                }

                .star-decoration {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    opacity: 0.6;
                    pointer-events: none;
                    animation: twinkle 3s infinite ease-in-out;
                }

                .star-1 { top: 15%; left: 10%; animation-delay: 0s; }
                .star-2 { top: 25%; right: 15%; animation-delay: 0.5s; }
                .star-3 { bottom: 30%; left: 20%; animation-delay: 1s; }
                .star-4 { bottom: 20%; right: 10%; animation-delay: 1.5s; }
                .star-5 { top: 40%; left: 50%; animation-delay: 2s; }

                @keyframes twinkle {
                    0%, 100% { 
                        opacity: 0.3;
                        transform: scale(0.8) rotate(0deg);
                    }
                    50% { 
                        opacity: 0.8;
                        transform: scale(1.2) rotate(45deg);
                    }
                }

                .ps-banner-flex {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    min-height: calc(100vh - 200px);
                }

                .ps-banner-main {
                    text-align: center;
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 2;
                }

                .ps-banner-heading {
                    margin-bottom: 40px;
                }

                .ps-banner-heading h2 {
                    font-size: 48px;
                    font-weight: 700;
                    color: var(--text-light, #fff);
                    line-height: 1.2;
                    margin-bottom: 16px;
                }

                .ps-banner-heading h1 {
                    font-size: 32px;
                    color: var(--accent);
                    font-weight: 700;
                }

                /* Vector Images Positioning */
                .ps-banner-vec1, .ps-banner-vec2, .ps-banner-vec3,
                .ps-banner-vec4, .ps-banner-vec5, .ps-banner-vec6 {
                    position: absolute;
                    width: 120px;
                    height: 120px;
                    transition: all 0.3s ease;
                    filter: brightness(1.2);
                    opacity: 0.9;
                }

                /* Top vectors */
                .ps-banner-vec1 {
                    top: 10%;
                    left: 20%;
                    animation: float 4s infinite ease-in-out;
                }

                .ps-banner-vec2 {
                    top: 15%;
                    right: 20%;
                    animation: float 4s infinite ease-in-out 0.5s;
                }

                /* Middle vectors */
                .ps-banner-vec3 {
                    top: 50%;
                    left: 5%;
                    transform: translateY(-50%);
                    animation: float 4s infinite ease-in-out 1s;
                }

                .ps-banner-vec4 {
                    top: 50%;
                    right: 5%;
                    transform: translateY(-50%);
                    animation: float 4s infinite ease-in-out 1.5s;
                }

                /* Bottom vectors */
                .ps-banner-vec5 {
                    bottom: 15%;
                    left: 20%;
                    animation: float 4s infinite ease-in-out 2s;
                }

                .ps-banner-vec6 {
                    bottom: 10%;
                    right: 20%;
                    animation: float 4s infinite ease-in-out 2.5s;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(5deg);
                    }
                }

                @media (max-width: 991px) {
                    .ps-banner-vec1, .ps-banner-vec2, .ps-banner-vec3,
                    .ps-banner-vec4, .ps-banner-vec5, .ps-banner-vec6 {
                        width: 80px;
                        height: 80px;
                    }
                }

                @media (max-width: 767px) {
                    .ps-banner-vec1, .ps-banner-vec2, .ps-banner-vec3,
                    .ps-banner-vec4, .ps-banner-vec5, .ps-banner-vec6 {
                        display: none;
                    }
                }

                @media (max-width: 991px) {
                    .ps-banner-heading h2 {
                        font-size: 36px;
                    }
                    .ps-banner-heading h1 {
                        font-size: 28px;
                    }
                    .ps-banner-left {
                        display: none;
                    }
                }

                @media (max-width: 767px) {
                    .ps-banner-wrapper {
                        padding: 100px 0 60px;
                    }
                    .ps-banner-heading h2 {
                        font-size: 28px;
                    }
                    .ps-banner-heading h1 {
                        font-size: 24px;
                    }
                }
            `}</style>

            <section className="ps-banner-wrapper">
                <div className="container">
                    <div className="ps-banner-flex">
                                <img src="../assets/images/landing/banner-vec1.png" alt="" className="ps-banner-vec1" />
                                <img src="../assets/images/landing/banner-vec2.png" alt="" className="ps-banner-vec2" />
                                <img src="../assets/images/landing/banner-vec3.png" alt="" className="ps-banner-vec3" />
                        <img src="../assets/images/landing/banner-vec4.png" alt="" className="ps-banner-vec4" />
                        <img src="../assets/images/landing/banner-vec5.png" alt="" className="ps-banner-vec5" />
                        <img src="../assets/images/landing/banner-vec6.png" alt="" className="ps-banner-vec6" />
                        
                        <div className="ps-banner-main">
                            <div className="ps-banner-heading">
                                <h2>Design, Plan, Schedule <br /> Elevate Your Social Media Presence with</h2>
                                <h1>Effortless Content Design</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .ps-feature-wrapper {
                    background: var(--darker-bg, #0D0D14);
                    padding: 100px 0;
                    position: relative;
                    overflow: hidden;
                }

                .ps-feature-wrapper::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
                }

                .ps-feature-heading {
                    text-align: center;
                    margin-bottom: 80px;
                }

                .ps-feature-heading h4 {
                    color: linear-gradient(211deg, #8F79FF 13.4%, #426BFF 118.74%);
                    /* font-size: 14px; */
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 16px;
                    background: linear-gradient(211deg, #8F79FF 13.4%, #426BFF 118.74%);
                    background: -moz-linear-gradient(315deg, #6366f1, #818cf8);
                    background: -o-linear-gradient(315deg, #6366f1, #818cf8);
                    /* background: linear-gradient(135deg, #6366f1, #818cf8); */
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .ps-feature-heading h1 {
                   font-size: 56px;
                    font-weight: 700;
                    margin: 0;
                    background: #fff;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-transform: none;
                }

                .ps-feature-main-parent {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    position: relative;
                    z-index: 1;
                }

                .ps-feature-left {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .ps-feature-img {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 30px;
                    transition: all 0.3s ease;
                }

                .ps-feature-img:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .ps-feature-img img {
                    width: 100%;
                    height: auto;
                    border-radius: 16px;
                }

                .ps-feature-cstm-box {
                    text-align: left;
                    padding: 30px;
                }

                .ps-feature-cstm-box h1 {
                    color: #fff;
                    font-size: 24px;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-top: 20px;
                }

                .ps-feature-right {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .ps-feature-right-flex {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }

                .ps-feature-right-inner2 {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                @media (max-width: 991px) {
                    .ps-feature-main-parent {
                        grid-template-columns: 1fr;
                    }
                    .ps-feature-heading h1 {
                        font-size: 42px;
                    }
                }

                @media (max-width: 767px) {
                    .ps-feature-right-flex {
                        grid-template-columns: 1fr;
                    }
                    .ps-feature-heading {
                        margin-bottom: 60px;
                    }
                    .ps-feature-heading h1 {
                        font-size: 36px;
                    }
                }
            `}</style>

            <section className="ps-feature-wrapper">
                <div className="container">
                    <div className="ps-feature-heading">
                        <h4>MOST PREMIUM AND EXCLUSIVE</h4>
                        <h1>Features</h1>
                    </div>
                    <div className="ps-feature-main-parent">
                        <div className="ps-feature-left">
                            <div className="ps-feature-img">
                                <img src="../assets/images/landing/f1.png" alt="" />
                            </div>
                            <div className="ps-feature-img">
                                <div className="ps-feature-cstm-box">
                                    <img src="../assets/images/landing/user-img.png" alt="" />
                                    <h1>The User Dashboard Makes Your Journey As Smooth As Possible</h1>
                                </div>
                            </div>
                        </div>
                        <div className="ps-feature-right">
                            <div className="ps-feature-right-flex">
                                <div className="ps-feature-right-inner">
                                    <div className="ps-feature-img ps-feat-2">
                                        <img src="../assets/images/landing/f2.png" alt="" />
                                    </div>
                                </div>
                                <div className="ps-feature-right-inner2">
                                    <div className="ps-feature-img">
                                        <img src="../assets/images/landing/f3.png" alt="" />
                                    </div>
                                    <div className="ps-feature-img">
                                        <img src="../assets/images/landing/f4.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ps-editor-wrapper">
                <div className="container">
                    <div className="ps-editor-heading">
                        <div className="ps-admin-grednt">
                            <h4>Awsome Editor</h4>
                        </div>
                        <h1>Create stunning social media visuals effortlessly with our premium editor
                        </h1>
                    </div>
                    {/* <div className="ps-editor-main-img">
                        <img src="../assets/images/landing/editor-main-img.png" alt="" />
                    </div> */}
                    <div className="ps-editr-info-main">
                        <div className="row gy-4 align-items-center">
                            <div className="col-lg-6">
                                <div className="ps-editr-content">
                                    <h4>Sketch up your ideas with Pencil</h4>
                                    <p>Bring your creative concepts to life with Pencil, a versatile tool that allows you to
                                        sketch and visualize your ideas with ease. Unleash your imagination and turn your
                                        visions into reality. Transform abstract ideas into captivating visuals as you sketch
                                        and outline your post concepts.</p>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="ps-editr-img">
                                    <img src="../assets/images/landing/e1.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="row gy-4 align-items-center">
                            <div className="col-lg-6">
                                <div className="ps-editr-img">
                                    <img src="../assets/images/landing/e2.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="ps-editr-content">
                                    <h4>Transform Your Content with Typography Options</h4>
                                    <p>PlanPost Editor offers a variety of typography options to customize headings,
                                        paragraphs, and other elements with font style, color, size, and line height. You can
                                        also bold, underline, and strikethrough to make your text stand out and captivate
                                        readers. With typography, you can create engaging and impactful content.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row gy-4 align-items-center">
                            <div className="col-lg-6">
                                <div className="ps-editr-content">
                                    <h4>Upload Edit & filters Images</h4>
                                    <p>Say hello to Image Upload, Editing, and Filters - your one-stop solution for creating
                                        eye-catching posts. Seamlessly upload images directly to your posts. Crop, resize, and
                                        rotate your images to fit your desired layout. Apply stunning filters to enhance your
                                        photos and create a cohesive aesthetic.</p>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="ps-editr-img">
                                    <img src="../assets/images/landing/e3.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="row gy-4 align-items-center">
                            <div className="col-lg-6">
                                <div className="ps-editr-img">
                                    <img src="../assets/images/landing/e4.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="ps-editr-content">
                                    <h4>Use Unlimited Shapes</h4>
                                    <p>Bring your creative ideas to life with a versatile set of shapes. With this feature, the
                                        possibilities are endless, and your posts will be more dynamic and eye-catching than
                                        ever. Stand out from the crowd and craft engaging content that resonates with your
                                        audience.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row gy-4 align-items-center">
                            <div className="col-lg-6">
                                <div className="ps-editr-content">
                                    <h4>Filters Images</h4>
                                    <p>Elevate your visual game and give your photos a fresh, exciting look. With a wide range
                                    of filters to choose from, you can transform your images into stunning works of art. Get
                                    started today and create eye-catching, shareable content that your audience will love.
                                        It&apos;s time to let your creativity shine!</p>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="ps-editr-img">
                                    <img src="../assets/images/landing/e5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .ps-editor-wrapper {
                    background: var(--darker-bg, #0D0D14);
                    padding: 120px 0;
                    position: relative;
                    overflow: hidden;
                }

                .ps-editor-wrapper::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%);
                    pointer-events: none;
                }

                /* Add glowing orbs in the background */
                .ps-editor-wrapper::after {
                    content: '';
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.15), transparent 70%);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    filter: blur(90px);
                    pointer-events: none;
                    animation: pulse 8s infinite ease-in-out;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 0.7;
                    }
                }

                .ps-editor-main-img {
                    position: relative;
                    margin-bottom: 100px;
                    z-index: 1;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 20px;
                    backdrop-filter: blur(10px);
                }

                .ps-editor-main-img::before {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5));
                    -webkit-mask: 
                        linear-gradient(#fff 0 0) content-box, 
                        linear-gradient(#fff 0 0);
                    mask: 
                        linear-gradient(#fff 0 0) content-box, 
                        linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                }

                .ps-editr-img {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 20px;
                    transition: all 0.3s ease;
                    position: relative;
                    backdrop-filter: blur(10px);
                }

                .ps-editr-img::before {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
                    -webkit-mask: 
                        linear-gradient(#fff 0 0) content-box, 
                        linear-gradient(#fff 0 0);
                    mask: 
                        linear-gradient(#fff 0 0) content-box, 
                        linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                }

                .ps-editr-img:hover {
                    transform: translateY(-5px);
                    box-shadow: 
                        0 20px 40px rgba(0, 0, 0, 0.2),
                        0 0 30px rgba(99, 102, 241, 0.2);
                }

                .ps-editr-content {
                    position: relative;
                    z-index: 1;
                }

                .ps-editor-heading {
                    text-align: center;
                
                    position: relative;
                    z-index: 1;
                }

                .ps-admin-grednt h4 {
                    color: #FF5733;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 16px;
                }

                .ps-editor-heading h1 {
                    font-size: 42px;
                    font-weight: 700;
                    color: #fff;
                    max-width: 800px;
                    margin: 0 auto;
                    line-height: 1.3;
                }

                .ps-editor-main-img {
                    position: relative;
                    margin-bottom: 100px;
                    z-index: 1;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 20px;
                }

                .ps-editor-main-img img {
                    width: 100%;
                    height: auto;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .ps-editr-content {
                    padding: 40px;
                }

                .ps-editr-content h4 {
                    font-size: 28px;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 20px;
                }

                .ps-editr-content p {
                    font-size: 16px;
                    line-height: 1.7;
                    color: #94A3B8;
                    margin: 0;
                }

                .ps-editr-img {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }

                .ps-editr-img:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .ps-editr-img img {
                    width: 100%;
                    height: auto;
                    border-radius: 16px;
                }

                .row {
                    margin-bottom: 80px;
                }

                .row:last-child {
                    margin-bottom: 0;
                }

                @media (max-width: 991px) {
                    .ps-editor-heading h1 {
                        font-size: 36px;
                    }
                    .ps-editr-content {
                        padding: 30px;
                    }
                    .ps-editr-content h4 {
                        font-size: 24px;
                    }
                }

                @media (max-width: 767px) {
                    .ps-editor-wrapper {
                        padding: 80px 0;
                    }
                    .ps-editor-heading h1 {
                        font-size: 28px;
                    }
                    .ps-editr-content {
                        padding: 20px 0;
                    }
                    .row {
                        margin-bottom: 60px;
                    }
                }
            `}</style>

            <style jsx global>{`
                .ps-feature-box-wrapper {
                    background: var(--darker-bg, #0D0D14);
                    padding: 120px 0;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }

                .ps-feature-box-heading {
                    text-align: center;
                    margin-bottom: 80px;
                    position: relative;
                    z-index: 1;
                }

                .ps-feature-box-heading h4 {
                      color: linear-gradient(211deg, #8F79FF 13.4%, #426BFF 118.74%);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 16px;
                    background: linear-gradient(211deg, #8F79FF 13.4%, #426BFF 118.74%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 42px;
                }

                .ps-feature-box-heading h1 {
                    font-size: 48px;
                    font-weight: 700;
                    background: #fff;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0 auto;
                    max-width: 600px;
                    line-height: 1.3;
                }

                .ps-feature-box-main {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .ps-feature-box-inner {
                    background: #ffffff00;
                    border-radius: 20px;
                    padding: 40px 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 180px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    border: 1px solid #3C3C77;
                }

                .ps-feature-box-inner:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }

                .ps-feature-box-inner img {
                    width: 56px;
                    height: 56px;
                    margin-bottom: 24px;
                    border-radius: 12px;
                }

                .ps-feature-box-inner p {
                       font-size: 16px;
                        font-weight: 600;
                        color: #ffffff;
                        margin: 0;
                }

                .ps-feature-box-inner.special {
                    grid-column: span 2;
                    background: linear-gradient(135deg, #6366f1, #818cf8);
                }

                .ps-feature-box-inner.special p {
                    color: #fff;
                }

                @media (max-width: 1199px) {
                    .ps-feature-box-main {
                        grid-template-columns: repeat(3, 1fr);
                        max-width: 900px;
                    }
                }

                @media (max-width: 991px) {
                    .ps-feature-box-main {
                        grid-template-columns: repeat(2, 1fr);
                        max-width: 600px;
                    }
                    .ps-feature-box-heading h1 {
                        font-size: 36px;
                    }
                }

                @media (max-width: 767px) {
                    .ps-feature-box-wrapper {
                        padding: 80px 0;
                    }
                    .ps-feature-box-heading {
                        margin-bottom: 60px;
                    }
                    .ps-feature-box-heading h1 {
                        font-size: 28px;
                    }
                    .ps-feature-box-main {
                        grid-template-columns: 1fr;
                        max-width: 320px;
                    }
                    .ps-feature-box-inner {
                        min-height: 160px;
                        padding: 30px 20px;
                    }
                    .ps-feature-box-inner.special {
                        grid-column: span 1;
                    }
                }
            `}</style>

            <section className="ps-feature-box-wrapper" id="feature">
                <div className="container">
                    <div className="ps-feature-box-heading">
                        <h4>OUR COUNTLESS KEY</h4>
                        <h1>Features</h1>
                    </div>
                    <div className="ps-feature-box-main">
                                <div className="ps-feature-box-inner">
                                    <img src="../assets/images/landing/fb1.png" alt="" />
                                    <p>User Dashboard</p>
                                </div>
                                <div className="ps-feature-box-inner">
                                    <img src="../assets/images/landing/fb4.png" alt="" />
                                    <p>Assets Management</p>
                                </div>
                                <div className="ps-feature-box-inner">
                                    <img src="../assets/images/landing/fb5.png" alt="" />
                            <p>Create & Customize Post</p>
                                </div>
                                <div className="ps-feature-box-inner">
                                    <img src="../assets/images/landing/fb6.png" alt="" />
                                    <p>Post Analytics</p>
                                </div>
                                <div className="ps-feature-box-inner">
                                    <img src="../assets/images/landing/fb7.png" alt="" />
                                    <p>Social Media Integration</p>
                                </div>
                                <div className="ps-feature-box-inner">
                                    <img src="../assets/images/landing/fb8.png" alt="" />
                                    <p>Schedule Post</p>
                                </div>
                                <div className="ps-feature-box-inner">
                                    <img src="../assets/images/landing/fb9.png" alt="" />
                                    <p>Post Calendar</p>
                                </div>
                                <div className="ps-feature-box-inner">
                                    <img src="../assets/images/landing/fb10.png" alt="" />
                                    <p>Image Creator</p>
                                </div>
                        <div className="ps-feature-box-inner special">
                                    <img src="../assets/images/landing/fb11.png" alt="" />
                                    <p>User Friendly Design</p>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .ps-pricing-wrapper {
                    background: var(--darker-bg, #0D0D14);
                    padding: 120px 0;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }

                .ps-pricing-wrapper::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
                    pointer-events: none;
                }

                .ps-pricing-heading {
                    margin-bottom: 60px;
                    position: relative;
                    z-index: 1;
                }

                .ps-pricing-heading h1 {
                    font-size: 48px;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 30px;
                }

                .ps-pricing-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .ps-pricing-toggle span {
                    font-size: 16px;
                    color: #94A3B8;
                }

                .ps-pricing-toggle span.active {
                    color: #FF5733;
                }

                .ps-pricing-toggle .toggle-switch {
                    position: relative;
                    width: 60px;
                    height: 32px;
                    background: #6366f1;
                    border-radius: 20px;
                    padding: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .ps-pricing-toggle .toggle-switch::before {
                    content: '';
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    background: #fff;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .ps-pricing-toggle .toggle-switch.yearly::before {
                    transform: translateX(28px);
                }

                .ps-plans-table {
                    position: relative;
                    z-index: 1;
                }

                .ps-plans-holder {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 40px 30px;
                    height: 100%;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .ps-plans-holder:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .ps-plans-holder h4 {
                    font-size: 24px;
                    color: #6366f1;
                    margin-bottom: 20px;
                }

                .ps-plan-price {
                    font-size: 48px;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 30px;
                    display: block;
                }

                .ps-plan-price sub {
                    font-size: 16px;
                    opacity: 0.8;
                }

                .ps-price-list {
                    text-align: left;
                    margin-bottom: 30px;
                }

                .ps-price-list p {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #94A3B8;
                    margin-bottom: 15px;
                    font-size: 15px;
                }

                .ps-price-list p img {
                    width: 20px;
                    height: 20px;
                }

                .ps-btn {
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #6366f1, #818cf8);
                    color: #fff;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .ps-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
                }

                .ps-standard-plan {
                    position: relative;
                }

                .ps-standard-plan::before {
                    content: 'Popular';
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #FF5733;
                    color: #fff;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    z-index: 2;
                }

                @media (max-width: 991px) {
                    .ps-pricing-heading h1 {
                        font-size: 36px;
                    }
                    .ps-plans-holder {
                        padding: 30px 20px;
                    }
                }

                @media (max-width: 767px) {
                    .ps-pricing-wrapper {
                        padding: 80px 0;
                    }
                    .ps-pricing-heading h1 {
                        font-size: 28px;
                    }
                    .ps-pricing-toggle {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
            `}</style>

            <section className="ps-pricing-wrapper" id="plans">
                <div className="container">
                    <div className="ps-pricing-heading">
                        <h1>Flexible Pricing Plans That Your Needs</h1>
                        {/* <div className="ps-pricing-toggle">
                            <span className="active">Pay Monthly</span>
                            <div className="toggle-switch"></div>
                            <span>Pay Yearly <span className="save-badge">Save 20%</span></span>
                        </div> */}
                    </div>
                    <div id="monthlyPlan" className="ps-plans-table">
                        <div className="row gy-4" id="showPlans">
                            {/* Your existing dynamic plan content will be inserted here */}
                        </div>
                    </div>
                </div>
            </section>

            <section className="ps-temnl-wrapper">
            <div className="container">
    <div className="ps-tsmnl-heading">
        <img src="../assets/images/landing/rating.png" alt="Customer Ratings" />
        <h1>Don&apos;t take our word for it. Trust our Customers&apos; Feedback</h1>
    </div>
    <div className="row gy-4">
        {/* First Client */}
        <div className="col-lg-4 col-md-6">
            <div className="ps-tesmnl-box">
                <div className="ps-tesmnl-inner">
                    <div className="ps-tesmnl-head-flex">
                        <img src="../assets/images/landing/client1.jpg" alt="Esther Howard" />
                        <div className="ps-tesmnl-clnt-info">
                            <h4>Esther Howard</h4>
                            <p>UI / UX Design</p>
                        </div>
                    </div>
                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.</p>
                </div>
            </div>
        </div>
        {/* Second Client */}
        <div className="col-lg-4 col-md-6">
            <div className="ps-tesmnl-box">
                <div className="ps-tesmnl-inner">
                    <div className="ps-tesmnl-head-flex">
                        <img src="../assets/images/landing/client2.jpg" alt="Darell Steward" />
                        <div className="ps-tesmnl-clnt-info">
                            <h4>Darell Steward</h4>
                            <p>UI / UX Design</p>
                        </div>
                    </div>
                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.</p>
                </div>
            </div>
        </div>
        {/* Third Client */}
        <div className="col-lg-4 col-md-6">
            <div className="ps-tesmnl-box">
                <div className="ps-tesmnl-inner">
                    <div className="ps-tesmnl-head-flex">
                        <img src="../assets/images/landing/client5.png" alt="Cody Fisher" />
                        <div className="ps-tesmnl-clnt-info">
                            <h4>Cody Fisher</h4>
                            <p>UI / UX Design</p>
                        </div>
                    </div>
                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.</p>
                </div>
            </div>
        </div>
        {/* Fourth Client */}
        <div className="col-lg-4 col-md-6">
            <div className="ps-tesmnl-box">
                <div className="ps-tesmnl-inner">
                    <div className="ps-tesmnl-head-flex">
                        <img src="../assets/images/landing/client4.png" alt="Wade Warren" />
                        <div className="ps-tesmnl-clnt-info">
                            <h4>Wade Warren</h4>
                            <p>UI / UX Design</p>
                        </div>
                    </div>
                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.</p>
                </div>
            </div>
        </div>
        {/* Fifth Client */}
        <div className="col-lg-4 col-md-6">
            <div className="ps-tesmnl-box">
                <div className="ps-tesmnl-inner">
                    <div className="ps-tesmnl-head-flex">
                        <img src="../assets/images/landing/client5.png" alt="Darren Joe" />
                        <div className="ps-tesmnl-clnt-info">
                            <h4>Darren Joe</h4>
                            <p>UI / UX Design</p>
                        </div>
                    </div>
                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.</p>
                </div>
            </div>
        </div>
        {/* Sixth Client */}
        <div className="col-lg-4 col-md-6">
            <div className="ps-tesmnl-box">
                <div className="ps-tesmnl-inner">
                    <div className="ps-tesmnl-head-flex">
                        <img src="../assets/images/landing/client1.jpg" alt="Annette Black" />
                        <div className="ps-tesmnl-clnt-info">
                            <h4>Annette Black</h4>
                            <p>UI / UX Design</p>
                        </div>
                    </div>
                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.</p>
                </div>
            </div>
        </div>
    </div>
</div>

            </section>

            <style jsx global>{`
                .ps-footer-wrapper {
                    background: #0D0D14;
                    padding: 80px 0 40px;
                    position: relative;
                    overflow: hidden;
                }

                .ps-footer-inner {
                    position: relative;
                    z-index: 1;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 15px;
                }

                .ps-footer-main {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 30px;
                    align-items: start;
                }

                .ps-footer-left {
                    text-align: left;
                }

                .ps-footer-logo {
                    margin-bottom: 24px;
                }

                .ps-footer-logo img {
                    height: 40px;
                    width: auto;
                }

                .ps-footer-description {
                    color: #94A3B8;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }

                .ps-footer-center {
                    text-align: center;
                }

                .ps-footer-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .ps-footer-nav-column h4 {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 20px;
                }

                .ps-footer-nav-links {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .ps-footer-nav-links a {
                    color: #94A3B8;
                    font-size: 15px;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .ps-footer-nav-links a:hover {
                    color: #6366f1;
                }

                .ps-footer-right {
                    text-align: right;
                }

                .ps-footer-newsletter {
                    position: relative;
                    margin-bottom: 24px;
                }

                .ps-footer-email {
                    width: 100%;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: #fff;
                    font-size: 15px;
                    transition: all 0.3s ease;
                }

                .ps-footer-email::placeholder {
                    color: #94A3B8;
                }

                .ps-footer-email:focus {
                    outline: none;
                    border-color: #6366f1;
                    background: rgba(255, 255, 255, 0.1);
                }

                .ps-footer-submit {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #6366f1;
                    border: none;
                    border-radius: 6px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .ps-footer-submit:hover {
                    background: #4f46e5;
                }

                .ps-footer-social {
                    display: flex;
                    gap: 16px;
                    justify-content: flex-end;
                }

                .ps-footer-social a {
                    color: #94A3B8;
                    font-size: 20px;
                    transition: color 0.3s ease;
                }

                .ps-footer-social a:hover {
                    color: #6366f1;
                }

                .ps-footer-bottom {
                    margin-top: 60px;
                    padding-top: 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                }

                .ps-copyright p {
                    color: #94A3B8;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .ps-footer-main {
                        grid-template-columns: 1fr;
                        gap: 40px;
                        text-align: center;
                    }

                    .ps-footer-left, .ps-footer-right {
                        text-align: center;
                    }

                    .ps-footer-social {
                        justify-content: center;
                    }
                }
            `}</style>
<style jsx global>{`
        .ps-header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .ps-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ps-logo img {
          height: 40px;
          width: auto;
        }

        .ps-menu ul {
          display: flex;
          gap: 48px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .ps-menu ul li a {
          color: #fff;
          font-size: 16px;
          text-decoration: none;
          transition: color 0.3s;
        }

        .ps-menu ul li a:hover {
          color: #6366f1;
        }

        .ps-header-btn {
          display: flex;
          gap: 16px;
        }

        .login-btn {
          display: inline-flex;
          align-items: center;
          padding: 8px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          color: #fff;
          background: #6366f1;
          border: none;
          transition: all 0.3s;
        }

        .buy-btn {
          display: inline-flex;
          align-items: center;
          padding: 8px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          color: #fff;
          background: #6366f1;
          border: none;
          transition: all 0.3s;
        }

        .login-btn:hover, .buy-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .ps-menu {
            display: none;
          }
          
          .ps-header-btn {
            gap: 8px;
          }
          
          .login-btn, .buy-btn {
            padding: 6px 16px;
            font-size: 14px;
          }
        }
      `}</style>

            <footer className="ps-footer-wrapper">
                    <div className="ps-footer-inner">
                    <div className="ps-footer-main">
                        <div className="ps-footer-left">
                            <div className="ps-footer-logo">
                                <Link href="/">
                                    <img src={userData.adminprofileUrl || process.env.APP_LOGO} alt="Logo" />
                                </Link>
                        </div>
                            <p className="ps-footer-description">
                                Easily Schedule Your Social Media Posts With PlanPost.
                            </p>
                        </div>
                        <div className="ps-footer-center">
                            <div className="ps-footer-nav">
                                <div className="ps-footer-nav-column">
                                    <h4>Company</h4>
                                    <div className="ps-footer-nav-links">
                                        <Link href="/login">Sign in</Link>
                                        <Link href="/privacy-policy">Privacy Policy</Link>
                                        <Link href="/terms">Terms & Conditions</Link>
                                        <Link href="/contact">Contact Us</Link>
                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="ps-footer-right">
                            <div className="ps-footer-newsletter">
                                <input type="email" placeholder="Inter Your Email" className="ps-footer-email" />
                                <button className="ps-footer-submit">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="ps-footer-social">
                                <Link href="#"><i className="fab fa-github"></i></Link>
                                <Link href="#"><i className="fab fa-dribbble"></i></Link>
                                <Link href="#"><i className="fab fa-facebook"></i></Link>
                                <Link href="#"><i className="fab fa-twitter"></i></Link>
                                <Link href="#"><i className="fab fa-instagram"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="ps-footer-bottom">
                        <div className="ps-copyright">
                            <p>Copyright © 2023. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>


        </>
    );
};

export default Home;