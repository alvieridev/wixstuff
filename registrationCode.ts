	import { authentication } from "wix-members-frontend";
	import wixLocationFrontend from "wix-location-frontend";
	import { addImportantRegisterValues, addNewClubToSheet, getClubValues } from "backend/googlesheets"

	$w.onReady(async function () {

	    // ...
	    const isLoggedIn = authentication.loggedIn();

	    if (isLoggedIn) {
	        wixLocationFrontend.to("/portal")
	        return
	        // const loggedInMember = await currentMember.getMember();
	        // console.log("Member is logged in:", loggedInMember);
	        // const memberId = loggedInMember._id;
	        // const contactId = loggedInMember.contactId;
	        // const contactInfo = loggedInMember.contactDetails;
	        // const userEmail = loggedInMember.loginEmail;
	        // console.log("CONTACT DETAILS:", contactInfo)
	    }
	    await fetchAndSetClubOptions()

	    $w('#registerbtn').onClick(registerUser);

	    async function registerUser() {
	        // Usage
	        const isFormValid = validateForm();
	        if (!isFormValid) {
	            $w('#errorMessage').text = "Please fill in all required fields"
	            $w('#errorMessage').show()
	            return
	        }

	        const firstName = $w("#firstName").value
	        const lastName = $w("#lastName").value
	        const password = $w("#passwordInput").value
	        const email = $w("#emailInput").value
	        const club = $w("#clubDropDown").value
	        const city = $w('#cityDropdown').value
	        const ageGroup = $w("#ageDropDown").value
	        const gender = $w("#genderDropdownRegister").value
	        const weightClass = $w("#weightClass").value

	        if (password.trim().length < 6) {
	            $w('#errorMessage').text = "Password must be more than 6 characters long"
	            $w('#errorMessage').show()
	            return
	        }

	        $w('#loadinglottie').show()
	        $w('#registerbtn').disable()

	        const options = {
	            contactInfo: {
	                firstName,
	                lastName,
	                club,
	                racecity: city,
	                ageGroup,
	                picture: "",
	                weightClass,
	                gender,
	                // role: "race participant"
	            },
	            privacyStatus: "PUBLIC"
	        }
	        console.log("OPTIONS: ", options)

	        try {
	            const registrationResult = await authentication.register(email, password, options)
	            console.log("here now")
	            console.log("regiseration RESULT", registrationResult)
	            if (registrationResult) {
	                console.log("REGISTRATION APPROVAL TOKEN", registrationResult.approvalToken)
	                console.log("REGISTRATION STATUS", registrationResult.status)
	                $w("#sucessMessage").text = "User succesfully Registered"
	                $w("#sucessMessage").show()
	            }

	        } catch (error) {
	            console.error("CATCH ERROR: ", error);
	            if (error == "identity email Already exists") {

	                $w("#errorMessage").text = "email Already exists, please use another email"
	                $w("#errorMessage").show()
	                $w('#loadinglottie').hide()
	                $w('#registerbtn').enable()

	                return
	            }
	            if (error == "authentication canceled") { //registeration succesfull. Currently a bug with wix, where it throws an error even when registration is succesfull
	                $w("#errorMessage").hide()
	                $w("#sucessMessage").text = "Hold on..."
	                // Name	Email	WeightClass	Club	Strava link	Gender	AgeGroup
	                const values = [`${firstName} ${lastName}`, email, weightClass, club, "", gender, ageGroup, city]
	                await addImportantRegisterValues(values)
	                wixLocationFrontend.to("/login");
	                $w("#sucessMessage").show()
	                $w('#registerbtn').enable()
	                $w('#loadinglottie').hide()
	                console.log("redirecting..")
	                return
	            }
	            $w("#errorMessage").text = "An error occured"
	            $w("#errorMessage").show()
	            $w('#registerbtn').enable()
	            $w('#loadinglottie').hide()
	        }

	        $w('#registerbtn').enable()
	        $w('#loadinglottie').hide()
	    }

	    const inputArray = [$w("#firstName"), $w('#lastName'), $w('#genderDropdownRegister'), $w('#ageDropDown'), $w('#emailInput'), $w('#passwordInput'), $w('#waiverCheckBox'),$w('#cityDropdown')]

	    function validateForm() {
	        return inputArray.every((input) => input.valid);
	    }

	    function disableAllRegisterFields() {
	        inputArray.forEach((input) => {
	            input.disable()
	        })
	    }
	    const resetErrorMessage = () => {
	        $w('#errorMessage').hide()
	    }
	    inputArray.forEach((input) => {
	        input.onChange(resetErrorMessage)
	    })

	    function resetForm(message) {

	    }

	    function showSucessMessage(message) {

	    }
	});

	$w('#saveBtn').onClick(async () => {
	    $w('#saveBtn').disable()
	    $w('#saveBtn').label = 'Please Wait...'

	    if (!validateSaveClubForm()) {
	        $w('#errorText').text = "Please enter Club Name"
	        $w('#errorText').show()
	        $w('#saveBtn').enable()
	        return
	    }
	    const clubName = $w('#newClubInput').value
	    const value = [clubName]
	    const result = await addNewClubToSheet(value)
	    if (!result) {
	        $w('#errorText').text = "An error occured"
	        $w('#errorText').show()
	        $w('#saveBtn').enable()
	        return
	    }
	    await fetchAndSetClubOptions()
	    $w('#successMessage').text = "New club added"
	    $w('#successMessage').show()
	    $w('#saveBtn').enable()
	    $w('#addNewClubBox').hide()
	    enableAllRegisterFields()

	})
	const clubInput = [$w("#newClubInput")]

	function validateSaveClubForm() {
	    return clubInput.every((input) => input.valid);
	}
	const resetErrorMessage = () => {
	    $w('#errorText').hide()
	}
	clubInput.forEach((input) => {
	    input.onChange(resetErrorMessage)
	})

	export async function closeBtn_click(event) {
	    await enableAllRegisterFields()
	    $w('#addNewClubBox').hide()

	}

	async function fetchAndSetClubOptions() {
	    console.log("FECHING...")
	    const clubs = await getClubValues()
	    console.log("CLUBS: ", clubs)
	    clubs.forEach((club) => {
	        $w("#clubDropDown").options = $w("#clubDropDown").options.concat({
	            label: club[0],
	            value: club[0]
	        });
	    });

	}
	const inputArray = [$w("#firstName"), $w('#lastName'), $w('#genderDropdownRegister'), $w('#ageDropDown'), $w('#emailInput'), $w('#passwordInput'), $w('#waiverCheckBox'), $w('#cityDropdown')]

	function disableAllRegisterFields() {
	    inputArray.forEach((input) => {
	        input.disable()
	    })
	}

	function enableAllRegisterFields() {
	    inputArray.forEach((input) => {
	        input.enable()
	    })
	}

	export function addNewClubBtn_click(event) {
	    disableAllRegisterFields()
	    $w('#addNewClubBox').show()
	}

$w('#cityDropdown').onChange( () => {
	let selectedIndex = $w('#cityDropdown').selectedIndex
	    let selectedValue = $w('#cityDropdown').options[selectedIndex].value
		console.log("selected value: ", selectedValue)

	    if (selectedValue !== 'Auckland') {
	        $w('#racenotice').hide()
	        return
	    }
	    $w('#racenotice').show()
} )
