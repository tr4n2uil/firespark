<?php

$data = array('name' => 'Vibhaj Rajan',  'time' => date('c'));
$arr = array('tpldata' => array('data' => array($data, $data)),
					'service' => array('module' => 'alert',
												'args' => array('title' => 'Test', 'data' => 'Hello World')));
												
echo json_encode($arr);

?>