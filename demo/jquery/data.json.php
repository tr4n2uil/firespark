<?php

$data = array('name' => 'Vibhaj Rajan',  'time' => date('c'));
$arr = array('data' => array($data, $data));
												
echo json_encode($arr);

?>