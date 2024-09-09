import { getValues, appendValues, updateValues } from "@velo/google-sheets-integration-backend";
import { getSecret } from "wix-secrets-backend"

export const getLeaderBoardValuesFromSheet = async () => {
    const sheetid = await getSecret("sheetID")
    const values = await getValues(sheetid, "'Leaderboard'!A6:M631")
    return values
}

export const addImportantRegisterValues = async (values) => {
    const sheetid = await getSecret("sheetID")
    const data = await appendValues(sheetid, values, 'important info')
    return data
}
export const addNewClubToSheet = async (value) => {
    const sheetid = await getSecret("sheetID")
    console.log("value to append", value)
    const data = await appendValues(sheetid, value, 'Enter club')
    return data
}

export const getImportantRegisterValues = async () => {
    const sheetid = await getSecret("sheetID")
    const data = await getValues(sheetid, "'important info'!A1:H999")
    return data
}

export const getClubValues = async () => {
    const sheetid = await getSecret("sheetID")
    const data = await getValues(sheetid, "'Enter club'!A2:B197")
    return data.data.values
}
export const formatRegisterValuesRowsAndColumns = async () => {

    const registerData = await getImportantRegisterValues();

    const rows = registerData.data.values

    const headers = rows[0];
    let formattedColumns = []

    headers.forEach((header) => {

        const column = {
            id: header,
            dataPath: header,
            label: header,
            width: 100,
            visible: header !== "" ? true : false,
            type: "string",
            linkPath: "link-field-or-property",
        }
        formattedColumns.push(column)

    })

    let formattedRows = []
    for (let i = 1; i < rows.length; i++) {

        const row = {
            rowIndex: i
        }
        console.log("rowIndex : ", i)

        for (let j = 0; j < headers.length; j++) {
            let rowValue = rows[i][j]

            row[headers[j]] = rowValue ? rowValue.trim() : rowValue;

        }

        formattedRows.push(row)

    }

    return {
        formattedRows,
        formattedColumns
    }
}

export const formatLeaderBoardRowsAndColumns = async (filterKey, searchClass) => {
    console.log("FILTER KEY", filterKey)
    console.log("Search class", searchClass)
    const leaderBoardData = await getLeaderBoardValuesFromSheet();

    const rows = leaderBoardData.data.values

    const headers = rows[0];
    let formattedColumns = []

    headers.forEach((header) => {

        // let headerLable = header
        // if(header==='test'){
        // headerLable= "Riverside"
        // }
        // if(header==='#2'){
        // 	headerLable= "Onehunga Huffer"
        // }
        // if(header==='#3'){
        // 	headerLable= "Boat Ram"
        // }
        // if(header==='#4'){
        // 	headerLable= " Kellys to Quinns"
        // }
        // if(header==='#5'){
        // 	headerLable= "Waitakere Dam"
        // }

        const column = {
            id: header,
            dataPath: header,
            label: header,
            width: 100,
            visible: header !== "" ? true : false,
            type: header === "Total Points" ? "number" : "string",
            linkPath: "link-field-or-property",
        }
        formattedColumns.push(column)

    })

    let formattedRows = []
    for (let i = 1; i < rows.length; i++) {

        const row = {
            rowIndex: i
        }
        console.log("rowIndex : ", i)

        for (let j = 0; j < headers.length; j++) {
            let rowValue = rows[i][j]

            row[headers[j]] = rowValue ? rowValue.trim() : rowValue;

        }

        //Gender filter
        if (searchClass == 'Gender' && filterKey !== 'all' && row.Gender !== `${filterKey.trim()}`) {
            continue;
        }

        //Filter by name
        if (searchClass == 'Name' && filterKey !== 'all' && row.Name !== `${filterKey.trim()}`) {
            continue;
        }

        //Athena / Clydesdale filter
        if (searchClass == 'Weight' && filterKey !== 'all' && row["Athena / Clydesdale"] !== `${filterKey.trim()}`) {
            continue;
        }

        //filter by age group
        if (searchClass == 'ageGroup' && filterKey !== 'all' && row.Age !== `${filterKey.trim()}`) {
            continue;
        }

        //filter by club
        if (searchClass == 'club' && filterKey !== 'all' && row.Club !== `${filterKey.trim()}`) {
            continue;
        }

        formattedRows.push(row)

    }

    return {
        formattedRows,
        formattedColumns
    }
}

export const getPooValuesFromSheet = async () => {
    const sheetid = await getSecret("sheetID")
    const values = await getValues(sheetid, "'#1 Poo'!A2:I753")
    return values
}

