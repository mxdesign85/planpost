/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@react-oauth/google',
    '@google/generative-ai'
  ],
  experimental: {
    serverComponentsExternalPackages: ['googleapis', 'google-auth-library', 'gcp-metadata', 'google-logging-utils']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:events': 'events',
        'node:util': 'util',
        'node:process': 'process/browser',
        'node:stream': 'stream-browserify',
        'node:buffer': 'buffer',
        'node:crypto': 'crypto-browserify',
        'node:http': 'stream-http',
        'node:https': 'https-browserify',
        'node:os': 'os-browserify/browser',
        'node:path': 'path-browserify',
        'node:zlib': 'browserify-zlib'
      };

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        zlib: require.resolve('browserify-zlib'),
        events: require.resolve('events/'),
        util: require.resolve('util/'),
        buffer: require.resolve('buffer/')
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      );

      // Exclude server-only packages from client bundles
      config.module.rules.push({
        test: /node_modules[/\\](googleapis|google-auth-library|gcp-metadata|google-logging-utils)[/\\].+\.js$/,
        loader: 'null-loader'
      });
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
    OPENAI_API_KEY: "sk-proj-32g7z5GJg1m9QqqWJ9HmT3BlbkFJttOdpjqUhTFzx5VGeQTU",

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
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URIS: "domain_name/api/social", // Replace the domain name with the Live_URL
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
  },
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/landing.html",
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;