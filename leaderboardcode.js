// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import {formatLeaderBoardRowsAndColumns} from "backend/googlesheets"
import {getRacePointsRowsAndColumns} from "backend/googlesheets"
import {getLeaderBoardValuesFromSheet} from "backend/googlesheets"




$w.onReady(function () {
	const populateLeaderBoardTable = async () =>{

		// const leaderBoardData = await getLeaderBoardValuesFromSheet();

		// const rows = leaderBoardData.data.values

		// const headers = rows[0];
		// let formattedColumns = []

		// headers.forEach((header) => {
		// 	const column = {
		// 		id: header,
		// 		dataPath: header,
		// 		label: header,
		// 		width: 100,
		// 		visible: true,
		// 		type: "string",
		// 		linkPath: "link-field-or-property",
		// 	}
		// 	formattedColumns.push(column)
		// })

		// let formattedRows = []
		
		// for( let i = 1; i < rows.length; i++){
		// 	const row = {

		// 	}
		// 	for(let j = 0; j < headers.length; j++){
		// 		let rowValue =rows[i][j]
				
		// 		if(!(rows[i][j])){
		// 			rowValue = "not specified"
		// 		}
		// 		row[headers[j]] = rowValue;
		// 	}
		// 	// console.log("Row array: ", row.Gender)

		// 	if(gender !== 'all' && row.Gender !== `${gender}`){
		// 		continue;
		// 	}
		// 	formattedRows.push(row)
		// }
			

		// return {
		//     formattedRows, 
		//     formattedColumns
		// }



		const leaderboardata = await formatLeaderBoardRowsAndColumns('all')

		$w('#leaderboardTable').columns = leaderboardata.formattedColumns
		$w('#leaderboardTable').rows = leaderboardata.formattedRows
		


		const racepointsdata = await getRacePointsRowsAndColumns()
		$w('#racepointstable').columns = racepointsdata.formattedColumns
		$w('#racepointstable').rows = racepointsdata.formattedRows




	}

	populateLeaderBoardTable()

});


export async function genderDropdown_change(event) {
	let selectedIndex = $w('#genderDropdown').selectedIndex
	let selectedValue = $w('#genderDropdown').options[selectedIndex].value

	console.log("Selected value: ",selectedValue)
	
		const leaderboardata = await formatLeaderBoardRowsAndColumns(selectedValue)
		
		$w('#leaderboardTable').columns = leaderboardata.formattedColumns
		$w('#leaderboardTable').rows = leaderboardata.formattedRows
}
