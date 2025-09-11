
## Change 1 (9th September,2025) (Changes in MainDashboard.jsx)
- Added a workflow array that looked like this:
   const sampleWorkflows = [
   {
   id: "GoogleSheets-Gmail",
   title: "Email Drip Campaigns",
   description:
   "Send personalized and automated follow-up emails directly from Google Sheets using Gmail to manage outreach campaigns efficiently.",
   tools: [
   { name: "Google Sheets", icon: <SiGooglesheets />, bgColor: "bg-green-500/30" },
   { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
   ],
   category: "Marketing",
   recommended: true,
   },
   ];
- Changed the format of the workflowcards to have this gradient in the background, as inspired from the    Integrations page:
   bg-gradient-to-br from-gray-950/80 to-gray-900/60 bg-opacity-70
- USed some react icons in the card from the official documentation of react-icons on github: https://react-icons.github.io/
## Change 2 (9th September,2025 - DetailedCard.jsx)
- Made changes in the page to match the theme, basically changed the color of elements, charts and circular progress.
- Used color #13FEB3 for the charts and circular Progress.
- Changed the color of the text in multiple places from text-gray-400 to text-white drop-shadow-sm, so that its not only white thereby increasing visibility, but also drops a shadow for a shiny effect.
- Used text-[#00FF38] drop-shadow for a shiny green color.
- Increased the z-index of instagram icon to z-10 so that its visibility increases on top of the cyan gradient.
- Changed the background of the time and posts component as it was black and didnt match with background.
- Changed the border color from border-gray-400 to border-gray-200.
- Changed the color of the X-axis and Y-axis to a lighter white to increase its visibility.
## Change 3 (8th September, 2025)[Changes in the Socials.jsx and SocialCard.jsx]
- Used the following gradient in background to match the MainDashboard, changed its position from absolute to fixed so that it doesnt occupy the full page. 
   <div className="fixed inset-0 rounded-xl opacity-30 pointer-events-none bg-gradient-to-br from-transparent via-cyan-500 to-transparent"></div>
- Changed the color of the Add Profile button to match the theme. USed this graident.
   bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/20 border border-teal-500
- Changed the background of the growth update divs so that they match the background:
   bg-black/20  text-gray-300
   Basically I gave them a black color but with 20% opacity so that the background is not different.
- Changed the socail media cards to give the color to its buttons - Schedule posts , last post, Draft Post      
   bg-gradient-to-r from-teal-600 to-teal-700
   