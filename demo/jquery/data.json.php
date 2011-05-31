<?php

$arr = array('tpldata' => array('name' => 'Vibhaj Rajan',  'time' => date('c')),
					'service' => array('module' => 'alert',
												'args' => array('title' => 'Test', 'data' => 'Hello World')));
echo json_encode($arr);

?>