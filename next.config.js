/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = {
      fs: false,
      dns: false,
      net: false,
      tls: false,
      child_process: false,
    };

    // Disable cache in development
    if (dev) {
      config.cache = false;
    }

    return config;
  },
  env: {
    SITE_TITLE: "PlanFeed",
    ENVIRONMENT: "dev",
    LIVE_URL : "",
    
    //Basic Details
    APP_LOGO: "/assets/images/Logo.png",
    PRIMARY_COLOR: "",
    SECONDARY_COLOR: "",
    BODY_COLOR: "",
    PRIMARY_LIGHT_COLOR: "",
    PARAGRAPH_COLOR: "",
    HEADING_COLOR: "", 

    //Jwt  token details
    TOKEN_SECRET: "PlanFeed", //Used in JWT Token
    TOKEN_LIFE: "24h",

    //Mongodb Details
    DB_URL: `mongodb+srv://planfeed:1ucZHfSdd4DeKoXs@planfeed.yds83.mongodb.net/`,

    //ChatGPT API details
    OPENAI_API_KEY: "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",

    //S3 Bucket Details
    SECRET_ACCESS_KEY: "oTENua5+I5gUOjbRtuYm9nVD0qFBiGGO1wrm7YwU",
    ACCESS_KEY_ID: "AKIA5FTY66BKLDH5UROZ",
    REGION: "ap-south-1",
    MAX_UPLOAD_SIZE: "1*1024*1024*1024",
    BUCKET_NAME: "testinggw",
    S3_PATH: "",

    //Paypal Details
    PAYPAL_URL: 'https://api-m.paypal.com',

    //Facebook app detailss
    FACEBOOK_APP_ID: "",
    FACEBOOK_SECRET_KEY: "",

    //Linkedin App details
    LINKEDIN_CLIENT_ID: "",
    LINKEDIN_SECRET_KEY: "",
    LINKEDIN_API_VERSION : '202401',


    

    //Pinterest App details
    PINTEREST_APP_ID:"",
    PINTEREST_SECRET_KEY:"",

    //Mandrill App details
    MANDRILL_KEY: "",
    MANDRILL_EMAIL: "",

    /******Constant Details *****/
    //API Url
    PINTEREST_URL: "api.pinterest.com/v5",

    //Redirect Url
    FACEBOOK_REDIRECT_URL: "",
    LINKEDIN_REDIRECT_URL: "/social/linkedin",
    PINTEREST_REDIRECT_URL: "/api/social-pintrest",
    //Auth Relates Data
    API_URL: "/api/",
    ALLOW_IMAGE: ".png, .PNG, .jpg, .JPG, .jpeg, .JPEG, .svg, .SVG",
    ALLOW_VIDEO: ".mp4, .MP4, .webm, .Webm, .FLV, .flv, .MKV, .mkv, .WebM , .mov" ,
    ALLOW_AUDIO: ".mp3, .MP3",
    TYPE: "",
    GOOGLE_CLIENT_ID : "",
    GOOGLE_CLIENT_SECRET : "",
    GOOGLE_REDIRECT_URIS : "domain_name/api/social" // Replace the domain name with the Live_URL

  },
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/landing.html",
      },
    ];
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;