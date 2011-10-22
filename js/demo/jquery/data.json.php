<?php

$data = array('name' => 'Vibhaj Rajan',  'time' => date('c'));
$valid = (time()%5);
$arr = array('valid' => $valid, 'msg' => 'Sorry Time not divisible by 5', 'data' => array($data, $data));

echo json_encode($arr);

?>