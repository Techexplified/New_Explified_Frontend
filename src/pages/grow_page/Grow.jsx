import React, { use, useEffect, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import * as images from '../../assets/index'
import { gapi } from "gapi-script";
import { HiEmojiSad } from "react-icons/hi";
import Header from '../../reusable_components/Header';
import { VscDebugDisconnect } from "react-icons/vsc";
import { Spinner } from '@heroui/react';


const API_KEY = "AIzaSyB4jI6tljyG6une7Jh-zMMgu7t9iKnyrA4";
const CLIENT_ID = "937498349924-7ghhhhlv1dibjutkp9pdbkn6d6oflfql.apps.googleusercontent.com";

const SCOPES = "https://www.googleapis.com/auth/yt-analytics.readonly";


const countryNames = {
    AF: "Afghanistan",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AG: "Antigua and Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BR: "Brazil",
    BN: "Brunei",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CV: "Cape Verde",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo (Brazzaville)",
    CD: "Congo (Kinshasa)",
    CR: "Costa Rica",
    CI: "Côte d'Ivoire",
    HR: "Croatia",
    CU: "Cuba",
    CY: "Cyprus",
    CZ: "Czechia",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    ET: "Ethiopia",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GR: "Greece",
    GD: "Grenada",
    GT: "Guatemala",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HN: "Honduras",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JP: "Japan",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KP: "Korea (North)",
    KR: "Korea (South)",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MR: "Mauritania",
    MU: "Mauritius",
    MX: "Mexico",
    FM: "Micronesia",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar (Burma)",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    MK: "North Macedonia",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestine",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PL: "Poland",
    PT: "Portugal",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russia",
    RW: "Rwanda",
    WS: "Samoa",
    SM: "San Marino",
    ST: "São Tomé and Príncipe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    SS: "South Sudan",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syria",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TO: "Tonga",
    TT: "Trinidad and Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VE: "Venezuela",
    VN: "Vietnam",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
};



const Grow = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState(null);
    let temp = {
        likes: 0,
        views: 0,
        subsribers: 0,
        watchHours: 0,
        comments: 0
    }

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: CLIENT_ID,
                scope: SCOPES,
            });
        };

        gapi.load("client:auth2", initClient);
        gapi.load("auth", () => { });
    }, []);

    const handleSignIn = () => {
        gapi.auth.authorize(
            {
                client_id: CLIENT_ID,
                scope: SCOPES,
                response_type: 'token',
            },
            (response) => {
                if (response && !response.error) {
                    console.log("Access token:", response.access_token);
                    setIsSignedIn(true);
                } else {
                    console.error("Auth failed:", response);
                }
            }
        );
    };
    const handleSignOut = () => {
        setIsLoading(true);
        gapi.auth2.getAuthInstance().signOut();
        setReport(null);
        setIsSignedIn(false);
        setIsLoading(false);
    };
    const fetchReport = async () => {
        setIsLoading(true);
        const response = await gapi.client.request({
            path: "https://youtubeanalytics.googleapis.com/v2/reports",
            method: "GET",
            params: {
                ids: "channel==MINE",
                startDate: "2020-01-01",
                endDate: "2024-10-21",
                metrics: "views,likes,subscribersGained,estimatedMinutesWatched,comments",
                dimensions: "day",
                sort: "day",
            },
        });
        // console.log(response.result);
        for (let i = 0; i < response.result.rows.length; i++) {
            temp.views += response.result.rows[i][1];
            temp.likes += response.result.rows[i][2];
            temp.subsribers += response.result.rows[i][3];
            temp.watchHours += response.result.rows[i][4];
            temp.comments += response.result.rows[i][5];
        }
        setReport(temp);
        console.log(temp);
        setIsLoading(false);
    };

    return (
        <>
            <Header />

            <div className='min-h-screen bg-black'>

                <div className="w-full">

                    <div className='w-full flex justify-between p-10 items-center'>
                        <p className='font-semibold text-2xl'>Youtube Analytics</p>
                        <div className="">
                            {!isSignedIn ? (
                                <button className='bg-white text-black sm:py-1 sm:px-4 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white' onClick={handleSignIn}>Connect To Youtube</button>
                            ) : (
                                <div className='flex gap-5'>
                                    <button className='bg-white text-black sm:py-1 sm:px-4 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white' onClick={handleSignOut}>Disconnect</button>
                                    <button className='bg-white text-black sm:py-1 sm:px-4 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white' onClick={fetchReport}>Fetch Analytics</button>
                                </div>
                            )}
                        </div>
                    </div>


                    {isSignedIn ? isLoading ? (<div className='w-full text-center p-10'>
                        <Spinner />
                    </div>) : report ? (<div className='w-full flex justify-center mt-10'>

                        <div className='w-fit text-5xl font-thin flex  px-10 rounded gap-20 flex-wrap'>
                            <div className="flex flex-col items-center gap-10 p-10 border-1 border-[#3f3f3f] rounded-2xl hover:bg-[#2c2c2d]">
                                <p className='text-4xl '>Views</p>
                                <p>{report.views}</p>
                            </div>

                            <div className="flex flex-col items-center gap-10 p-5 border-1 border-[#3f3f3f] rounded-2xl hover:bg-[#2c2c2d]">
                                <p className='text-4xl'>Likes</p>
                                <p>{report.likes}</p>
                            </div>

                            <div className="flex flex-col items-center gap-10 p-5 border-1 border-[#3f3f3f] rounded-2xl hover:bg-[#2c2c2d]">
                                <p className='text-4xl'>Subscribers</p>
                                <p>{report.subsribers}</p>
                            </div>
                            <div className="flex flex-col items-center gap-10 p-5 border-1 border-[#3f3f3f] rounded-2xl hover:bg-[#2c2c2d]">
                                <p className='text-4xl'>Watch Hours</p>
                                <p>{(report.watchHours / 60).toPrecision(3)}</p>
                            </div>
                            <div className="flex flex-col items-center gap-10 p-5 border-1 border-[#3f3f3f] rounded-2xl hover:bg-[#2c2c2d]">
                                <p className='text-4xl'>Comments</p>
                                <p>{report.comments}</p>
                            </div>
                            
                        </div>

                    </div>) : (<div className='text-3xl font-thin text-[#a4a4a3] flex justify-center items-center gap-2'>
                        <p> No Data Found </p>
                        <p className='text-4xl'><HiEmojiSad /></p>
                        <p>!</p>
                    </div>) : (<div className='text-3xl font-thin text-[#a4a4a3] flex justify-center items-center gap-2'>
                        <p>Connect youtube to get data here</p>
                        <p className='text-4xl'><VscDebugDisconnect /></p>
                        <p>!</p>
                    </div>)}



                </div>


            </div>
        </>
    )
}

export default Grow
