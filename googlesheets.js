import { getValues} from "@velo/google-sheets-integration-backend";
import { getSecret } from "wix-secrets-backend"

export const getLeaderBoardValuesFromSheet = async () => {
    const sheetid = await getSecret("sheetID")
    const values = await getValues(sheetid, "'Leaderboard'!A6:G631")
    return values 
}
export const formatLeaderBoardRowsAndColumns = async (gender) => {

    const leaderBoardData = await getLeaderBoardValuesFromSheet();

	const rows = leaderBoardData.data.values

	const headers = rows[0];
	let formattedColumns = []

	headers.forEach((header) => {
		const column = {
			id: header,
			dataPath: header,
			label: header,
			width: 100,
			visible: true,
			type: "string",
			linkPath: "link-field-or-property",
		}
		formattedColumns.push(column)
	})

	let formattedRows = []
	for( let i = 1; i < rows.length; i++){
		const row = {
		}
		for(let j = 0; j < headers.length; j++){
			let rowValue =rows[i][j]

			if(!(rows[i][j])){
				rowValue = "not specified"
			}
			row[headers[j]] = rowValue;
		}
		// console.log("Row array: ", row.Gender)

		if(gender !== 'all' && row.Gender !== `${gender}`){
			continue;
		}
		formattedRows.push(row)
	}

    return {
        formattedRows, 
        formattedColumns
    }
}

//filter functions

export const filterLeaderBoardRowsAndColumns = async (gender) => {
	const leaderBoardData = await getLeaderBoardValuesFromSheet();

	const rows = leaderBoardData.data.values

	const headers = rows[0];
	let formattedColumns = []

	headers.forEach((header) => {
		const column = {
			id: header,
			dataPath: header,
			label: header,
			width: 100,
			visible: true,
			type: "string",
			linkPath: "link-field-or-property",
		}
		formattedColumns.push(column)
	})

	let formattedRows = []
	for( let i = 1; i < rows.length; i++){
		const row = {

		}
		for(let j = 0; j < headers.length; j++){
			let rowValue =rows[i][j]
			
			if(!(rows[i][j])){
				rowValue = "not specified"
			}
			row[headers[j]] = rowValue;
		}
		if(row.Gender === `${gender}` || row.Gender === "m"){
				continue;
		}
		formattedRows.push(row)
	}

    return {
        formattedRows, 
        formattedColumns
    }
}

export const getRacePointsValuesFromSheet = async () => {
    const sheetid = await getSecret("sheetID")
    const values = await getValues(sheetid, "'Leaderboard'!I6:M631")
    return values 
}
export const getRacePointsRowsAndColumns = async () => {

    const leaderBoardData = await getRacePointsValuesFromSheet();

	const rows = leaderBoardData.data.values

	const headers = rows[0];
	let formattedColumns = []

	headers.forEach((header) => {
		const column = {
			id: header,
			dataPath: header,
			label: header,
			width: 100,
			visible: true,
			type: "string",
			linkPath: "link-field-or-property",
		}
		formattedColumns.push(column)
	})

	let formattedRows = []
	for( let i = 1; i < rows.length; i++){
		const row = {

		}
		for(let j = 0; j < headers.length; j++){
			let rowValue =rows[i][j]
			
			if(!(rows[i][j])){
				rowValue = "not specified"
			}
			row[headers[j]] = rowValue;
		}
		formattedRows.push(row)
	}

    return {
        formattedRows, 
        formattedColumns
    }
}
