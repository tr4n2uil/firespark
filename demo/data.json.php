<?php

$arr = array('name' => 'Vibhaj Rajan',  'time' => date('c'));
$json = json_encode($arr);

echo <<<JSON
	{
		metaData: {
			//"idProperty": "id",
			"root": "data",
			"totalProperty": "results",
			"successProperty": "success",
			"fields": [
							{ 	"name": "name"	},
							{	"name": "time" }
						]
			// used by store to set its sortInfo
			//"sortInfo":{
			//   "field": "name",
			//   "direction": "ASC"
			//},
			// paging data (if applicable)
			//"start": 0,
			//"limit": 2,
			// custom property
			//"foo": "bar"
		},
		"success": true,
		"results": 1,
		"data": [ 
			$json
		]
	}
JSON;

?>