import React, { useEffect } from "react";
import Footer from "../../reusable_components/Footer";
import NavBar from "../../reusable_components/NavBar";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <NavBar />
      <div
        style={{
          paddingInline: "150px", // main background
          color: "#BDC4CE", // neutral text color
          minHeight: "100vh", // Ensure it takes full height of the screen
          padding: "50px",
        }}
      >
        <h2 className="text-4xl text-center text-[#23b5b5]">PRIVACY POLICY</h2>

        <section>
          <br></br>

          <p>
            Explified. (“Explified”) owns and operates this explified.com
            website business. All references to “we”, “us”, “our”, this
            “website” or this “site” shall be construed to mean Explified.
          </p>
          <br></br>
          <p>
            This Privacy Policy describes our handling practices and how we
            collect and use the Personal Data (defined below) that you provide
            during your online and offline interactions with us. For more
            information, visit our Trust and Compliance Page.
          </p>
          <br></br>
          <p>
            Our Privacy Policy does not cover the information practices of other
            companies and organizations who advertise our services, and who may
            use cookies, web beacons (pixel tags), and other methodologies to
            serve personalized ads.
          </p>
          <br></br>
        </section>

        {/* Section on modification of privacy policy */}
        <section>
          <h2>HOW WE MODIFY THIS PRIVACY POLICY</h2>
          <br></br>
          <p>
            We may modify this Privacy Policy at any time, and without prior
            notice, by posting an amended Privacy Policy that is always
            accessible by clicking on the “Privacy Policy” link on this site’s
            web pages. Your continued use of this site indicates your acceptance
            of the amended Privacy Policy.
          </p>
          <br></br>
          <p>
            Regarding Personal Data (defined below), if any modifications are
            materially less restrictive regarding our use or disclosure of the
            Personal Data previously disclosed by you, we will obtain your
            consent before implementing such revisions with respect to such
            information.
          </p>
          <br></br>
        </section>

        {/* GDPR compliance section */}
        <section>
          <h2>
            LEGAL BASIS FOR PROCESSING PERSONAL DATA UNDER THE GENERAL DATA
            PROTECTION REGULATION (GDPR)
          </h2>
          <br />
          <p>
            If you are from the European Economic Area (EEA), our legal basis
            for collecting and using Personal Data described in this Privacy
            Policy depends on the Personal Data we collect and the specific
            context in which we collect it.
          </p>
          <br />
          <p>We may process your Personal Data because:</p>
          <ul style={{ paddingInline: "50px" }}>
            <li>We need to perform a contract with you</li>
            <li>You have given us permission to do so</li>
            <li>
              The processing is in our legitimate interests and it’s not
              overridden by your rights
            </li>
            <li>For payment processing purposes</li>
            <li>To comply with the law</li>
          </ul>
          <br />
        </section>

        {/* Section on types of data collected */}
        <section>
          <h2>THE TYPES OF DATA WE COLLECT</h2>
          <br />
          <h3>Personal Data</h3>
          <p>
            “Personal Data” means data about a living individual who can be
            identified from those data (or from those data and other information
            either in our possession or likely to come into our possession).
          </p>
          <br />
          <p>Personal Data may include, but is not limited to:</p>
          <ul style={{ paddingInline: "50px" }}>
            <li>First name and last name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Business name</li>
            <li>Website URL</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Any Personal Data you post on our website</li>
            <li>Any Personal Data you post on a social media platform</li>
            <li>Data about how you use our website</li>
            <li>
              Technical data such as your IP address, your login data, details
              about your browser, time zone settings and other technology on the
              device you use to access our website
            </li>
            <li>Your marketing and communication preferences</li>
            <li>
              Any information that you directly provide to us whether through
              our contact form, over the phone, by email or otherwise
            </li>
            <li>Geo-location data</li>
            <li>Cookies and Usage Data</li>
          </ul>
          <br />

          <h3>Passively or Automatically Collected Data (“Usage Data”)</h3>
          <p>
            We may also collect information regarding how our service is
            accessed and used. This Usage Data may include information such as
            your computer’s Internet Protocol address (e.g. IP address), browser
            type, browser version, the pages of our service that you visit, the
            time and date of your visit, the time spent on those pages, unique
            device identifiers and other diagnostic data.
          </p>
          <br />

          <h3>Geo-Location Data</h3>
          <p>
            If you are accessing a page from a computer or a mobile device, you
            may be asked to share your precise (GPS level) geo-location
            information with us so we can customize your experience when we work
            with a marketing partner such as a third-party service provider,
            advertiser, or advertising network and platform. If you agree to the
            collection of location data, in most cases, you will be able to turn
            off such data collection at any time by accessing the privacy
            settings of your mobile device.
          </p>
          <br />
        </section>

        {/* Section on data collection methods */}
        <section>
          <h2>HOW AND WHEN WE COLLECT DATA</h2>
          <br />
          <h3>Personal Data</h3>
          <p>
            We collect Personal Data on the public areas of our site through
            opt-in forms. We may collect publicly available Personal Data posted
            publicly with social media profile information.
          </p>
          <br />
          <h3>Your Communications with Us</h3>
          <p>
            We collect your Personal Data on the public areas of this site if
            you complete any of our opt-in forms and/or participate in our
            follow-up.
          </p>
          <br />
          <h3>Usage Data</h3>
          <p>
            We collect Usage Data as you use the public areas of this site,
            including your interactions with emails we send, and via social
            media platforms, and services of our marketing partners. This data
            may be passively or automatically collected (that is, gathered
            without your actively providing the information) using various
            analytics and reporting technologies, such as cookies, web beacons,
            locally stored objects, and mobile device identifiers and SDKs, and
            other similar methodologies as well as similar technologies
            developed in the future.
          </p>
          <br />
        </section>

        {/* Section on data usage */}
        <section>
          <h2>HOW WE USE YOUR DATA</h2>
          <br />
          <p>
            We may use your Personal Data collected from the public areas of
            this site if you complete any of our opt-in forms and/or participate
            in our follow-up.
          </p>
          <br />
          <p>
            We may use publicly available Personal Data posted on social media
            profile information including photos for purposes of assisting us,
            and our marketing partners with marketing and advertising activities
            and with contact management.
          </p>
          <br />
        </section>

        {/* Section on data retention */}
        <section>
          <h2>RETENTION OF DATA</h2>
          <br />
          <p>
            We will retain your Personal Data only for as long as is necessary
            for the purposes set out in this Privacy Policy. We will retain and
            use your Personal Data to the extent necessary to comply with our
            legal obligations (for example, if we are required to retain your
            data to comply with applicable laws), resolve disputes, and enforce
            our legal agreements and policies.
          </p>
          <br />
          <p>
            We will also retain Usage Data for internal analysis purposes. Usage
            Data is generally retained for a shorter period of time, except when
            this data is used to strengthen the security or to improve the
            functionality of our service, or we are legally obligated to retain
            this data for longer time periods.
          </p>
          <br />
        </section>

        {/* Section on data transfer */}
        <section>
          <h2>TRANSFER OF DATA</h2>
          <br />
          <p>
            We are located in the United States. Your submission of your
            Personal Data via this website will transfer your Personal Data to
            us. We will not transfer your Personal Data outside the United
            States unless the transfer is made to a country or territory
            recognized by the EU as having an adequate level of data security,
            or is made with your consent, or is made to satisfy our legitimate
            interest regarding our contractual arrangements with our subscribers
            that have contracted for access and use of our online services.
          </p>
          <br />
          <p>
            Your consent to this Privacy Policy followed by your submission of
            your data to us signifies your agreement with these transfers and
            storage of your data.
          </p>
          <br />
        </section>

        {/* Section on data disclosure */}
        <section>
          <h2>DISCLOSURE OF DATA</h2>
          <br />
          <h3>General Disclosure Policy</h3>
          <p>
            We may share and disclose your Personal Data as described below.
          </p>
          <br />

          <h3>Affiliated Entities</h3>
          <p>
            We may provide your Personal Data and Usage Data to any affiliated
            entities we may have, including our subsidiaries. Affiliated
            entities are entities that we legally control (by voting rights) or
            that control us.
          </p>
          <br />

          <h3>Service Providers</h3>
          <p>
            We may provide access to your Personal Data and Usage Data to our
            trusted service providers that assist us with the operation and
            maintenance of this site. For example, we may contract with third
            parties to host our servers, provide security, and optimization,
            analytics services, or process payments.
          </p>
          <br />

          <h3>Business Transfers</h3>
          <p>
            We may disclose and transfer your Personal Data and Usage Data in
            connection with, or during negotiations of, any merger, sale of
            company assets, financing, or acquisition of all or a portion of our
            business to another company.
          </p>
          <br />

          <h3>Legal Obligations</h3>
          <p>
            We may disclose your Personal Data and Usage Data if required to do
            so by law or if we believe that such action is necessary to comply
            with legal obligations or to respond to requests from public
            authorities (including to meet national security or law enforcement
            requirements).
          </p>
          <br />

          <h3>Protection of Rights</h3>
          <p>
            We may disclose your Personal Data and Usage Data if we believe in
            good faith that such disclosure is necessary to protect and defend
            the rights or property of Explified, enforce this Privacy Policy or
            any other agreements, or to investigate or respond to allegations of
            fraud or other unlawful activity.
          </p>
          <br />

          <h3>With Your Consent</h3>
          <p>
            We may disclose your Personal Data and Usage Data for any other
            purpose disclosed at the time you provide your information or with
            your consent.
          </p>
          <br />
        </section>
        <section>
          <h2>
            YOUR DATA PROTECTION RIGHTS UNDER THE GENERAL DATA PROTECTION
            REGULATION (GDPR)
          </h2>
          <br />
          <p>
            If you are a resident of the European Economic Area (EEA), you have
            certain data protection rights. We will take reasonable steps to
            allow you to correct, amend, delete, or limit the use of your
            Personal Data.
          </p>
          <br />
          <p>
            If you wish to be informed what Personal Data we hold about you and
            if you want it to be removed from our systems, please contact us.
          </p>
          <br />
          <p>
            In certain circumstances, you have the following data protection
            rights:
          </p>
          <ul style={{ paddingInline: "50px" }}>
            <li>
              The right to access, update or to delete the information we have
              on you. Whenever made possible, you can access, update or request
              deletion of your Personal Data directly within your account
              settings section. If you are unable to perform these actions
              yourself, please contact us to assist you.
            </li>
            <li>
              The right of rectification. You have the right to have your
              information rectified if that information is inaccurate or
              incomplete.
            </li>
            <li>
              The right to object. You have the right to object to our
              processing of your Personal Data.
            </li>
            <li>
              The right of restriction. You have the right to request that we
              restrict the processing of your personal information.
            </li>
            <li>
              The right to data portability. You have the right to be provided
              with a copy of the information we have on you in a structured,
              machine-readable and commonly used format.
            </li>
            <li>
              The right to withdraw consent. You also have the right to withdraw
              your consent at any time where we have relied on your consent to
              process your personal information.
            </li>
          </ul>
          <br />

          <p>
            Please note that we may ask you to verify your identity before
            responding to such requests.
          </p>
          <br />
          <p>
            You have the right to complain to a Data Protection Authority about
            our collection and use of your Personal Data. For more information,
            please contact your local data protection authority in the European
            Economic Area (EEA).
          </p>
          <br />
        </section>
        <section>
          <h2>SPECIFIC INFORMATION ABOUT COOKIES AND WEB BEACONS</h2>
          <br />
          <p>
            In order to provide better service for our site, we and our
            marketing partners may use cookies and other data collection
            methodologies discussed below to collect Usage Data to store your
            preferences and information about what pages you visit and past
            activity at our site and other websites. This information helps us
            and our marketing partners display personalized ads, compile
            aggregated statistics regarding the effectiveness of our promotional
            campaigns or other operations of our site. For information about
            cookies from the FTC website visit –&gt;
            https://www.consumer.ftc.gov/articles/0042-online-tracking .
          </p>
          <br />
          <p>
            “Cookies” are tiny pieces of information stored by your browser on
            your computer’s hard drive. Cookies are also used to customize
            content based on your browser. Most browsers are initially set to
            accept cookies. If you want to disable cookies, there is a simple
            procedure in most browsers that allows you to turn off cookies.
            Please remember, however, that cookies may be required to allow you
            to use certain features of our site.{" "}
          </p>
          <br></br>
          <p>
            Flash Cookies – third party cookies that use an Adobe Flash Media
            Player local shared object (LSO) – may be used along with other
            third-party cookies for purposes of crediting any purchase you may
            make on this site to one of our joint venture partners that may have
            referred you to us. These cookies will be used for purposes of
            crediting sales to the referring joint venture marketing partner.
            Flash cookies are not the same as “browser cookies”. The Adobe Flash
            Media Player is software that enables users to view content on their
            computers. Flash cookies are also accompanied by a browser cookie.
            If you delete the browser cookie, the Flash cookie may automatically
            create (or re-spawn) a replacement for the browser cookie.{" "}
          </p>
          <br />
          <p>
            Web Beacons (sometimes called single-pixel gifs or clear gifs) are
            used to assist in delivering cookies, and they allow us to count
            users who have visited pages of our site. We may include Web Beacons
            in promotional e-mail messages or our newsletters in order to
            determine whether messages have been opened and acted upon.
          </p>
          <br />
          <p>
            Locally Stored Objects – we may employ locally stored objects
            (“LSOs”) and other client-side storage tracking technologies in
            certain situations where they help to provide a better user
            experience, such as to remember settings, preferences and usage
            similar to browser cookies, or in order to target or help our
            Partners target ads, analyze ad performance, or perform user,
            website or market analytics. For LSOs utilized by Adobe Flash you
            can access Flash management tools from Adobe’s website: –&gt;
            http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html
            . In addition, some, but not all browsers, provide the ability to
            remove LSOs, sometimes within cookie and privacy settings.
          </p>
          <br />
          <h2>REGARDING APPS PUBLISHED BY EXPLIFIED</h2>
          <br />
          <p>
            Explified built the apps under publisher account:
            https://play.google.com/store/apps/developer?id=Explified+Studios as
            Ad Supported apps. This SERVICE is provided by Explified at no cost
            and is intended for use as is.
          </p>
          <br></br>
          <p>
            This page is used to inform visitors regarding our policies with the
            collection, use, and disclosure of Personal Information if anyone
            decided to use our Service.
          </p>
          <br></br>
          <p>
            If you choose to use our Service, then you agree to the collection
            and use of information in relation to this policy. The Personal
            Information that we collect is used for providing and improving the
            Service. We will not use or share your information with anyone
            except as described in this Privacy Policy.
          </p>
          <br></br>
          <p>
            The terms used in this Privacy Policy have the same meanings as in
            our Terms and Conditions, which is accessible at App unless
            otherwise defined in this Privacy Policy.
          </p>
          <br />
          <h2>Information Collection and Use</h2>
          <br />
          <p>
            For a better experience, while using our Service, we may require you
            to provide us with certain personally identifiable information,
            including but not limited to Name, Age, Gender, . The information
            that we request will be retained by us and used as described in this
            privacy policy.
          </p>
          <br />
          <p>
            The app does use third party services that may collect information
            used to identify you.
          </p>
          <br></br>
          <p>
            Link to privacy policy of third party service providers that may be
            used by the apps
          </p>
          <ul style={{ paddingInline: "50px" }}>
            <a href="www.google.com">
              <li>Google Play Services</li>
            </a>
            <a href="www.google.com">
              <li>AdMob</li>
            </a>
            <a href="www.google.com">
              <li>Google Analytics for Firebase</li>
            </a>
            <a href="www.google.com">
              <li>Firebase Crashlytics</li>
            </a>
            <a href="www.google.com">
              <li>Facebook</li>
            </a>
            <a href="www.google.com">
              <li>Fabric</li>
            </a>
            <a href="www.google.com">
              <li>Matomo</li>
            </a>
            <a href="www.google.com">
              <li>Clicky</li>
            </a>
            <a href="www.google.com">
              <li>Unity</li>
            </a>
          </ul>
          <br></br>
        </section>

        <section>
          <h3>Log data</h3>
          <p>
            We want to inform you that whenever you use our Service, in a case
            of an error in the app we collect data and information (through
            third party products) on your phone called Log Data. This Log Data
            may include information such as your device Internet Protocol (“IP”)
            address, device name, operating system version, the configuration of
            the app when utilizing our Service, the time and date of your use of
            the Service, and other statistics.
          </p>
          <br></br>
          <h3>Personalized Ads</h3>
          <p>
            We may participate with our marketing partners for purposes of
            providing personalized ads based on your interests. This activity is
            performed by collecting Usage Data and by using cookies and other
            tracking and data collection methodologies discussed above to
            transfer information to our marketing partners which manage
            advertising activities.
          </p>
          <br />
          <p>
            Our marketing partners may also use cookies and other tracking and
            data collection methodologies discussed above to measure
            advertisement effectiveness and for other purposes that are
            disclosed in their own privacy policies. We have no access or
            control over these cookies and other tracking and data collection
            methodologies that may be used by our marketing partners, and we
            have no responsibility or liability for the privacy policies and
            practices of these sites.
          </p>
          <br></br>
          <p>
            AdWords (Google) – We may participate in AdWords program which is a
            personalized ad service provided by Google Inc. that connects the
            activity of this site with the Adwords advertising network and the
            Doubleclick cookie. Information collected: cookie and Usage Data.
            For the opt-out, visit –&gt;
            https://support.google.com/ads/answer/2662922?hl=en
          </p>
          <br />
          <p>
            Google Analytics for Display Advertising (Google) – We may
            participate in any and all of the following Google Analytics
            Advertising Features provided by Google: Google Analytics, Google
            Display Network Impression Reporting, the DoubleClick Campaign
            Manager integration, and Google Analytics Demographics and Interest
            Reporting. These features use first party cookies (such as the
            Google Analytics cookie) for connecting the tracking activity
            performed by Google Analytics and its cookies with the Adwords
            advertising network and the DoubleClick cookie (a third-party
            cookie). Information collected: cookie and Usage Data, including
            audience data such as age, gender, and interests. For the opt-out,
            visit –&gt; https://support.google.com/ads/answer/2662922?hl=en You
            may opt-out of the Google Analytics service with the Google’s
            Browser Add-on that’s available at –&gt;
            https://tools.google.com/dlpage/gaoptout
          </p>
          <br />
          <p>
            {" "}
            For information in general about Google’s personalized ad campaigns,
            and specifically about information regarding DoubleClick cookies and
            how to control and manage Google’s advertising cookies for these
            campaigns, visit –&gt;
            http://www.google.com/policies/technologies/ads/
          </p>
          <br />
          <p>
            {" "}
            For another Google resource for opting out of Google’s use of
            cookies, visit –&gt; http://www.google.com/settings/ads
          </p>
          <br />
          <p>
            {" "}
            For information regarding how Google uses data when you use Google’s
            partners’ sites or apps, visit –&gt;
            http://www.google.com/policies/privacy/partners/{" "}
          </p>
          <br />
          <p>
            {" "}
            For an additional resource recommended by Google for opting out of a
            third-party vendor’s use of cookies, visit –&gt;
            http://www.networkadvertising.org/managing/opt_out.asp
          </p>
          <br></br>
          <p>
            Custom Audience (Facebook). We may participate in Facebook.com’s
            Custom Audience program which enables us to display personalized ads
            to persons on our email lists when they visit Facebook.com. We
            provide Personal Data such as your email address and phone number to
            Facebook to enable Facebook to determine if you are a registered
            account holder with Facebook. You may opt-out of participation in
            our Facebook Custom Audience by sending an email, from the email
            address you are opting out of, to the email address provided in our
            contact information below. For your opt-out to be effective, you
            must: (i) place the following text in the subject line of the email
            – “Opting Out of Facebook.com Website Custom Audience Ads”, and (ii)
            in the body of the email, include your name and email address. We
            will forward your name and email address to Facebook.com with a
            request to delete you from all of our Facebook Custom Audienc
          </p>
          <br />
          <p>
            Tailored Audiences/Conversion Tracking Programs (Twitter). We may
            participate in Twitter.com’s Tailored Audiences/Conversion Tracking
            Programs which enable us to display personalized ads. You may
            opt-out of participation in these programs by visiting
            https://support.twitter.com/articles/20170405 .
          </p>
          <br />
          <p>
            Other Personalized and Behavioral Advertising services. We may
            participate in additional retargeting and behavioral advertising
            services that will be similar to the services described above.{" "}
          </p>
          <br />
          <p>
            Managing Personalized Ads. You can control the placement of cookies
            and other data collection methodologies for purposes of opting out.
          </p>
          <br />
          <p>
            {" "}
            Managing Cookies Via Your Browser. You should note that although
            most browsers are initially set up to accept cookies, you may be
            able to change your browser settings to cause your browser to refuse
            first party or third-party cookies or to indicate when a third-party
            cookie is being sent. However, disabling or limiting cookies may
            cause certain features of this website to not function properly or
            optimally. Check your browser’s “Help” files or other similar
            resources to learn more about handling cookies on your browser. In
            addition, visit –&gt; http://www.allaboutcookies.org/manage-cookies/
          </p>
          <br></br>
          <p>
            {" "}
            Managing Flash Cookies. Flash cookies, also called local shared
            objects (LSOs), function similarly to standard cookies except that
            they are often larger and are downloaded to a computer or mobile
            device by the Adobe Flash Player. In some cases, these Flash cookies
            can be managed through browser settings. Adobe also provides a means
            of controlling Flash cookies on its Flash Player: Setting Manager
            page.
          </p>
          <br />
          <p>
            {" "}
            Network Advertising Initiative (NAI). A number of companies that use
            cookies to collect information about your online activities are
            members of NAI, which offers a single location to opt out of
            receiving personalized ads from member companies. To opt out of
            information collection by NAI member companies, or to obtain
            information about the technologies they use or their own privacy
            policies, please visit the NAI consumer opt-out page: –&gt;
            http://www.networkadvertising.org/choices/ .
          </p>
          <br />
          <p>
            {" "}
            Digital Advertising Alliance (DAA). DAA member advertising
            associations have developed an industry self-regulatory program to
            give consumers a better understanding of and greater control over
            ads that are customized based on their online behavior across
            different websites. To make choices about interest-based ads from
            participating third parties, please visit DAA Consumer Opt-Out page
            –&gt; http://www.aboutads.info/consumers .
          </p>
          <br />
          <p>
            {" "}
            Opting Out with Ad Choices for Mobile Devices. When using mobile
            applications you may receive personalized in-application
            advertisements. Depending on your device, you may be able to reset
            your mobile device’s advertising identifier at any time by accessing
            the privacy settings on your mobile device. In addition, each
            operating system (iOS for Apple phones, Android for Android devices
            and Windows for Microsoft devices) provides its own instructions on
            how to prevent the delivery of personalized in-application
            advertisements. You may review the support materials and/or the
            privacy settings for the respective operating systems in order to
            opt-out of these advertisements. For any other devices and/or
            operating systems, please visit the privacy settings for the
            applicable device or contact (or review the applicable privacy web
            page of) the applicable platform operator.
          </p>
          <br />
        </section>
        <section>
          <h2>ANALYTICS</h2>
          <br />
          <p>
            We may participate with third party analytics partners to monitor
            and analyze Web traffic and to keep track of user behavior on this
            site.
          </p>
          <br />
          <p>
            Google Analytics (Google) – Google Analytics is a web analysis
            service provided by Google Inc. (“Google”). Google utilizes the data
            collected to track and examine the use of this site, to prepare
            reports on its activities, and to share them with other Google
            services. Information collected: cookie and Usage Data. Visit
            Privacy Policy at –&gt;
            https://www.google.com/intl/en/policies/?fg=1 You may opt-out of the
            Google Analytics service with the Google’s Browser Add-on that’s
            available at –&gt; https://tools.google.com/dlpage/gaoptout .
          </p>
          <br></br>
          <h3>DO NOT TRACK REQUESTS</h3>
          <br />
          <p>
            Some Web browsers incorporate a “Do Not Track” feature that signals
            to websites that you visit that you do not want to have your online
            activity tracked. Each browser communicates “Do Not Track” signals
            to websites differently, making it unworkable to honor each and
            every request correctly. In order to alleviate any communication
            error between browsers and website, we do not respond to “Do Not
            Track” signals at this time. As the technology and communication
            between browser and website improves, we will reevaluate the ability
            to honor “Do Not Track” signals and may make changes to our policy.
          </p>
          <br />
          <h3>DATA SECURITY</h3>
          <br />
          <p>
            We will implement reasonable and appropriate security procedures
            consistent with prevailing industry standards to protect data from
            unauthorized access by physical and electronic intrusion.
            Unfortunately, no data transmission over the Internet or method of
            data storage can be guaranteed 100% secure. Therefore, while we
            strive to protect your Personal Data by following generally accepted
            industry standards, we cannot ensure or warrant the absolute
            security of any information you transmit to us or archive at this
            site.
          </p>
          <br />
          <h3>UPDATING PERSONAL DATA</h3>
          <br />
          <p>
            Upon request, we will permit you to request or make changes or
            updates to your Personal Data for legitimate purposes. We request
            identification prior to approving such requests. We reserve the
            right to decline any requests that are unreasonably repetitive or
            systematic, require unreasonable time or effort of our technical or
            administrative personnel, or undermine the privacy rights of others.
            We reserve the right to permit you to access your Personal Data in
            any account you establish with this site for purposes of making your
            own changes or updates, and in such case, instructions for making
            such changes or updates will be provided where necessary.
          </p>
          <br />
          <h3>CHILDREN’S PRIVACY</h3>
          <br />
          <p>
            We do not knowingly collect personally identifiable information from
            anyone under the age of 18. If you are a parent or guardian who has
            discovered that your child under the age of 18 has submitted his or
            her Personal Data without your permission or consent, we will remove
            the information from our active list, at your request. To request
            the removal of your child’s information, please contact our site as
            provided below under “Contact Us”, and be sure to include in your
            message the same login information that your child submitted.
          </p>
          <br />
          <h3>CONTACT US</h3>
          <br />
          <p>
            Your California Privacy Rights. Under California Law SB 27,
            California residents have the right to receive, once a year,
            information about third parties with whom we have shared information
            about you or your family for their marketing purposes during the
            previous calendar year, and a description of the categories of
            personal information shared. To make such a request, please send an
            email to the email address provided in our contact information below
            and include the phrase “California Privacy Request” in the subject
            line, the domain name of the website you are inquiring about, along
            with your name, address and email address. We will respond to you
            within thirty days of receiving such a request if it is legitimate.
          </p>
          <br />
          <p>
            To address your individual rights, or if you have any questions
            regarding this Privacy Policy, please contact us at the following:
            Email: contact@explified.com
          </p>
          <br />
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