export const getPooRowsAndColumns = async (order) => {

    const leaderBoardData = await getPooValuesFromSheet();

    const rows = leaderBoardData.data.values

    const headers = rows[0];
    let formattedColumns = []

    headers.forEach((header) => {
        const column = {
            id: header,
            dataPath: header,
            label: header,
            width: 100,
            visible: header === 'Responses' || header === "Email" || header === "Excuses/Comments" ? false : true,
            type: "string",
            linkPath: "link-field-or-property",
        }
        formattedColumns.push(column)
    })

    let formattedRows = []
    for (let i = 1; i < rows.length; i++) {
        const row = {
            rowIndex: i
        }
        for (let j = 0; j < headers.length; j++) {
            let rowValue = rows[i][j]

            // if(!(rows[i][j])){
            // 	rowValue = "not specified"
            // }
            row[headers[j]] = rowValue;
        }
        formattedRows.push(row)
    }

    // Sort the formattedRows by Points in descending order (highest to lowest)
    if (order === 'hl') {
        formattedRows.sort((a, b) => parseInt(b.Points) - parseInt(a.Points));
        console.log(order)
        return {
            formattedRows,
            formattedColumns
        }
    }
    // Sort the formattedRows by Points in asscending order (highest to lowest)
    if (order === 'lh') {
        formattedRows.sort((a, b) => parseInt(a.Points) - parseInt(b.Points));
        console.log(order)
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'alph') {
        console.log(order)
        formattedRows.sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
        return {
            formattedRows,
            formattedColumns
        }
    }

}

export async function updateValuesWrapper(values, range) {
	// Name	Time	Points	Age Group	Athena / Clydesdale	Club	Strava link	Email	Gender
    const sheetid = await getSecret("sheetID")
    //‘Tab2!A1:B1’
    const data = await updateValues(sheetid, values, `#1 Poo!${range}`, 'ROWS')
	return data
} 

export const appendPooValuesToGoogleSheet = async (values) => {
    const sheetid = await getSecret("sheetID")
    const data = await appendValues(sheetid, values, '#1 Poo')
    return data
}


//GOODALL DATA STUFF

export const getGoodallValuesFromSheet = async () => {
    const sheetid = await getSecret("sheetID")
    const values = await getValues(sheetid, "'#2 Goodall'!A2:J531")
    return values
}

export const getGoodallRowsAndColumns = async (order) => {

    const leaderBoardData = await getGoodallValuesFromSheet();

    const rows = leaderBoardData.data.values

    const headers = rows[0];
    let formattedColumns = []

    headers.forEach((header) => {
        const column = {
            id: header,
            dataPath: header,
            label: header,
            width: 100,
            // visible: true,
            visible: header === 'Responses' || header === "Comments/Excuses" || header === "Excuses/Comments" ? false : true,
            type: "string",
            linkPath: "link-field-or-property",
        }
        formattedColumns.push(column)
    })

    let formattedRows = []
    for (let i = 1; i < rows.length; i++) {
        const row = {
			rowIndex:i
        }
        for (let j = 0; j < headers.length; j++) {
            let rowValue = rows[i][j]

            // if(!(rows[i][j])){
            // 	rowValue = "not specified"
            // }
            row[headers[j]] = rowValue;
        }
        formattedRows.push(row)
    }

    // Sort the formattedRows by Points in descending order (highest to lowest)
    if (order === 'hl') {
        formattedRows.sort((a, b) => parseInt(b.Points) - parseInt(a.Points));
        return {
            formattedRows,
            formattedColumns
        }
    }
    // Sort the formattedRows by Points in asscending order (highest to lowest)
    if (order === 'lh') {
        formattedRows.sort((a, b) => parseInt(a.Points) - parseInt(b.Points));
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'alph') {
        formattedRows.sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'none') {
        return {
            formattedRows,
            formattedColumns
        }
    }

}


//CANDIA TO SIMPSON DATA STUFF
export const getCandiatoSimpsonValuesFromSheet = async () => {
    const sheetid = await getSecret("sheetID")
    const values = await getValues(sheetid, "'#3 Candia to Simpson'!A2:J617")
    return values
}
export const getCandiatoSimpsonRowsAndColumns = async (order) => {

    const leaderBoardData = await getCandiatoSimpsonValuesFromSheet();

    const rows = leaderBoardData.data.values

    const headers = rows[0];
    let formattedColumns = []

    headers.forEach((header) => {
        const column = {
            id: header,
            dataPath: header,
            label: header,
            width: 100,
            // visible: true,
            visible: header === 'Responses' || header === "Comments/Excuses" || header === "Excuses/Comments" ? false : true,
            type: "string",
            linkPath: "link-field-or-property",
        }
        formattedColumns.push(column)
    })

    let formattedRows = []
    for (let i = 1; i < rows.length; i++) {
        const row = {
            rowIndex: i
        }
        for (let j = 0; j < headers.length; j++) {
            let rowValue = rows[i][j]

            // if(!(rows[i][j])){
            // 	rowValue = "not specified"
            // }
            row[headers[j]] = rowValue;
        }
        formattedRows.push(row)
    }

    // Sort the formattedRows by Points in descending order (highest to lowest)
    if (order === 'hl') {
        formattedRows.sort((a, b) => parseInt(b.Points) - parseInt(a.Points));
        return {
            formattedRows,
            formattedColumns
        }
    }
    // Sort the formattedRows by Points in asscending order (highest to lowest)
    if (order === 'lh') {
        formattedRows.sort((a, b) => parseInt(a.Points) - parseInt(b.Points));
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'alph') {
        formattedRows.sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'none') {
        return {
            formattedRows,
            formattedColumns
        }
    }

}


