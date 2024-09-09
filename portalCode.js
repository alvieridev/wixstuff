	import { authentication, currentMember } from "wix-members-frontend";
	import wixLocationFrontend from "wix-location-frontend";
	import {
	    getPooRowsAndColumns,
	    formatRegisterValuesRowsAndColumns,
	    updateStageValuesWrapper,
	    appendValuesToGoogleSheet,
	    getGoodallRowsAndColumns,
	    appendPooValuesToGoogleSheet,
	    getCandiatoSimpsonRowsAndColumns,
	    getQueenStageRowsAndColumns,
	    getFinaleRowsAndColumns
	} from "backend/googlesheets"

	$w.onReady(async function () {

	    let stageName

	    //hide and show section for user to enter stage race values
	    $w("#stageDropdown").onChange(() => {
	        let selectedIndex = $w('#stageDropdown').selectedIndex
	        let selectedValue = $w('#stageDropdown').options[selectedIndex].value
	        console.log("SELECTED STAGE: ", selectedValue)
	        // 			none,none
	        // Riverside,Riverside
	        // Huffer,Huffer
	        // Boat Ramp,Boat Ramp
	        // Kellys to Quinns,Kellys to Quinns
	        // Waitakere Dam Finale,Waitakere Dam Finale
	        if (selectedValue === "none") {
	            $w("#stageSection").hide()
	            return
	        }
	        console.log('show SECTIONS V3')
	        $w("#stageSection").show()

	    })

	    //GET USER DETAILS BY EMAIL 
	    async function getLoggedInUserCity(email) {
	        const data = await formatRegisterValuesRowsAndColumns()
	        const rows = data.formattedRows
	        console.log("All rows", rows)
	        const userRow = rows.find(row => row.Email === email);
	        console.log("Entire userRow: ", userRow)
	        console.log("UserRowIndex: ", userRow.City)
	        return userRow
	    }

	    const isLoggedIn = authentication.loggedIn();

	    if (isLoggedIn) {
	        const loggedInMember = await currentMember.getMember();
	        const contactInfo = loggedInMember.contactDetails;
	        const firstName = loggedInMember.contactDetails.firstName;
	        const lastName = loggedInMember.contactDetails.lastName;

	        const userEmail = loggedInMember.loginEmail;
	        console.log("CONTACT DETAILS:", contactInfo)
	        console.log(" LOGGED IN EMAIL:", userEmail)

	        //find user by email from import values tab in google spreadsheet
	        const userObj = await getLoggedInUserCity(userEmail)
	        if (!userObj) {
	            throw new Error("User not found in important values tab")
	        }
	        const userCity = userObj.City
	        const userWeightClass = userObj.WeightClass
	        const userClub = userObj.Club
	        const userAgeGroup = userObj.AgeGroup
	        const userGender = userObj.Gender
	        console.log(" LOGGED IN ONG FROM IMPORT VALUES TAB:", userObj)
	        $w('#sereiesName').text = `${userCity} HILL CLIMB SERIES`
	        $w('#sereiesName').show()

	        $w('#saveBtn').onClick(async () => {
	            disableFormFields()
	            $w("#loadinglottie").show()
	            $w('#saveBtn').disable()

	            const formIsValid = validateForm()
	            if (!formIsValid) {
	                showErrorMessage("Please Fill in all the required fields")
	                $w("#loadinglottie").hide()
	                $w('#saveBtn').enable()
	                enableFormFields()
	                return
	            }

	            //get race details entered by user
	            const stravaLink = $w('#stravaLink').value
	            const time = $w('#time').value

	            //get the selected stage
	            let selectedIndex = $w('#stageDropdown').selectedIndex
	            let selectedStageValue = $w('#stageDropdown').options[selectedIndex].value
	            console.log("SELECTED STAGE VALUE: ", selectedStageValue)

	            //get the fullname
	            const fullName = `${firstName} ${lastName}`

	            //since the stages are not ready yet, i am manually edditing a city which is Goodall

	            //fetch stage details by selected stage 
	            let stageData
	            switch (selectedStageValue) {
	            case "#2 Goodall":
	                stageData = await getGoodallRowsAndColumns("hl")
	                break;
	            case "#1 Poo":
	                stageData = await getPooRowsAndColumns("hl")
	                break;
	            case "#3 Candia to Simpson":
	                stageData = await getCandiatoSimpsonRowsAndColumns("hl")
	                break;
	            case "#4 Queen Stage":
	                stageData = await getQueenStageRowsAndColumns("hl")
	                break;
	            case "#5 Finale":
	                stageData = await getFinaleRowsAndColumns("hl")
	                break;
	            default:
	                throw new Error("Stage not found");
	            }

	            //get the rows	
	            const rows = stageData.formattedRows
	            console.log("All rows", rows)

	            //find user in selected stage by email
	            const userRow = rows.find(row => row.Email === userEmail);
	            console.log("USER ROW: ", userRow)

	            //if the user is found, therefore the ran the race before, else they are just running the race for the first time

	            // arrange values to insert into google spreadsheet for the selected stage 
	            //  generall: 1.Name	2.Time	3.Points	4.Age Group	5.Athena / Clydesdale  6.Club	7.Strava link	8.Email	9.Responses	10.Gender
	            const values = [fullName, time, 100, userAgeGroup, userWeightClass, userClub, stravaLink, userEmail, "None", userGender]

	            // for poo: 1.Name	2.Time	3.Points	4.(Age Group)	5.(Athena / Clydesdale)	6.Club	7.Strava link	8.Email	9.Gender
	            const Poovalues = [fullName, time, 100, userAgeGroup, userWeightClass, userClub, stravaLink, userEmail, userGender]

	            if (!userRow) {
	                $w("#loadinglottie").show()
	                //append data to google sheets if user is not found. agin if the user is not found in that particular stage iot therefore means they are taking the race for the first time
	                let result
	                if (selectedStageValue === "#1 Poo") {
	                    result = await appendValuesToGoogleSheet(Poovalues, selectedStageValue)
	                    console.log("APPEND VALUES: ", result)
	                    showSucessMessage("Your race values have been added successfully.")
	                    resetForm()
	                    enableFormFields()
	                    $w("#loadinglottie").hide()
	                    $w('#saveBtn').enable()
	                    return
	                }
	                result = await appendValuesToGoogleSheet(values, selectedStageValue)

	                console.log("APPEND VALUES: ", result)
	                showSucessMessage("Your race values have been added successfully.")
	                resetForm()
	                enableFormFields()
	                $w("#loadinglottie").hide()
	                $w('#saveBtn').enable()
	                return
	            }
	            // if user is found, they have probably taken the race already and now retaking the race, update their details instead
	            //Retrieve cell from google sheets
	            const userIndex = userRow.rowIndex + 2
	            console.log("Entire userRow: ", userRow)
	            console.log("UserRowIndex: ", userRow.rowIndex)

	            let range = `A${userIndex}:J${userIndex}` //the column can be different for the different stages

	            if (selectedStageValue === "#1 Poo") {
					
					console.log("UPDATING POO 1" )
	                range = `A${userIndex}:I${userIndex}` //A-I because the Response column is removed in #1 POO
	                console.log('USER RANGE: ', range)
	                const results = await updateStageValuesWrapper(selectedStageValue, Poovalues, range)
	                console.log('RESULTS AFTER UPDATE: ', results)

	                showSucessMessage("Race values succesfully updated")
	                resetForm()

	                $w("#loadinglottie").hide()
	                $w('#saveBtn').enable()
	                return

	            }

	            console.log('USER RANGE: ', range)
	            const results = await updateStageValuesWrapper(selectedStageValue, values, range)
	            console.log('RESULTS AFTER UPDATE: ', results)

	            showSucessMessage("Race values succesfully updated")
	            resetForm()

	            $w("#loadinglottie").hide()
	            $w('#saveBtn').enable()

	        })

	    } else {
	        // Handle when member isn't logged in
	        console.log("NOT LOGGED IN")
	        await authentication.logout()
	        wixLocationFrontend.to("/login")
	        return

	    }

	    const inputArray = [$w("#stravaLink"), $w('#time')]

	    function validateForm() {
	        return inputArray.every((input) => input.valid);
	    }

	    const resetErrorMessage = () => {
	        $w('#errorMessage').hide()
	    }
	    inputArray.forEach((input) => {
	        input.onChange(resetErrorMessage)
	    })

	    function resetForm() {
	        inputArray.forEach((input) => {
	            input.value = ''
	        })
	    }

	    function capitalizeFirstLetters(sentence) {
	        return sentence.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
	    }

	    function showErrorMessage(message) {
	        $w('#sucessMessage').hide()
	        $w('#errorMessage').text = message
	        $w('#errorMessage').show()

	    }

	    function enableFormFields() {
	        inputArray.forEach((input) => {
	            input.enable()
	        })
	    }

	    function disableFormFields() {
	        inputArray.forEach((input) => {
	            input.disable()
	        })
	    }

	    function showSucessMessage(message) {
	        $w('#errorMessage').hide()

	        $w('#sucessMessage').text = message
	        $w('#sucessMessage').show()

	    }

	});

	// export function cityDropdown_change(event) {
	//     let selectedIndex = $w('#cityDropdown').selectedIndex
	//     let selectedValue = $w('#cityDropdown').options[selectedIndex].value

	//     if (selectedValue !== "Auckland") {
	//         $w('#racenotice').hide()
	//         return
	//     }
	//     $w('#racenotice').show()

	// }

	export async function logoutbtn_click(event) {
	    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	    // Add your code for this event here: 
	    await authentication.logout();
	    console.log("LOGOUT")
	    wixLocationFrontend.to('/login')
	}