//QUEEN STAGE DATA STUFF
export const getQueenStageValuesFromSheet = async () => {
    const sheetid = await getSecret("sheetID")
    const values = await getValues(sheetid, "'#4 Queen Stage'!A2:J617")
    return values
}
export const getQueenStageRowsAndColumns = async (order) => {

    const leaderBoardData = await getQueenStageValuesFromSheet();

    const rows = leaderBoardData.data.values

    const headers = rows[0];
    let formattedColumns = []

    headers.forEach((header) => {
        const column = {
            id: header,
            dataPath: header,
            label: header,
            width: 100,
            // visible: true,
            visible: header === 'Responses' || header === "Comments/Excuses" || header === "Excuses/Comments" ? false : true,
            type: "string",
            linkPath: "link-field-or-property",
        }
        formattedColumns.push(column)
    })

    let formattedRows = []
    for (let i = 1; i < rows.length; i++) {
        const row = {
            rowIndex: i
        }
        for (let j = 0; j < headers.length; j++) {
            let rowValue = rows[i][j]

            // if(!(rows[i][j])){
            // 	rowValue = "not specified"
            // }
            row[headers[j]] = rowValue;
        }
        formattedRows.push(row)
    }

    // Sort the formattedRows by Points in descending order (highest to lowest)
    if (order === 'hl') {
        formattedRows.sort((a, b) => parseInt(b.Points) - parseInt(a.Points));
        return {
            formattedRows,
            formattedColumns
        }
    }
    // Sort the formattedRows by Points in asscending order (highest to lowest)
    if (order === 'lh') {
        formattedRows.sort((a, b) => parseInt(a.Points) - parseInt(b.Points));
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'alph') {
        formattedRows.sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'none') {
        return {
            formattedRows,
            formattedColumns
        }
    }

}

export const getFinaleValuesFromSheet = async () => {
    const sheetid = await getSecret("sheetID")
    const values = await getValues(sheetid, "'#5 Finale'!A2:J617")
    return values
}

export const getFinaleRowsAndColumns = async (order) => {

    const leaderBoardData = await getFinaleValuesFromSheet();

    const rows = leaderBoardData.data.values

    const headers = rows[0];
    let formattedColumns = []

    headers.forEach((header) => {
        const column = {
            id: header,
            dataPath: header,
            label: header,
            width: 100,
            visible: header === 'Responses' || header === "Comments/Excuses" || header === "Excuses/Comments" ? false : true,
            type: "string",
            linkPath: "link-field-or-property",
        }
        formattedColumns.push(column)
    })

    let formattedRows = []
    for (let i = 1; i < rows.length; i++) {
        const row = {
            rowIndex: i
        }
        for (let j = 0; j < headers.length; j++) {
            let rowValue = rows[i][j]

            // if(!(rows[i][j])){
            // 	rowValue = "not specified"
            // }
            row[headers[j]] = rowValue;
        }
        formattedRows.push(row)
    }

    // Sort the formattedRows by Points in descending order (highest to lowest)
    if (order === 'hl') {
        formattedRows.sort((a, b) => parseInt(b.Points) - parseInt(a.Points));
        return {
            formattedRows,
            formattedColumns
        }
    }
    // Sort the formattedRows by Points in asscending order (highest to lowest)
    if (order === 'lh') {
        formattedRows.sort((a, b) => parseInt(a.Points) - parseInt(b.Points));
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'alph') {
        formattedRows.sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
        return {
            formattedRows,
            formattedColumns
        }
    }
    if (order === 'none') {
        return {
            formattedRows,
            formattedColumns
        }
    }

}

// GENERAL FUNCTIONS



/**
 * takes value to append to sheet and the stage name ( which is the tab)
 * takes value to append to sheet and the stage name ( which is the tab)
 * takes value to append to sheet and the stage name ( which is the tab)
 */
export const appendValuesToGoogleSheet = async (values, stage) => {
    const sheetid = await getSecret("sheetID")
    const data = await appendValues(sheetid, values, stage)
    return data
}



export async function updateStageValuesWrapper(stage, values, range) {
	//stage=tab name in google sheets
    const sheetid = await getSecret("sheetID")
    //‘Tab2!A1:B1’
    const data = await updateValues(sheetid, values, `${stage}!${range}`, 'ROWS') 
	return data
} 
